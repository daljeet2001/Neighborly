'use client';

import { useState,useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSocket } from '../socket.context';

export default function CreatePostForm({ neighborhoodid, onCreated }: { neighborhoodid: string; onCreated?: (p: any) => void }) {
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('help');
  const [loading, setLoading] = useState(false);

  const socket = useSocket();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

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
      alert('Please sign in first');
      return;
    }
    if (!title || !description) {
      alert('Provide title and description');
      return;
    }
    setLoading(true);
    console.log('neighborhoodid in create post' ,neighborhoodid);

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, category, neighborhoodId:neighborhoodid,lat: location?.lat,
    lng: location?.lng, }),
    });
    if (!res.ok) {
      alert('Failed to create post');
      setLoading(false);
      return;
    }
    const post = await res.json();
    // notify WS server so other clients get the post instantly
    try {
          if (socket) {
         socket.send(JSON.stringify({ type: 'new_post', post }));
}
    } catch (e) {
      // ignore
    }
    setTitle('');
    setDescription('');
    setLoading(false);
    if (onCreated) onCreated(post);
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-3">
      <h1>create a post</h1>
      <div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full border rounded p-2" />
      </div>
      <div>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your need" className="w-full border rounded p-2" />
      </div>
      <div className="flex items-center gap-2">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded p-2">
          <option value="help">Help</option>
          <option value="service">Service request</option>
          <option value="sell">Buy / Sell</option>
        </select>
        <button type="submit" disabled={loading} className="ml-auto bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  );
}

