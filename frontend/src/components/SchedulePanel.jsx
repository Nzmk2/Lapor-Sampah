import React, { useEffect, useState } from "react";
const API_BASE = "/api";

function SchedulePanel() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ area_name: "", pickup_date: "", notes: "" });

  const load = async () => {
    const r = await fetch(`${API_BASE}/schedules`);
    const d = await r.json();
    setList(Array.isArray(d) ? d : []);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await fetch(`${API_BASE}/schedules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setForm({ area_name: "", pickup_date: "", notes: "" });
    load();
  };

  return (
    <div className="card" style={{ padding: 16 }}>
      <h2>🗓️ Penjadwalan Pengangkutan</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 8, marginTop: 12 }}>
        <input placeholder="Nama Area" value={form.area_name} onChange={(e) => setForm({ ...form, area_name: e.target.value })} required />
        <input type="date" value={form.pickup_date} onChange={(e) => setForm({ ...form, pickup_date: e.target.value })} required />
        <textarea placeholder="Catatan (opsional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <button type="submit">Tambah Jadwal</button>
      </form>

      <div style={{ marginTop: 16 }}>
        {list.map((s) => (
          <div key={s.id}>• {s.pickup_date} — {s.area_name}</div>
        ))}
      </div>
    </div>
  );
}

export default SchedulePanel;