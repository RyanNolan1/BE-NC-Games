const { selectCategories } = require("../model/games.model.js");

exports.getCategories = (req, res) => {
  selectCategories().then((games) => {
    res.send({ games });
  });
};
