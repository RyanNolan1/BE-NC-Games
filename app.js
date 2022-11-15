const express = require("express");

const { getCategories } = require("./controllers/games.controller");

const app = express();


app.get("/api/categories", getCategories);

module.exports = app;
