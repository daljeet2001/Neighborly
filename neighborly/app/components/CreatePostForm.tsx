"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "../socket.context";

export default function CreatePostForm({
  neighborhoodid,
  onCreated,
}: {
  neighborhoodid: string;
  onCreated?: (p: any) => void;
}) {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const socket = useSocket();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert("Please sign in first");
      return;
    }
    if (!title || !description) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        category,
        neighborhoodId: neighborhoodid,
        lat: location?.lat,
        lng: location?.lng,
      }),
    });

    if (!res.ok) {
      alert("Failed to create post");
      setLoading(false);
      return;
    }

    const post = await res.json();
    try {
      if (socket) {
        socket.send(JSON.stringify({ type: "new_post", post }));
      }
    } catch (e) {
      // ignore socket errors
    }

    setTitle("");
    setDescription("");
    setLoading(false);
    if (onCreated) onCreated(post);
  };

  return (
    <form
      onSubmit={submit}
      className="p-2 flex flex-col md:flex-row gap-8 w-full max-w-4xl"
    >
      {/* Left side: avatar + inputs */}
      <div className="flex-[2] space-y-4">
        <div className="flex items-start gap-4">
          {/* Avatar circle with fallback */}
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
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's on your mind, neighbor?"
              className="w-full resize-none border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              rows={4}
            />
          </div>
        </div>

        {/* Action row */}
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

      {/* Right side: Create something (categories) */}
      <div className="flex-[1] border-t md:border-t-0 md:border-l border-gray-200 md:pl-6 pt-4 md:pt-0 space-y-3">
        <h3 className="text-sm font-semibold text-gray-600">Create something</h3>
        {[
          { key: "help", label: "Help" },
          { key: "service", label: "Service" },
          { key: "sell", label: "Buy / Sell" },
        ].map((opt) => (
      <div
  key={opt.key}
  tabIndex={0}  
  role="button" 
  onClick={() => setCategory(opt.key)}
  onKeyDown={(e) => e.key === "Enter" && setCategory(opt.key)}
  className={`p-4 rounded-lg cursor-pointer border transition 
    ${category === opt.key ? "font-semibold" : "border-gray-200"}
  `}
>
  {opt.label}
</div>

        ))}
      </div>
    </form>
  );
}

