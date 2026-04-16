import React, { useEffect, useState } from "react";
const API_BASE = "/api";

function SchedulePanel({ readOnly = false }) {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ area_name: "", pickup_date: "", notes: "" });
  const [loading, setLoading] = useState(false);

  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const load = async () => {
    try {
      setLoading(true);
      const r = await fetch(`${API_BASE}/schedules`);
      const d = await r.json();
      setList(Array.isArray(d) ? d : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (readOnly) return;

    await fetch(`${API_BASE}/schedules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setForm({ area_name: "", pickup_date: "", notes: "" });
    load();
  };

  return (
    <div className="card schedule-card" style={{ padding: 16 }}>
      <h2 style={{ marginBottom: 12 }}>
        🗓️ Jadwal Pengangkutan Sampah
      </h2>

      {!readOnly && (
        <form onSubmit={submit} style={{ display: "grid", gap: 10, marginTop: 4, marginBottom: 16 }}>
          <input
            placeholder="Nama Area"
            value={form.area_name}
            onChange={(e) => setForm({ ...form, area_name: e.target.value })}
            required
          />
          <input
            type="date"
            value={form.pickup_date}
            onChange={(e) => setForm({ ...form, pickup_date: e.target.value })}
            required
          />
          <textarea
            placeholder="Catatan (opsional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <button type="submit">Tambah Jadwal</button>
        </form>
      )}

      <div style={{ overflowX: "auto" }}>
        <table className="schedule-table" style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
          <thead>
            <tr>
              <th style={thStyle}>Tanggal</th>
              <th style={thStyle}>Area</th>
              <th style={thStyle}>Catatan</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td style={tdStyle} colSpan={3}>Memuat jadwal...</td>
              </tr>
            )}

            {!loading && list.length === 0 && (
              <tr>
                <td style={tdStyle} colSpan={3}>Belum ada jadwal.</td>
              </tr>
            )}

            {!loading &&
              list.map((s) => (
                <tr key={s.id}>
                  <td style={tdStyle}>{formatDate(s.pickup_date)}</td>
                  <td style={tdStyle}><strong>{s.area_name}</strong></td>
                  <td style={tdStyle}>{s.notes || "-"}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "12px 14px",
  background: "#f4f7f5",
  color: "#3a4340",
  fontSize: 13,
  borderBottom: "1px solid #d0dbd7"
};

const tdStyle = {
  padding: "12px 14px",
  borderBottom: "1px solid #e8efec",
  fontSize: 14,
  color: "#1a1e1c",
  background: "#fff"
};

export default SchedulePanel;