import React, { useState, useRef } from "react";

function CreateReport({ onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    latitude: "",
    longitude: ""
  });
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      alert("Browser tidak mendukung geolocation.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // isi lat/lng otomatis
          setForm((prev) => ({
            ...prev,
            latitude: lat.toFixed(7),
            longitude: lng.toFixed(7),
          }));

          // reverse geocoding -> isi alamat otomatis
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
          );
          const data = await resp.json();

          if (data && data.display_name) {
            setForm((prev) => ({
              ...prev,
              latitude: lat.toFixed(7),
              longitude: lng.toFixed(7),
              address: data.display_name,
            }));
          }

          alert("Lokasi berhasil diambil.");
        } catch (err) {
          console.error(err);
          alert("Lokasi berhasil diambil, tapi alamat otomatis gagal. Isi alamat manual ya.");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error.code, error.message);
        if (error.code === 1) alert("Izin lokasi ditolak. Ubah permission browser jadi Allow.");
        else if (error.code === 2) alert("Lokasi tidak tersedia. Aktifkan GPS/WiFi.");
        else if (error.code === 3) alert("Timeout ambil lokasi. Coba lagi.");
        else alert("Gagal mengambil lokasi.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim() || !form.address.trim() || !form.latitude || !form.longitude || !photo) {
      alert("Semua field harus diisi dan foto harus dipilih");
      return;
    }
  
  const lat = Number(form.latitude);
  const lng = Number(form.longitude);

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    alert("Latitude/Longitude harus berupa angka.");
    return;
  }
  if (lat < -90 || lat > 90) {
    alert("Latitude harus antara -90 sampai 90.");
    return;
  }
  if (lng < -180 || lng > 180) {
    alert("Longitude harus antara -180 sampai 180.");
    return;
  }
  
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (photo) formData.append("photo", photo);

    const success = await onSubmit(formData);

    if (success) {
      setForm({
        title: "",
        description: "",
        address: "",
        latitude: "",
        longitude: ""
      });
      setPhoto(null);
      setPhotoPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }

    setLoading(false);
  };

  return (
    <div className="card form-card">
      <div className="card-header">
        <h2 className="card-title">
          <span className="card-icon">📝</span>
          Buat Laporan Baru
        </h2>
        <p className="card-subtitle">
          Laporkan lokasi sampah liar yang Anda temukan agar dapat segera ditangani
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Judul Laporan</label>
            <input
              id="title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              placeholder="Contoh: Tumpukan sampah di pinggir jalan"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Alamat Lokasi</label>
            <input
              id="address"
              type="text"
              name="address"
              value={form.address}
              onChange={handleInputChange}
              placeholder="Masukkan alamat lengkap"
              required
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="description">Deskripsi Detail</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleInputChange}
            placeholder="Jelaskan kondisi sampah dan dampak yang ditimbulkan..."
            rows="4"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="latitude">Latitude</label>
            <div className="input-group">
              <input
                id="latitude"
                type="text"
                name="latitude"
                value={form.latitude}
                onChange={handleInputChange}
                placeholder="-6.9021600"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="longitude">Longitude</label>
            <div className="input-group">
              <input
                id="longitude"
                type="text"
                name="longitude"
                value={form.longitude}
                onChange={handleInputChange}
                placeholder="107.6191000"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <button
            type="button"
            className="btn-get-location"
            onClick={handleGetLocation}
          >
            <span>📍</span>
            Ambil Lokasi Saya
          </button>
        </div>

        <div className="form-group full-width">
          <label htmlFor="photo">Foto Bukti</label>
          <div className="file-upload">
            <input
              ref={fileInputRef}
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              required
            />
            <div className="file-upload-label">
              <span className="upload-icon">📷</span>
              <span>Klik untuk memilih atau seret foto ke sini</span>
            </div>
          </div>
          {photoPreview && (
            <div className="photo-preview">
              <img src={photoPreview} alt="Preview" />
              <button
                type="button"
                className="remove-photo"
                onClick={() => {
                  setPhoto(null);
                  setPhotoPreview(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            <span className="btn-icon">✓</span>
            {loading ? "Mengirim Laporan..." : "Kirim Laporan"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateReport;