import { AppError } from "../utils/errors.util.js";

export default (req, res, next) => {
  const key = (req.headers["x-api-key"] || "").trim();
  const expected = (process.env.API_KEY || "").trim();

  if (!expected || key !== expected) {
    return next(new AppError(401, "UNAUTHORIZED", "Invalid API key"));
  }

  next();
};
