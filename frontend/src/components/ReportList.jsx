import React, { useState } from "react";
import ReportCard from "./ReportCard";

function ReportList({ reports, loading, onStatusChange, onDeleteReport }) {
  const [filter, setFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");

  const filteredReports = reports.filter(report => {
    if (filter === "ALL") return true;
    return report.status === filter;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Memuat laporan...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <span className="card-icon">📋</span>
          Daftar Laporan Sampah
        </h2>
      </div>

      <div className="report-controls">
        <div className="filter-group">
          <label>Filter Status:</label>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === "ALL" ? "active" : ""}`}
              onClick={() => setFilter("ALL")}
            >
              Semua ({reports.length})
            </button>
            <button
              className={`filter-btn ${filter === "PENDING" ? "active" : ""}`}
              onClick={() => setFilter("PENDING")}
            >
              Menunggu ({reports.filter(r => r.status === "PENDING").length})
            </button>
            <button
              className={`filter-btn ${filter === "IN_PROGRESS" ? "active" : ""}`}
              onClick={() => setFilter("IN_PROGRESS")}
            >
              Diproses ({reports.filter(r => r.status === "IN_PROGRESS").length})
            </button>
            <button
              className={`filter-btn ${filter === "DONE" ? "active" : ""}`}
              onClick={() => setFilter("DONE")}
            >
              Selesai ({reports.filter(r => r.status === "DONE").length})
            </button>
          </div>
        </div>

        <div className="sort-group">
          <label htmlFor="sortSelect">Urutkan:</label>
          <select
            id="sortSelect"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
          </select>
        </div>
      </div>

      {sortedReports.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>Tidak Ada Laporan</h3>
          <p>Belum ada laporan dengan filter yang dipilih. Buat laporan baru untuk memulai!</p>
        </div>
      ) : (
        <div className="reports-grid">
          {sortedReports.map(report => (
            <ReportCard
              key={report.id}
              report={report}
              onStatusChange={onStatusChange}
              onDelete={onDeleteReport}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ReportList;