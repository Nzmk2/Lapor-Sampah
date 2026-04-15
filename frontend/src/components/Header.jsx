import React from "react";

function Header({ stats }) {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-brand">
          <div className="brand-icon">🗑️</div>
          <div>
            <h1 className="brand-title">LaporSampah</h1>
            <p className="brand-subtitle">Platform Pelaporan Sampah Liar Indonesia</p>
          </div>
        </div>

        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-label">Total Laporan</div>
              <div className="stat-value">{stats.total}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-label">Menunggu</div>
              <div className="stat-value">{stats.pending}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔧</div>
            <div className="stat-content">
              <div className="stat-label">Sedang Dikerjakan</div>
              <div className="stat-value">{stats.inProgress}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-label">Selesai</div>
              <div className="stat-value">{stats.completed}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;