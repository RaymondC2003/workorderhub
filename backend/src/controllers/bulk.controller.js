const { parse } = require("csv-parse/sync");
const { AppError } = require("../utils/errors.util");
const { success } = require("../utils/response.util");
const service = require("../services/workorders.service");

const REQUIRED_HEADERS = [
  "title",
  "description",
  "department",
  "priority",
  "requesterName"
];

exports.bulkUpload = (req, res, next) => {
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
};