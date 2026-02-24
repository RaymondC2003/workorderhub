import { parse } from "csv-parse/sync";
import { AppError } from "../utils/errors.util.js";
import { success } from "../utils/response.util.js";
import * as service from "../services/workorders.service.js";

const REQUIRED_HEADERS = [
  "title",
  "description",
  "department",
  "priority",
  "requesterName"
];

export function bulkUpload(req, res, next) {
  try {
    if (!req.file) {
      throw new AppError(400, "VALIDATION_ERROR", "CSV file required");
    }

    const content = req.file.buffer.toString();

    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    const headers = Object.keys(records[0] || {});
    const missingHeaders = REQUIRED_HEADERS.filter(
      h => !headers.includes(h)
    );

    if (missingHeaders.length > 0) {
      throw new AppError(
        400,
        "VALIDATION_ERROR",
        "Missing required headers",
        missingHeaders
      );
    }

    let accepted = 0;
    let rejected = 0;
    const errors = [];

    records.forEach((row, index) => {
      try {
        service.create(row);
        accepted++;
      } catch (err) {
        rejected++;
        errors.push({
          row: index + 2,
          reason: err.message
        });
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
