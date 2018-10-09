const { Task } = require("zenaton");
var mongoose = require("mongoose");
var Article = mongoose.model("Article");

module.exports = Task("PublishArticleTask", {
  init(articleId) {
    this.articleId = articleId;
  },

  id() {
    return this.articleId;
  },

  handle(done) {
    Article.findByIdAndUpdate(this.articleId, {
      published: true
    })
      .then(done)
      .catch(err => {
        console.error(err);
      });
  }
});
