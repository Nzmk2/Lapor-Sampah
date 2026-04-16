const express = require("express");
const multer = require("multer");
const {
  createReport,
  getReports,
  updateReportStatus,
  updateReportPriority,
  deleteReport
} = require("../controllers/reportController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("photo"), createReport);
router.get("/", getReports);
router.patch("/:id/status", updateReportStatus);
router.patch("/:id/priority", updateReportPriority);
router.delete("/:id", deleteReport);

module.exports = router;