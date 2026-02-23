const { AppError } = require("../utils/errors.util");

module.exports = (req, res, next) => {
  const key = req.headers["x-api-key"];

  if (!key || key !== process.env.API_KEY) {
    return next(new AppError(401, "UNAUTHORIZED", "Invalid API key"));
  }

  next();
};