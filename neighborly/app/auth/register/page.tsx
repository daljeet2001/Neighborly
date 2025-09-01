'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-fetch city from pincode using OpenStreetMap API
  useEffect(() => {
    const fetchCity = async () => {
      if (pincode.length < 5) return; // only fetch when enough digits
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json`
        );
        const data = await res.json();
        console.log(data);
        if (data.length > 0) {
          setCity(data[0].display_name); // pick first part (city/locality)
        }
      } catch (err) {
        console.error('City lookup failed', err);
      }
    };
    fetchCity();
  }, [pincode]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, pincode, city }),
    });

    if (res.ok) {
      router.push('/auth/login');
    } else {
      const err = await res.json();
      alert(err.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      <form onSubmit={submit} className="space-y-3">
     <input
  placeholder="Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="w-full border p-2 rounded"
  autoComplete="name"
/>

<input
  placeholder="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full border p-2 rounded"
  autoComplete="email"
/>

<input
  placeholder="Password"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="w-full border p-2 rounded"
  autoComplete="new-password"
/>

<input
  placeholder="Pincode"
  value={pincode}
  onChange={(e) => setPincode(e.target.value)}
  className="w-full border p-2 rounded"
  autoComplete="postal-code"
/>

<input
  placeholder="City"
  value={city}
  onChange={(e) => setCity(e.target.value)}
  className="w-full border p-2 rounded"
  autoComplete="address-level2"
/>

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {loading ? 'Creating...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
