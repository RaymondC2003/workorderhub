const { AppError } = require("../utils/errors.util");

module.exports = (req, res, next) => {
  next(new AppError(404, "NOT_FOUND", "Route not found"));
};