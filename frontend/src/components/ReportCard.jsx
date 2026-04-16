import React, { useState } from "react";

function ReportCard({ report, onStatusChange, onDelete, onPriorityChange }) {
  const [showPhoto, setShowPhoto] = useState(false);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const getStatusBadge = (status) => {
    const map = {
      PENDING: { cls: "badge-pending", dot: true, label: "Menunggu" },
      IN_PROGRESS: { cls: "badge-progress", dot: true, label: "Diproses" },
      DONE: { cls: "badge-done", dot: true, label: "Selesai" }
    };
    return map[status] || { cls: "badge-pending", dot: true, label: status };
  };

  const getPriorityMeta = (value) => {
    const map = {
      LOW: { icon: "🟢", label: "Rendah", cls: "priority-low" },
      MEDIUM: { icon: "🟡", label: "Sedang", cls: "priority-medium" },
      HIGH: { icon: "🔴", label: "Tinggi", cls: "priority-high" }
    };
    return map[value] || map.MEDIUM;
  };

  const badge = getStatusBadge(report.status);
  const priorityValue = report.priority || "MEDIUM";
  const priorityMeta = getPriorityMeta(priorityValue);

  return (
    <div className="report-card">
      {report.image_url && (
        <div
          className={`report-card-image${showPhoto ? " expanded" : ""}`}
          onClick={() => setShowPhoto(!showPhoto)}
        >
          <img src={report.image_url} alt={report.title} />
          <div className="image-expand-hint">
            <span>{showPhoto ? "Klik untuk kecilkan" : "Klik untuk perbesar"}</span>
          </div>
        </div>
      )}

      <div className="report-card-body">
        <div className="report-card-top">
          <h3 className="report-title">{report.title}</h3>
          <span className={`badge ${badge.cls}`}>
            {badge.dot && <span className="badge-dot"></span>}
            {badge.label}
          </span>
        </div>

        <div className="report-meta">
          <span className="report-date">
            <span>🗓</span>
            {formatDate(report.created_at)}
          </span>
        </div>

        {report.address && (
          <div className="report-address">
            <span className="report-address-icon">📍</span>
            <span>{report.address}</span>
          </div>
        )}

        {report.description && <p className="report-description">{report.description}</p>}

        <span className="report-coords">
          {Number(report.latitude).toFixed(6)}, {Number(report.longitude).toFixed(6)}
        </span>

        <div className="priority-box">
          <div className="priority-label-wrap">
            <span className="priority-label">Prioritas</span>
            <span className={`priority-pill ${priorityMeta.cls}`}>
              <span>{priorityMeta.icon}</span> {priorityMeta.label}
            </span>
          </div>

          <select
            className={`priority-select ${priorityMeta.cls}`}
            value={priorityValue}
            onChange={(e) => onPriorityChange(report.id, e.target.value)}
          >
            <option value="LOW">LOW • Rendah</option>
            <option value="MEDIUM">MEDIUM • Sedang</option>
            <option value="HIGH">HIGH • Tinggi</option>
          </select>
        </div>
      </div>

      <div className="report-card-actions">
        {report.status !== "IN_PROGRESS" && report.status !== "DONE" && (
          <button
            className="btn-process btn-process-progress"
            onClick={() => onStatusChange(report.id, "IN_PROGRESS")}
          >
            🔧 Proses
          </button>
        )}
        {report.status !== "DONE" && (
          <button
            className="btn-process btn-process-done"
            onClick={() => onStatusChange(report.id, "DONE")}
          >
            ✓ Selesai
          </button>
        )}
        <button className="btn-icon-only ml-auto" onClick={() => onDelete(report.id)} title="Hapus laporan">
          🗑
        </button>
      </div>
    </div>
  );
}

export default ReportCard;