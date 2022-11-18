const db = require("../db/connection.js");

exports.checkReviewExists = (review_id) => {
  return db
    .query(
      `SELECT * FROM reviews WHERE review_id = $1 ORDER BY created_at DESC;`,
      [review_id]
    )
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Review not found!",
        });
      }
      return res.rows;
    });
};
