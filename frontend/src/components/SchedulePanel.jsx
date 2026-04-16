import React, { useEffect, useMemo, useState } from "react";
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
      const arr = Array.isArray(d) ? d : [];
      // urutkan terdekat ke terjauh
      arr.sort((a, b) => new Date(a.pickup_date) - new Date(b.pickup_date));
      setList(arr);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const nearestId = useMemo(() => {
    if (!list.length) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = list
      .map((s) => ({ ...s, diff: new Date(s.pickup_date) - today }))
      .filter((s) => s.diff >= 0)
      .sort((a, b) => a.diff - b.diff);

    return upcoming.length ? upcoming[0].id : null;
  }, [list]);

  const getDayLabel = (d) => {
    const target = new Date(d);
    target.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Hari ini";
    if (diffDays === 1) return "Besok";
    if (diffDays > 1) return `${diffDays} hari lagi`;
    return `${Math.abs(diffDays)} hari lalu`;
  };

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
    <div className="card schedule-card" style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 4 }}>🗓️ Jadwal Pengangkutan Sampah</h2>
      <p style={{ marginBottom: 16, color: "#5c6b65", fontSize: 14 }}>
        {readOnly
          ? "Berikut jadwal pengangkutan yang telah ditetapkan admin."
          : "Kelola jadwal pengangkutan per area agar penanganan lebih teratur."}
      </p>

      {!readOnly && (
        <form
          onSubmit={submit}
          style={{
            background: "#f8fbf9",
            border: "1px solid #e3ece8",
            borderRadius: 12,
            padding: 14,
            marginBottom: 16,
            display: "grid",
            gap: 12
          }}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <label style={labelStyle}>Nama Area</label>
            <input
              style={inputStyle}
              placeholder="Contoh: Cikutra, Antapani, Dago"
              value={form.area_name}
              onChange={(e) => setForm({ ...form, area_name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label style={labelStyle}>Tanggal Pengangkutan</label>
            <input
              style={inputStyle}
              type="date"
              value={form.pickup_date}
              onChange={(e) => setForm({ ...form, pickup_date: e.target.value })}
              required
            />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label style={labelStyle}>Catatan (Opsional)</label>
            <textarea
              style={{ ...inputStyle, minHeight: 86, resize: "vertical" }}
              placeholder="Contoh: Prioritaskan titik dekat pasar."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <button
            type="submit"
            style={{
              border: "none",
              background: "#276b40",
              color: "#fff",
              borderRadius: 10,
              padding: "10px 14px",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            + Tambah Jadwal
          </button>
        </form>
      )}

      <div style={{ overflowX: "auto", border: "1px solid #e6eeea", borderRadius: 12 }}>
        <table className="schedule-table" style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
          <thead>
            <tr>
              <th style={thStyle}>Tanggal</th>
              <th style={thStyle}>Area</th>
              <th style={thStyle}>Keterangan Waktu</th>
              <th style={thStyle}>Catatan</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td style={tdCenterStyle} colSpan={4}>Memuat jadwal...</td>
              </tr>
            )}

            {!loading && list.length === 0 && (
              <tr>
                <td style={tdCenterStyle} colSpan={4}>
                  <div style={{ display: "grid", placeItems: "center", gap: 6, padding: "10px 0" }}>
                    <div style={{ fontSize: 28 }}>📭</div>
                    <div>Belum ada jadwal pengangkutan.</div>
                  </div>
                </td>
              </tr>
            )}

            {!loading &&
              list.map((s, idx) => {
                const isNearest = s.id === nearestId;
                return (
                  <tr
                    key={s.id}
                    style={{
                      background: isNearest
                        ? "#ecf8f0"
                        : idx % 2 === 0
                        ? "#ffffff"
                        : "#fbfdfc"
                    }}
                  >
                    <td style={tdStyle}>{formatDate(s.pickup_date)}</td>
                    <td style={tdStyle}>
                      <strong>{s.area_name}</strong>
                      {isNearest && (
                        <span style={nearestBadgeStyle}>Terdekat</span>
                      )}
                    </td>
                    <td style={tdStyle}>{getDayLabel(s.pickup_date)}</td>
                    <td style={tdStyle}>{s.notes || "-"}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const labelStyle = {
  fontSize: 12,
  fontWeight: 700,
  color: "#3a4340",
  letterSpacing: "0.04em",
  textTransform: "uppercase"
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #cfded7",
  borderRadius: 10,
  outline: "none",
  fontSize: 14,
  background: "#fff",
  color: "#1a1e1c"
};

const thStyle = {
  textAlign: "left",
  padding: "12px 14px",
  background: "#f1f6f3",
  color: "#3a4340",
  fontSize: 13,
  borderBottom: "1px solid #d9e7df"
};

const tdStyle = {
  padding: "12px 14px",
  borderBottom: "1px solid #edf3f0",
  fontSize: 14,
  color: "#1a1e1c",
  verticalAlign: "top"
};

const tdCenterStyle = {
  ...tdStyle,
  textAlign: "center",
  color: "#61726b"
};

const nearestBadgeStyle = {
  marginLeft: 8,
  padding: "2px 8px",
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 700,
  color: "#1d6c3b",
  background: "#d6f2e1",
  border: "1px solid #b9e7cb"
};

export default SchedulePanel;