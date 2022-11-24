const db = require("../db/connection.js");

exports.insertComment = (newComment, review_id) => {
  return db
    .query(
      `INSERT INTO comments
    (author, body, review_id)
    VALUES
    ($1, $2, $3)
    RETURNING *;
    `,
      [newComment.username, newComment.body, review_id]
    )
    .then((result) => {
      const insertedComment = result.rows[0];
      return insertedComment;
    });
};
