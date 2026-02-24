import { AppError } from "../utils/errors.util.js";

export default (req, res, next) => {
  next(new AppError(404, "NOT_FOUND", "Route not found"));
};
