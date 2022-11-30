const { selectUsers } = require("../model/users.model.js");

exports.getUsers = (req, res) => {
  selectUsers().then((users) => {
    res.send({ users });
  });
};
