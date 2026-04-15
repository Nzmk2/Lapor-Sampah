import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import Header from "./components/Header";
import CreateReport from "./components/CreateReport";
import ReportList from "./components/ReportList";
import Alert from "./components/Alert";

const API_BASE = "/api";

function App() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  });

  const showAlert = useCallback((message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  }, []);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/reports`);

      if (!res.ok) throw new Error("Failed fetch");

      const data = await res.json();
      const reportsData = Array.isArray(data) ? data : [];

      setReports(reportsData);

      setStats({
        total: reportsData.length,
        pending: reportsData.filter(r => r.status === "PENDING").length,
        inProgress: reportsData.filter(r => r.status === "IN_PROGRESS").length,
        completed: reportsData.filter(r => r.status === "DONE").length
      });

    } catch (error) {
      showAlert("Gagal memuat laporan", "error");
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleReportSubmit = async (formData) => {
    try {
      const res = await fetch(`${API_BASE}/reports`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showAlert("Laporan berhasil dikirim!", "success");
      return true;
    } catch (error) {
      showAlert(error.message, "error");
      return false;
    }
  };

  const handleStatusChange = async (id, status) => {
    await fetch(`${API_BASE}/reports/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    fetchReports();
  };

  const handleDeleteReport = async (id) => {
    if (!window.confirm("Yakin hapus?")) return;

    await fetch(`${API_BASE}/reports/${id}`, {
      method: "DELETE"
    });

    fetchReports();
  };

  return (
    <div className="app">
      <Header stats={stats} />

      <div className="top-bar">
        <button
          className={`btn-toggle${isAdmin ? " is-admin" : ""}`}
          onClick={() => setIsAdmin(!isAdmin)}
        >
          {isAdmin ? "← Kembali ke User" : "Masuk Admin Panel"}
        </button>
      </div>

      {alert && <Alert message={alert.message} type={alert.type} />}

      <main className="main">
        {!isAdmin && (
          <div className="content-card">
            <CreateReport onSubmit={handleReportSubmit} />
          </div>
        )}

        {isAdmin && (
          <div className="content-card">
            <ReportList
              reports={reports}
              loading={loading}
              onStatusChange={handleStatusChange}
              onDeleteReport={handleDeleteReport}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;