import { parse } from "csv-parse/sync";
import { AppError } from "../utils/errors.util.js";
import { success } from "../utils/response.util.js";
import * as service from "../services/workorders.service.js";
import { DEPARTMENTS, PRIORITIES } from "../utils/constants.js";

const REQUIRED_HEADERS = [
  "title",
  "description",
  "department",
  "priority",
  "requesterName"
];

function normalizeHeaders(rawHeaders) {
  const rawLower = {};
  for (const h of rawHeaders) {
    const k = (h || "").trim();
    rawLower[k.toLowerCase().replace(/\s+/g, "")] = k;
  }
  const map = {};
  if (rawLower.title !== undefined) map.title = rawLower.title;
  if (rawLower.description !== undefined) map.description = rawLower.description;
  if (rawLower.department !== undefined) map.department = rawLower.department;
  if (rawLower.priority !== undefined) map.priority = rawLower.priority;
  if (rawLower.requestername !== undefined) map.requesterName = rawLower.requestername;
  if (rawLower.assignee !== undefined) map.assignee = rawLower.assignee;
  return map;
}

function normalizeRow(rawRow, headerMap) {
  const row = {};
  for (const [canonical, rawKey] of Object.entries(headerMap)) {
    if (rawRow[rawKey] !== undefined) row[canonical] = String(rawRow[rawKey]).trim();
  }
  return row;
}

function validateRow(row) {
  const errs = [];
  if (!row.title || row.title.length < 5) {
    errs.push({ field: "title", reason: "Min 5 characters" });
  }
  if (!row.description || row.description.length < 10) {
    errs.push({ field: "description", reason: "Min 10 characters" });
  }
  if (!DEPARTMENTS.includes(row.department)) {
    errs.push({
      field: "department",
      reason: "Must be FACILITIES, IT, SECURITY, or HR"
    });
  }
  if (!PRIORITIES.includes(row.priority)) {
    errs.push({ field: "priority", reason: "Must be LOW, MEDIUM, or HIGH" });
  }
  if (!row.requesterName || row.requesterName.length < 3) {
    errs.push({ field: "requesterName", reason: "Min 3 characters" });
  }
  return errs;
}

export function bulkUpload(req, res, next) {
  try {
    if (!req.file) {
      throw new AppError(400, "VALIDATION_ERROR", "CSV file required");
    }

    const content = req.file.buffer.toString();

    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true
    });

    if (records.length === 0) {
      return success(req, res, {
        uploadId: req.requestId,
        strategy: "PARTIAL_ACCEPTANCE",
        totalRows: 0,
        accepted: 0,
        rejected: 0,
        errors: []
      });
    }

    const rawHeaders = Object.keys(records[0]);
    const headerMap = normalizeHeaders(rawHeaders);
    const missingHeaders = REQUIRED_HEADERS.filter(h => !headerMap[h]);
    if (missingHeaders.length > 0) {
      throw new AppError(
        400,
        "VALIDATION_ERROR",
        "Missing required headers: " + missingHeaders.join(", "),
        missingHeaders
      );
    }

    let accepted = 0;
    let rejected = 0;
    const errors = [];

    records.forEach((rawRow, index) => {
      const row = normalizeRow(rawRow, headerMap);
      const rowErrors = validateRow(row);
      if (rowErrors.length > 0) {
        rejected++;
        rowErrors.forEach(({ field, reason }) => {
          errors.push({ row: index + 2, field, reason });
        });
      } else {
        try {
          service.create(row);
          accepted++;
        } catch (err) {
          rejected++;
          errors.push({
            row: index + 2,
            field: "row",
            reason: err.message || "Invalid row"
          });
        }
      }
    });

    success(req, res, {
      uploadId: req.requestId,
      strategy: "PARTIAL_ACCEPTANCE",
      totalRows: records.length,
      accepted,
      rejected,
      errors
    });
  } catch (err) {
    next(err);
  }
}
