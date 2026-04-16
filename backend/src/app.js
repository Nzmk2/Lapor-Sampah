const express = require("express");
const cors = require("cors");
const reportRoutes = require("./routes/reportRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "laporsampah-backend" });
});

app.use("/api/reports", reportRoutes);
app.use("/api/schedules", scheduleRoutes);

module.exports = app;