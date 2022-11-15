const { selectCategories } = require("../model/games.model.js");

exports.getCategories = (req, res) => {
  selectCategories().then(( categories ) => {
    res.send({ categories });
  });
};
