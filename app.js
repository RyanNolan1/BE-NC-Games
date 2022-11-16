const express = require("express");

const { getCategories } = require("./controllers/categories.controller");

const { getReviews } = require("./controllers/reviews.controller");

const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Bad Request!" });
});

module.exports = app;
