import { AppError } from "../utils/errors.util.js";

const DEPARTMENTS = ["FACILITIES", "IT", "SECURITY", "HR"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

export function validateCreate(req, res, next) {
  const {
    title,
    description,
    department,
    priority,
    requesterName
  } = req.body;

  const errors = [];

  if (!title || title.length < 5) {
    errors.push({ field: "title", message: "Min 5 characters" });
  }

  if (!description || description.length < 10) {
    errors.push({ field: "description", message: "Min 10 characters" });
  }

  if (!DEPARTMENTS.includes(department)) {
    errors.push({ field: "department", message: "Invalid department" });
  }

  if (!PRIORITIES.includes(priority)) {
    errors.push({ field: "priority", message: "Invalid priority" });
  }

  if (!requesterName || requesterName.length < 3) {
    errors.push({ field: "requesterName", message: "Min 3 characters" });
  }

  if (errors.length > 0) {
    return next(
      new AppError(400, "VALIDATION_ERROR", "Invalid input", errors)
    );
  }

  next();
}
