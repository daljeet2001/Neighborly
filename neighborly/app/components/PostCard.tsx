'use client';

import React from 'react';

export default function PostCard({ post, onClose }: { post: any; onClose?: (id: string) => void }) {
  const handleClose = async () => {
    if (!confirm('Mark this post as closed?')) return;
    const res = await fetch('/api/posts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: post.id, status: 'closed' }),
    });
    if (res.ok && onClose) onClose(post.id);
  };

  return (
    <article className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{post.title}</h3>
          <p className="text-sm text-gray-700 mt-1">{post.description}</p>
          <div className="text-xs text-gray-500 mt-2">By: {post.user?.name ?? post.user?.email}</div>
        </div>
        <div className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</div>
      </div>
      <div className="flex gap-2 mt-3">
        <span className="px-2 py-1 rounded bg-gray-100 text-xs">{post.category}</span>
        <span className={`px-2 py-1 rounded text-xs ${post.status === 'open' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{post.status}</span>
        <button onClick={handleClose} className="ml-auto text-sm underline">Close</button>
      </div>
    </article>
  );
}

