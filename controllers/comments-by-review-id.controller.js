const {
  selectReviewCommentsById,
} = require("../model/comments-by-review-id.model");

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewCommentsById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
