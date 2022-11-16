const { selectReviews } = require("../model/reviews.model.js");

exports.getReviews = (req, res) => {
  selectReviews().then((reviews) => {
    res.send({ reviews });
  });
};
