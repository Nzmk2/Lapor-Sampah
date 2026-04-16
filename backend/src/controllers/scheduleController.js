const pool = require("../config/db");

exports.createSchedule = async (req, res) => {
  try {
    const { area_name, pickup_date, notes } = req.body;

    if (!area_name || !pickup_date) {
      return res.status(400).json({ message: "area_name dan pickup_date wajib diisi" });
    }

    const [result] = await pool.execute(
      "INSERT INTO schedules (area_name, pickup_date, notes) VALUES (?, ?, ?)",
      [area_name, pickup_date, notes || null]
    );

    const [rows] = await pool.execute("SELECT * FROM schedules WHERE id = ?", [result.insertId]);
    return res.status(201).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Gagal membuat jadwal", error: error.message });
  }
};

exports.getSchedules = async (_req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM schedules ORDER BY pickup_date ASC, id DESC");
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Gagal mengambil jadwal", error: error.message });
  }
};