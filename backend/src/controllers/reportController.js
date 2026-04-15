const pool = require("../config/db");
const s3 = require("../config/s3");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");

exports.createReport = async (req, res) => {
  try {
    const { title, description, address, latitude, longitude } = req.body;

    if (!title || !description || !address || !latitude || !longitude) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Foto wajib diupload" });
    }

    const fileKey = `reports/${Date.now()}-${uuidv4()}-${req.file.originalname}`;

    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    }));

    const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    const sql = `
      INSERT INTO reports (title, description, address, latitude, longitude, image_url, status)
      VALUES (?, ?, ?, ?, ?, ?, 'OPEN')
    `;
    const [result] = await pool.execute(sql, [
      title, description, address, latitude, longitude, imageUrl
    ]);

    const [rows] = await pool.execute("SELECT * FROM reports WHERE id = ?", [result.insertId]);
    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error("createReport error:", error);
    return res.status(500).json({ message: "Gagal membuat laporan", error: error.message });
  }
};

exports.getReports = async (_req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM reports ORDER BY created_at DESC");
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Gagal mengambil data", error: error.message });
  }
};

exports.updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["OPEN", "IN_PROGRESS", "DONE"].includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    await pool.execute(
      "UPDATE reports SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [status, id]
    );

    const [rows] = await pool.execute("SELECT * FROM reports WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ message: "Laporan tidak ditemukan" });

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Gagal update status", error: error.message });
  }
};