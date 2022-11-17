const express = require("express");

const { getCategories } = require("./controllers/categories.controller");

const { getReviews } = require("./controllers/reviews.controller");

const { getReviewById } = require("./controllers/review-id.controller");

const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewById);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request!" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "SERVER ERROR" });
});

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Bad Request!" });
});

module.exports = app;
