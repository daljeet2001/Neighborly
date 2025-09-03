"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Globe } from "lucide-react";
import Chat from "./Chat";

export default function ServiceCard({ service }: { service: any }) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(service.likesCount || 0);
  const [liked, setLiked] = useState(false); 
    const [chatOpen, setChatOpen] = useState(false); 

  const toggleLike = async () => {
    try {
      const res = await fetch("/api/services/like", {
        method: liked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: service.id }),
      });

      if (!res.ok) throw new Error("Failed to update like");

      const data = await res.json();
      setLikes(data.likesCount);
      setLiked(!liked);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
    <article className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
      {/* Top Section */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-600 font-semibold">
          {service.user?.name?.[0] ?? "U"}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
            {service.user?.name ?? service.user?.email}
          </div>
          <div className="flex items-center text-xs text-gray-500 gap-1">
            {service.createdAt
              ? new Date(service.createdAt).toLocaleDateString()
              : "Just now"}{" "}
            · <Globe className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Service Content */}
      <div className="mt-3 text-gray-800 text-sm leading-relaxed">
        {service.photo && (
          <img
            src={service.photo}
            alt="Service Image"
            className="w-full h-[400px] mb-2 object-cover"
          />
        )}
        <p className="mt-1">{service.body}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          {/* Like Button */}
          <button
            onClick={toggleLike}
            disabled={liked}
            className={`flex items-center gap-1 text-sm font-medium ${
              liked ? "text-gray-600 cursor-not-allowed" : "text-gray-600 hover:text-[#0D1164]"
            }`}
          >
            {liked ? (
              <img src="/like-social-heart.png" className="w-4 h-4" alt="liked" />
            ) : (
              <img src="/heart.png" className="w-4 h-4" alt="like" />
            )}
            {likes}
          </button>

          {/* Chat Button */}
              <button
              onClick={() => setChatOpen(true)}
              className="flex items-center gap-1 text-gray-600 hover:text-[#0D1164]"
            >
              <img src="/paper-plane.png" className="w-4 h-4" alt="chat" />
            </button>
        </div>
      </div>
    </article>
          {/* Chat Popup */}
          {chatOpen && (
            <div className="fixed inset-0 bg-white/40  flex items-center justify-center z-50">
              <div className="relative bg-white rounded-xl shadow-lg">
                {/* Close button */}
                <button
                  onClick={() => setChatOpen(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  ✖
                </button>
    
                <Chat userId={service.user.id} userName={service.user.name ?? "User"} optimistic={false} />
              </div>
            </div>
          )}

    </>
  );
}
