const express = require("express");
const controller = require("../controllers/workorders.controller");
const { validateCreate } = require("../middleware/validate.middleware");
const upload = require("../middleware/upload.middleware");
const bulkController = require("../controllers/bulk.controller");

const router = express.Router();

router.get("/", controller.list);
router.post("/", validateCreate, controller.create);

router.post(
  "/bulk-upload",
  upload.single("file"),
  bulkController.bulkUpload
);

router.get("/:id", controller.getById);
router.patch("/:id/status", controller.changeStatus);

module.exports = router;