"use client";
import { useState } from "react";
import React from "react";
import { useSession } from "next-auth/react";
import { Heart, MessageCircle, Share2, MoreHorizontal, Globe } from "lucide-react";

export default function PostCard({
  post,
  onClose,
}: {
  post: any;
  onClose?: (id: string) => void;
}) {
  const { data: session } = useSession();

  const handleClose = async () => {
    if (!confirm("Mark this post as closed?")) return;
    const res = await fetch("/api/posts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post.id, status: "closed" }),
    });
    if (res.ok && onClose) onClose(post.id);
  };

  const isOwner = session?.user?.id === post.userId;

  return (
    <article className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
      {/* Top Section */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-600 font-semibold">
          {post.user?.name?.[0] ?? "U"}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
            {post.user?.name ?? post.user?.email}
          </div>
          <div className="flex items-center text-xs text-gray-500 gap-1">
            {new Date(post.createdAt).toLocaleDateString()} ·{" "}
            <Globe className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="mt-3 text-gray-800 text-sm leading-relaxed">
        <h2>{post.title}</h2>
        {post.description}
      </div>

      {/* Actions */}
      {/* <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-1 text-gray-600 hover:text-[#0D1164]">
            <Heart className="w-5 h-5" /> <span className="text-sm">6</span>
          </button>
          <button className="flex items-center gap-1 text-gray-600 hover:text-[#0D1164]">
            <MessageCircle className="w-5 h-5" /> <span className="text-sm">6</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div> */}

      {/* Owner Action */}
      {/* {isOwner && (
        <button
          onClick={handleClose}
          className="mt-3 text-xs text-red-500 underline"
        >
          Close
        </button>
      )} */}
    </article>
  );
}

