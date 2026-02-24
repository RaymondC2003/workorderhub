import { error } from "../utils/response.util.js";

export default (err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    err.statusCode = 413;
    err.code = "PAYLOAD_TOO_LARGE";
    err.message = err.message || "File too large";
  }
  if (!err.statusCode) {
    err.statusCode = 500;
    err.code = "INTERNAL_ERROR";
    err.message = "Unexpected error";
  }

  error(req, res, err);
};
