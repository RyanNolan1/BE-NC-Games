const { updateReviewById } = require("../model/patch-votes.model");

exports.patchVoteById = (req, res, next) => {
  const newVote = req.body.inc_votes;
  const { review_id } = req.params;
  updateReviewById(newVote, review_id)
    .then((review) => {
      res.status(200).send({ review: review });
    })
    .catch((err) => {
      next(err);
    });
};
