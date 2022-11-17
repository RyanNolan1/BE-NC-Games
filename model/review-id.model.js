const db = require("../db/connection.js");

exports.selectReviewById = (review_id) => {
  return db
    .query(
      `SELECT review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at FROM reviews WHERE review_id = $1;`,
      [review_id]
    )
    .then((res) => {
      return res.rows[0];
    });
};
