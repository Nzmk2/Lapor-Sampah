import React, { useState } from "react";

function ReportCard({ report, onStatusChange, onDelete }) {
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
      PENDING:     { cls: "badge-pending",  dot: true, label: "Menunggu"  },
      IN_PROGRESS: { cls: "badge-progress", dot: true, label: "Diproses"  },
      DONE:        { cls: "badge-done",     dot: true, label: "Selesai"   },
    };
    return map[status] || { cls: "badge-pending", dot: true, label: status };
  };

  const badge = getStatusBadge(report.status);

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

        {report.description && (
          <p className="report-description">{report.description}</p>
        )}

        <span className="report-coords">
          {Number(report.latitude).toFixed(6)}, {Number(report.longitude).toFixed(6)}
        </span>
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
        <button
          className="btn-icon-only ml-auto"
          onClick={() => onDelete(report.id)}
          title="Hapus laporan"
        >
          🗑
        </button>
      </div>
    </div>
  );
}

export default ReportCard;