const { selectCategories } = require("../model/categories.model.js");

exports.getCategories = (req, res) => {
  selectCategories().then(( categories ) => {
    res.send({ categories });
  });
};
