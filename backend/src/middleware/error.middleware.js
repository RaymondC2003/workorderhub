import { error } from "../utils/response.util.js";

export default (err, req, res, next) => {
  if (!err.statusCode) {
    err.statusCode = 500;
    err.code = "INTERNAL_ERROR";
    err.message = "Unexpected error";
  }

  error(req, res, err);
};
