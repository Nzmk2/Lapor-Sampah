import React, { useState } from "react";

function ReportCard({ report, onStatusChange, onDelete }) {
  const [showPhoto, setShowPhoto] = useState(false);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID");
  };

  return (
    <div>
      <h3>{report.title}</h3>
      <p>{formatDate(report.created_at)}</p>

      {report.image_url && (
        <img
          src={report.image_url}
          alt={report.title}
          onClick={() => setShowPhoto(!showPhoto)}
          style={{ width: showPhoto ? "300px" : "100px" }}
        />
      )}

      <p>{report.description}</p>

      <p>
        {Number(report.latitude).toFixed(6)},
        {Number(report.longitude).toFixed(6)}
      </p>

      <button onClick={() => onStatusChange(report.id, "IN_PROGRESS")}>
        Proses
      </button>
      <button onClick={() => onStatusChange(report.id, "DONE")}>
        Selesai
      </button>
      <button onClick={() => onDelete(report.id)}>
        Hapus
      </button>
    </div>
  );
}

export default ReportCard;