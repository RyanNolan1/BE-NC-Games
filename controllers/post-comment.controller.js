const { insertComment } = require("../model/post-comment.model");

exports.postComment = (req, res, next) => {
  const newComment = req.body;
  const { review_id } = req.params;
  insertComment(newComment, review_id)
    .then((insertedComment) => {
      res.status(201).send({ comment: insertedComment });
    })
    .catch((err) => {
      next(err);
    });
};
