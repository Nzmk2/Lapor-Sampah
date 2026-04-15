const express = require("express");
const multer = require("multer");
const {
  createReport,
  getReports,
  updateReportStatus
} = require("../controllers/reportController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("photo"), createReport);
router.get("/", getReports);
router.patch("/:id/status", updateReportStatus);

module.exports = router;