const { error } = require("../utils/response.util");

module.exports = (err, req, res, next) => {
  if (!err.statusCode) {
    err.statusCode = 500;
    err.code = "INTERNAL_ERROR";
    err.message = "Unexpected error";
  }

  error(req, res, err);
};