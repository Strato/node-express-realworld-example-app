# Implementing an article approval workflow with Zenaton

What do you need to manage the approval of an article? A button that says _approve article_, an api route, and a call to the database.

Easy enough? Right. But now, what if you want to limit the time one has to approve an article? Something like two days, or else it is automatically approved (because even moderators take holidays from time to time). That's a whole different story. You need to store, probably within the article, a `limitToApproveDate` field set to now + two days. Then you need to have a cron job that starts from time to time and checks whether articles which have not been approved yet have exceeded their limit date, in which case it needs to update their approval status.

To be fair, it's not _that_ hard. Having a job manager somewhere in your infrastructure is getting quite common these days. But then there's the whole failure management side of things. If the job does not start for whatever reason, how do you retry? How do you gather information in the event of a failure? How do you monitor whether a job that is supposed to run at night has effectively started?

This is what Zenaton aims for: making asynchronous workflows much simpler to deal with, with a full monitoring experience, and retry capabilities.

To implement this article approval workflow, you first need to start the zenaton agent:

```bash
zenaton listen --env=.env --boot=boot.js
```

The `.env` file must contain your Zenaton credentials. The `boot.js` file will register your workflows with the agent. For this demonstration we will create a `PublishArticle` workflow.

```javascript
// boot.js
const zenaton = require("zenaton");

require("./workflows/publishArticle");

zenaton.Client.init("YOUR_API_KEY", "YOUR_API_SECRET", "dev");
```

Then we have the definition of the workflow itself. That includes a task whose responsibility will be to mark the article as published in the event it is approved.

```javascript
// workflows/publishArticle.js
const { Workflow, Wait } = require("zenaton");
const ApproveArticleTask = require("../tasks/approveArticle");

module.exports = Workflow("PublishArticle", {
  init(articleId) {
    this.articleId = articleId;
  },

  id() {
    return this.articleId;
  },

  handle() {
    const event = new Wait("ArticleApproved").days(2).execute();

    if (!event || (event && event.data.approved)) {
      new ApproveArticleTask(this.articleId).execute();
    }
  }
});

// tasks/approveArticle.js
const { Task } = require("zenaton");
const Article = require("../models/article");

module.exports = Task("ApproveArticle", {
  init(articleId) {
    this.articleId = articleId;
  },

  id() {
    return this.articleId;
  },

  handle(done) {
    Article.findByIdAndUpdate(this.articleId, {
      published: true
    }).then(done);
  }
});
```

We have three things involved: a `PublishArticle` workflow, an `ArticleApproved` event and an `ApproveArticle` task. The workflow goes like this: wait for two days to get an `ArticleApproved` event. If after two days you don't get one, or if you get one within those boundaries telling you that the post can be approved (the boolean `event.data.approved`), execute the `ApproveArticle` task. Then the task itself updates the article to publish it.

No cron job involved, everything happens with the simple Zenaton workflow management API.

But what about monitoring? With Zenaton comes a website that allows you to check which workflows are currently running, be notified of possible failures, and even retry failed workflows. Workflows are smart enough to know at which point an error was raised, and restart from that point forward.

But now we've seen how to write and register a workflow, let's see how we start this workflow, as well as send an event to it.

```javascript
// Somewhere in your application
const PublishArticleWorkflow = require("./workflows/publishArticle");

const articleId = "foobar";

new PublishArticleWorkflow(articleId).dispatch();
```

Those simple lines will start the process of waiting for the _foobar_ article approval.

Now how do we effectively notify the workflow that a moderator has approved or rejected our article?

```javascript
// Somewhere else
const PublishArticleWorkflow = require("./workflows/publishArticle");

const articleId = "foobar";

PublishArticleWorkflow.whereId(articleId).send("ArticleApproved", {
  approved: true
});
```

And now you're done. No state management involved, no message broker, no database. All the magic happens in the Zenaton infrastructure.

In conclusion, the Zenaton API will allow you to run many scenarios that would otherwise need a lot of tedious infrastructure administration. It's easy to learn and to maintain, and will soon be available in many languages.
