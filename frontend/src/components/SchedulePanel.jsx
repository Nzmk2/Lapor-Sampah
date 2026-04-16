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

  const getDateState = (d) => {
    const target = new Date(d);
    target.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diff = Math.round((target - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { text: `${Math.abs(diff)} hari lalu`, cls: "date-past" };
    if (diff === 0) return { text: "Hari ini", cls: "date-today" };
    if (diff === 1) return { text: "Besok", cls: "date-upcoming" };
    return { text: `${diff} hari lagi`, cls: "date-upcoming" };
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
    <div className="card schedule-card premium">
      <div className="schedule-head">
        <h2>🗓️ Jadwal Pengangkutan Sampah</h2>
        <p>
          {readOnly
            ? "Jadwal resmi pengangkutan dapat dipantau oleh masyarakat."
            : "Atur jadwal pengangkutan dan pantau prioritas area."}
        </p>
      </div>

      {!readOnly && (
        <form onSubmit={submit} className="schedule-form">
          <div className="sf-group">
            <label>📌 Nama Area</label>
            <input
              placeholder="Contoh: Cikutra, Antapani, Dago"
              value={form.area_name}
              onChange={(e) => setForm({ ...form, area_name: e.target.value })}
              required
            />
          </div>

          <div className="sf-group">
            <label>📅 Tanggal Pengangkutan</label>
            <input
              type="date"
              value={form.pickup_date}
              onChange={(e) => setForm({ ...form, pickup_date: e.target.value })}
              required
            />
          </div>

          <div className="sf-group full">
            <label>📝 Catatan (Opsional)</label>
            <textarea
              placeholder="Contoh: Prioritaskan titik dekat pasar."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <button type="submit" className="schedule-submit">+ Tambah Jadwal</button>
        </form>
      )}

      <div className="schedule-table-wrap">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>📅 Tanggal</th>
              <th>📍 Area</th>
              <th>⏱ Status Waktu</th>
              <th>🗒 Catatan</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="st-center">Memuat jadwal...</td>
              </tr>
            )}

            {!loading && list.length === 0 && (
              <tr>
                <td colSpan={4} className="st-center">
                  <div className="empty-state-mini">
                    <div className="icon">📭</div>
                    <div>Belum ada jadwal pengangkutan.</div>
                  </div>
                </td>
              </tr>
            )}

            {!loading &&
              list.map((s, idx) => {
                const dateState = getDateState(s.pickup_date);
                const isNearest = s.id === nearestId;

                return (
                  <tr
                    key={s.id}
                    className={`${idx % 2 ? "zebra" : ""} ${isNearest ? "nearest-row" : ""}`}
                  >
                    <td>{formatDate(s.pickup_date)}</td>
                    <td>
                      <strong>{s.area_name}</strong>
                      {isNearest && <span className="nearest-badge">Terdekat</span>}
                    </td>
                    <td>
                      <span className={`time-badge ${dateState.cls}`}>{dateState.text}</span>
                    </td>
                    <td>{s.notes || "-"}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SchedulePanel;