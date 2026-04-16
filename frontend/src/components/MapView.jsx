import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

function MapView({ reports }) {
  const valid = reports.filter((r) => !isNaN(Number(r.latitude)) && !isNaN(Number(r.longitude)));
  const center = valid.length ? [Number(valid[0].latitude), Number(valid[0].longitude)] : [-6.2, 106.816666];

  return (
    <div className="card" style={{ padding: 16 }}>
      <h2 style={{ marginBottom: 12 }}>🗺️ Peta Sebaran Laporan</h2>
      <MapContainer center={center} zoom={12} style={{ height: 420, width: "100%", borderRadius: 12 }}>
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {valid.map((r) => (
          <Marker key={r.id} position={[Number(r.latitude), Number(r.longitude)]}>
            <Popup>
              <b>{r.title}</b><br />
              Status: {r.status}<br />
              Prioritas: {r.priority || "MEDIUM"}<br />
              <a href={r.image_url} target="_blank" rel="noreferrer">Lihat Foto</a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapView;