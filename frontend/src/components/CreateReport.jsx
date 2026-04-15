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

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Gagal mendapatkan lokasi. Pastikan Anda memberikan izin akses lokasi.");
        }
      );
    } else {
      alert("Browser Anda tidak mendukung geolocation");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim() || !form.address.trim() || !form.latitude || !form.longitude || !photo) {
      alert("Semua field harus diisi dan foto harus dipilih");
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
        <p className="card-subtitle">Laporkan lokasi sampah liar yang Anda temukan agar dapat ditangani segera</p>
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
                type="number"
                name="latitude"
                value={form.latitude}
                onChange={handleInputChange}
                placeholder="Latitude"
                step="0.000001"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="longitude">Longitude</label>
            <div className="input-group">
              <input
                id="longitude"
                type="number"
                name="longitude"
                value={form.longitude}
                onChange={handleInputChange}
                placeholder="Longitude"
                step="0.000001"
                required
              />
            </div>
          </div>
        </div>

        <button type="button" className="btn btn-secondary" onClick={handleGetLocation}>
          <span className="btn-icon">📍</span>
          Ambil Lokasi Saya
        </button>

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