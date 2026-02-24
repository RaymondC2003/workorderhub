import express from "express";
import * as controller from "../controllers/workorders.controller.js";
import {
  validateCreate,
  validateUpdate,
  validateStatus
} from "../middleware/validate.middleware.js";
import upload from "../middleware/upload.middleware.js";
import * as bulkController from "../controllers/bulk.controller.js";

const router = express.Router();

router.get("/", controller.list);
router.post("/", validateCreate, controller.create);

router.post(
  "/bulk-upload",
  upload.single("file"),
  bulkController.bulkUpload
);

router.get("/:id", controller.getById);
router.put("/:id", validateUpdate, controller.update);
router.patch("/:id/status", validateStatus, controller.changeStatus);
router.delete("/:id", controller.remove);

export default router;
