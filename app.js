const express = require("express");

const { getCategories } = require("./controllers/categories.controller");

const { getReviews } = require("./controllers/reviews.controller");

const { getReviewById } = require("./controllers/review-id.controller");

const {
  getCommentsByReviewId,
} = require("./controllers/comments-by-review-id.controller");

const { postComment } = require("./controllers/post-comment.controller");

const { patchVoteById } = require("./controllers/patch-votes.controller");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.post("/api/reviews/:review_id/comments", postComment);

app.patch("/api/reviews/:review_id", patchVoteById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Bad Request!" });
});

//error handlers
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid Request!" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "Bad Request!" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ msg: "Information Missing!" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "SERVER ERROR" });
});

module.exports = app;
