"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "../socket.context";
import { ImagePlus } from "lucide-react";

export default function CreatePostForm({
  neighborhoodid,
  onCreated,
}: {
  neighborhoodid: string;
  onCreated?: (p: any) => void;
}) {
  const { data: session } = useSession();
  const [postbody, setPostBody] = useState("");
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



      
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postbody,
          photo: photoUrl,
          neighborhoodId: neighborhoodid,
          lat: location?.lat,
          lng: location?.lng,
        }),
      });

      if (!res.ok) throw new Error("Failed to create post");

      const post = await res.json();
      if (socket) {
        socket.send(JSON.stringify({ type: "new_post", post }));
      }

      setPostBody("");
      setPhoto(null);
      setPreview(null);
      if (onCreated) onCreated(post);
    } catch (err) {
      console.error(err);
      alert("Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="p-3 flex flex-col md:flex-row gap-8 w-full max-w-4xl"
    >
      <div className="flex-[2] space-y-4">
        <div className="flex items-start gap-4">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 font-semibold">
              {session?.user?.name?.[0] ?? "U"}
            </div>
          )}

          <div className="flex-1 space-y-3">
                 {/* Upload button with icon */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="photo-upload"
                className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-black"
              >
                <ImagePlus className="w-5 h-5" />
                Upload Photo
              </label>
              <input
                id="photo-upload"
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
              value={postbody}
              onChange={(e) => setPostBody(e.target.value)}
              placeholder="What's on your mind, neighbor?"
              className="w-full resize-none border border-gray-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-black"
              rows={4}
            />

       

      
          </div>
        </div>

        <div className="flex items-center gap-3 pt-3">
          <button
            type="submit"
            disabled={loading}
            className="ml-auto font-semibold text-white bg-[#0D1164] hover:bg-[#1a1e85] px-4 py-2 rounded-full"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </form>
  );
}

