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
      if (pincode.length < 5) return;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json`
        );
        const data = await res.json();
        if (data.length > 0) {
          setCity(data[0].display_name);
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
    <div className="flex items-center justify-center  px-4">
      <div className="w-full max-w-md  p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Create an Account
        </h2>
        <form onSubmit={submit} className="space-y-4">
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0D1164] focus:outline-none"
            autoComplete="name"
          />

          <input
            placeholder="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0D1164] focus:outline-none"
            autoComplete="email"
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0D1164] focus:outline-none"
            autoComplete="new-password"
          />

          <input
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0D1164] focus:outline-none"
            autoComplete="postal-code"
          />

          <input
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0D1164] focus:outline-none"
            autoComplete="address-level2"
          />

          <button
            disabled={loading}
            className="w-full bg-[#0D1164] text-white font-semibold py-2 rounded-lg transition hover:bg-opacity-90 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-6">
          Already have an account?{' '}
          <a
            href="/auth/login"
            className="text-[#0D1164] font-medium hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
