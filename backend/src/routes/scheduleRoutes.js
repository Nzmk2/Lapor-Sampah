const express = require("express");
const { createSchedule, getSchedules } = require("../controllers/scheduleController");

const router = express.Router();

router.post("/", createSchedule);
router.get("/", getSchedules);

module.exports = router;