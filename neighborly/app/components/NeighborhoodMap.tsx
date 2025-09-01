"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import type { LatLngExpression } from "leaflet";

export default function NeighborhoodMap() {
  const [posts, setPosts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [icons, setIcons] = useState<{ post: any; service: any } | null>(null);

  useEffect(() => {
    import("leaflet").then((L) => {
      const postIcon = new L.Icon({
        iconUrl: "/pin.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      const serviceIcon = new L.Icon({
        iconUrl: "/shop.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      setIcons({ post: postIcon, service: serviceIcon });
    });

    const load = async () => {
      const [pData, sData] = await Promise.all([
        fetch("/api/posts").then((res) => res.json()),
        fetch("/api/services").then((res) => res.json()),
      ]);
      setPosts(pData.filter((p: any) => p.lat && p.lng));
      setServices(sData.filter((s: any) => s.lat && s.lng));
    };

    load();
  }, []);

  const center: LatLngExpression = [28.6139, 77.209];

  if (!icons) return null;

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {services.map((service) => (
        <Marker
          key={`service-${service.id}`}
          position={[service.lat, service.lng]}
          icon={icons.service}
        >
          <Popup>
            <strong>{service.name}</strong>
            <p>{service.description}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
