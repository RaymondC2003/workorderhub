import { AppError } from "../utils/errors.util.js";
import { DEPARTMENTS, PRIORITIES, STATUSES } from "../utils/constants.js";

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

export function validateStatus(req, res, next) {
  const { status } = req.body;
  if (status == null || status === "") {
    return next(
      new AppError(400, "VALIDATION_ERROR", "status is required", [
        { field: "status", message: "status is required" }
      ])
    );
  }
  if (!STATUSES.includes(status)) {
    return next(
      new AppError(400, "VALIDATION_ERROR", "Invalid status", [
        {
          field: "status",
          message: "Must be NEW, IN_PROGRESS, BLOCKED, or DONE"
        }
      ])
    );
  }
  next();
}

export function validateUpdate(req, res, next) {
  const { title, description, priority, assignee } = req.body;
  const errors = [];

  if (title !== undefined) {
    if (typeof title !== "string" || title.length < 5) {
      errors.push({ field: "title", message: "Min 5 characters" });
    }
  }
  if (description !== undefined) {
    if (typeof description !== "string" || description.length < 10) {
      errors.push({ field: "description", message: "Min 10 characters" });
    }
  }
  if (priority !== undefined) {
    if (!PRIORITIES.includes(priority)) {
      errors.push({ field: "priority", message: "Must be LOW, MEDIUM, or HIGH" });
    }
  }
  if (assignee !== undefined && assignee !== null) {
    if (typeof assignee !== "string") {
      errors.push({ field: "assignee", message: "Must be string or null" });
    }
  }

  if (errors.length > 0) {
    return next(
      new AppError(400, "VALIDATION_ERROR", "Invalid input", errors)
    );
  }

  next();
}
