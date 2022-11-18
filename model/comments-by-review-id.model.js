const db = require("../db/connection.js");

exports.selectReviewCommentsById = (review_id) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body, review_id FROM comments WHERE review_id = $1 ORDER BY created_at DESC;`,
      [review_id]
    )
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({
          status: 200,
          msg: [],
        });
      }
      return res.rows;
    });
};
