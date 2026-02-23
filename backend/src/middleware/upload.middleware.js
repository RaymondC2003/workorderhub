const multer = require("multer");
const { AppError } = require("../utils/errors.util");

const upload = multer({
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (!file.originalname.endsWith(".csv")) {
      return cb(
        new AppError(415, "UNSUPPORTED_MEDIA_TYPE", "Only CSV files allowed")
      );
    }
    cb(null, true);
  }
});

module.exports = upload;