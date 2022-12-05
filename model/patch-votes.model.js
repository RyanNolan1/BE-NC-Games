const db = require("../db/connection.js");

exports.updateReviewById = (inc_votes, review_id) => {
  return db
    .query(
      `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;`,
      [
      inc_votes,
      review_id,
    ])
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Review doesn't exist!" });
      }
      return res.rows[0];
    });
};
