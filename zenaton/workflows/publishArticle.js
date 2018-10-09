const { Workflow, Wait } = require("zenaton");
const PublishArticleTask = require("../tasks/publishArticleTask");

module.exports = Workflow("PublishArticleWorkflow", {
  init(articleId) {
    this.articleId = articleId;
  },

  id() {
    return this.articleId;
  },

  handle() {
    const event = new Wait("ApproveArticle").days(2).execute();

    if (!event || (event && event.data.approved)) {
      new PublishArticleTask(this.articleId).execute();
    }
  }
});
