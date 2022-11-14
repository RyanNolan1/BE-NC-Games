const db = require("../db/connection.js");

exports.selectCategories = () => {
  return db.query("SELECT * FROM categories;").then((result) => {
    console.log(result.rows);
    return result.rows;
  });
};
