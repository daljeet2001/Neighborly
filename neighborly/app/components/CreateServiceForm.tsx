"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "../socket.context";
import { ImagePlus } from "lucide-react";

export default function CreateServiceForm({
  neighborhoodid,
  onCreated,
  setOpen2,
}: {
  neighborhoodid: string;
  onCreated?: (s: any) => void;
  setOpen2: (open: boolean) => void;
}) {
  const { data: session } = useSession();
  const [servicebody, setServiceBody] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const socket = useSocket();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  }, []);

  const uploadPhoto = async () => {
    if (!photo) return null;
    const formData = new FormData();
    formData.append("file", photo);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Photo upload failed");
    const data = await res.json();
    return data.url; 
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return alert("Please sign in");

    setLoading(true);
    try {
      const photoUrl = await uploadPhoto();

      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          servicebody,
          photo: photoUrl,
          neighborhoodId: neighborhoodid,
          lat: location?.lat,
          lng: location?.lng,
        }),
      });

      if (!res.ok) throw new Error("Failed to create service");

      const service = await res.json();
      setOpen2(false);

      if (socket) {
        socket.send(JSON.stringify({ type: "new_service", service }));
      }

      setServiceBody("");
      setPhoto(null);
      setPreview(null);
      if (onCreated) onCreated(service);
    } catch (err) {
      console.error(err);
      alert("Error creating service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white p-3 rounded-xl w-full">
      <h2 className="text-xl font-semibold mb-4">Create Service</h2>

      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-700">
          {session?.user?.name?.[0]?.toUpperCase() || "U"}
        </div>

        <div className="flex-1 space-y-3">
                    {/* Upload button with icon */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="service-photo-upload"
              className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-black"
            >
              <ImagePlus className="w-5 h-5" />
              Upload Photo
            </label>
            <input
              id="service-photo-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setPhoto(file);
                setPreview(file ? URL.createObjectURL(file) : null);
              }}
              className="hidden"
            />
          </div>

          {/* Image Preview */}
          {preview && (
            <div className="relative mt-2">
              <img
                src={preview}
                alt="preview"
                className="w-full max-h-60 rounded-lg object-cover "
              />
            </div>
          )}
          <textarea
            placeholder="Describe your service..."
            value={servicebody}
            onChange={(e) => setServiceBody(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-black"
          />


        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          disabled={loading}
          className="text-white px-6 py-2 rounded-full text-sm font-medium bg-[#0D1164] hover:bg-[#1a1e85] disabled:opacity-50"
        >
          {loading ? "Saving..." : "Post"}
        </button>
      </div>
    </form>
  );
}

