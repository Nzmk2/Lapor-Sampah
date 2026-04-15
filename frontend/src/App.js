import React, { useEffect, useState } from "react";

const API_BASE = "/api";

function App() {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    latitude: "",
    longitude: ""
  });
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    const res = await fetch(`${API_BASE}/reports`);
    const data = await res.json();
    setReports(data);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (photo) fd.append("photo", photo);

    const res = await fetch(`${API_BASE}/reports`, {
      method: "POST",
      body: fd
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Gagal kirim laporan");
      setLoading(false);
      return;
    }

    setForm({ title: "", description: "", address: "", latitude: "", longitude: "" });
    setPhoto(null);
    await fetchReports();
    setLoading(false);
  };

  const changeStatus = async (id, status) => {
    await fetch(`${API_BASE}/reports/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    fetchReports();
  };

  return (
    <div className="container">
      <h1>LaporSampah - Pelaporan Sampah Liar</h1>

      <form className="card" onSubmit={onSubmit}>
        <h2>Buat Laporan</h2>
        <input
          placeholder="Judul laporan"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Deskripsi"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          placeholder="Alamat"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
        />
        <input
          placeholder="Latitude (contoh: -6.2000000)"
          value={form.latitude}
          onChange={(e) => setForm({ ...form, latitude: e.target.value })}
          required
        />
        <input
          placeholder="Longitude (contoh: 106.8166667)"
          value={form.longitude}
          onChange={(e) => setForm({ ...form, longitude: e.target.value })}
          required
        />
        <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} required />
        <button type="submit" disabled={loading}>
          {loading ? "Mengirim..." : "Kirim Laporan"}
        </button>
      </form>

      <h2>Daftar Laporan</h2>
      {reports.map((r) => (
        <div className="card" key={r.id}>
          <h3>{r.title}</h3>
          <p><b>Status:</b> {r.status}</p>
          <p>{r.description}</p>
          <p><b>Alamat:</b> {r.address}</p>
          <p><b>Koordinat:</b> {r.latitude}, {r.longitude}</p>
          <a href={r.image_url} target="_blank" rel="noreferrer">Lihat Foto</a>
          <div className="btn-group">
            <button onClick={() => changeStatus(r.id, "IN_PROGRESS")}>IN_PROGRESS</button>
            <button onClick={() => changeStatus(r.id, "DONE")}>DONE</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;