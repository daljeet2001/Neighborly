"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import type { LatLngExpression } from "leaflet";

export default function NeighborhoodMap() {
  const [posts, setPosts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [icons, setIcons] = useState<{ post: any; service: any; user: any } | null>(null);
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(null);

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

      const userIcon = new L.Icon({
        iconUrl: "/home.png", // add your own icon here
        iconSize: [30, 45],
       
      });

      setIcons({ post: postIcon, service: serviceIcon, user: userIcon });
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

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  if (!icons || !userLocation) return null;

  return (
    <MapContainer
      center={userLocation}
      zoom={14}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains={["a", "b", "c", "d"]}
      />

      {/* User Location Marker */}
      <Marker position={userLocation} icon={icons.user}>
        <Popup>You are here</Popup>
      </Marker>

      {/* {services.map((service) => (
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
      ))} */}
    </MapContainer>
  );
}
