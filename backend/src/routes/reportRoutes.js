const express = require("express");
const multer = require("multer");
const {
  createReport,
  getReports,
  updateReportStatus,
  deleteReport
} = require("../controllers/reportController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("photo"), createReport);
router.get("/", getReports);
router.patch("/:id/status", updateReportStatus);
router.delete("/:id", deleteReport);

module.exports = router;