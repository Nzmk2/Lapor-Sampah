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
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  });

  const showAlert = useCallback((message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3500);
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
      fetchReports();
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
      {alert && <Alert message={alert.message} type={alert.type} />}

      <CreateReport onSubmit={handleReportSubmit} />

      <ReportList
        reports={reports}
        loading={loading}
        onStatusChange={handleStatusChange}
        onDeleteReport={handleDeleteReport}
      />
    </div>
  );
}

export default App;