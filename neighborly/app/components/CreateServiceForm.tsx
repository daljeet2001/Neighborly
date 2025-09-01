'use client';

import { useState,useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSocket } from '../socket.context';

export default function CreateServiceForm({ neighborhoodid, onCreated }: { neighborhoodid: string; onCreated?: (s: any) => void }) {
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<string>('');
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
    if (!session) { alert('Please sign in'); return; }
    setLoading(true);
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, price: price ? Number(price) : undefined, neighborhoodId:neighborhoodid,lat: location?.lat,
    lng: location?.lng, }),
    });
    if (!res.ok) { alert('Failed to create service'); setLoading(false); return; }
    const service = await res.json();
    try { 
      if (socket) {
         socket.send(JSON.stringify({ type: 'new_service', service }));
}
 } catch (e) {}
    setTitle(''); setDescription(''); setPrice(''); setLoading(false);
    if (onCreated) onCreated(service);
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-3">
      <h1>Create a service</h1>
      <input placeholder="Service title (e.g., Home cleaning)" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2 rounded" />
      <textarea placeholder="Description & availability" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border p-2 rounded" />
      <div className="flex gap-2 items-center">
        <input placeholder="Price (optional)" value={price} onChange={(e) => setPrice(e.target.value)} className="border p-2 rounded w-36" />
        <button disabled={loading} className="ml-auto bg-green-600 text-white px-4 py-2 rounded">{loading ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  );
}

