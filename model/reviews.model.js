const db = require("../db/connection.js");

exports.selectReviews = () => {
  return db
    .query(
      `SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer,COUNT(reviews.review_id):: INT AS comment_count FROM reviews
    
      LEFT JOIN comments ON comments.review_id = reviews.review_id
    
      GROUP BY reviews.review_id
      ORDER BY reviews.created_at DESC;
    `
    )
    .then((result) => {
      return result.rows;
    });
};
