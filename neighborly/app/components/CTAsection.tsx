"use client";

export default function CTASection() {
  return (
    <section className="flex flex-col items-center justify-center py-6">
      {/* Heading */}
      <h2 className="text-2xl  font-semibold text-gray-900 mb-2 text-center">
        Connect with your neighbors
      </h2>

      {/* Button */}
      <a
        href="/auth/register"
        className="px-6 py-3 rounded-full bg-[#0D1164] text-white py-3 font-semibold hover:bg-opacity-90 transition"
      >
        Join Neighborly
      </a>
    </section>
  );
}
