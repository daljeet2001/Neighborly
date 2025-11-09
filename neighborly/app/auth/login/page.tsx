'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn('credentials', { redirect: false, email, password });
    setLoading(false);
    if (res?.ok) router.push('/home');
    else alert('Invalid credentials');
  };

  return (
    <div className="flex flex-col items-center justify-center">

      <div className="w-full max-w-md  p-8 ">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Welcome back</h2>

        <form onSubmit={submit} className="space-y-4">
          {/* Email */}
          <input
            type="text"
            placeholder="Email or mobile number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0D1164]"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#0D1164]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
         
            </button>
          </div>

          {/* Forgot password */}
          <div className="text-sm">
            <Link href="/auth/forgot" className="text-[#0D1164] font-medium underline cursor-not-allowed">
              Forgot my password
            </Link>
          </div>

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full rounded-full bg-[#0D1164] text-white py-3 font-semibold hover:bg-opacity-90 transition"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        {/* Register link */}
        <div className="text-center text-sm mt-6">
          <span className="text-gray-600">Don’t have an account? </span>
          <Link href="/auth/register" className="text-[#0D1164] font-medium underline">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
