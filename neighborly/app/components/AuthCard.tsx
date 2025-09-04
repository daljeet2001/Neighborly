"use client";

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center ">
      {/* Background with rounded corners */}
      <div
        className="absolute inset-0 rounded-2xl bg-cover bg-center overflow-hidden shadow-lg mb-4"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1748344663935-e6151be6979b?q=80&w=1600&auto=format&fit=crop')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 rounded-2xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Discover your neighborhood
        </h1>
        <p className="text-lg text-gray-200 mb-8">
          Neighborly makes it easy to find local help, share resources, and 
          connect with people in your area. Whether you need a helping hand, 
          want to offer your skills, or just stay updated, we’re here to bring 
          the neighborhood closer.
        </p>

      

        {/* Business link */}
        <p className="text-sm text-gray-300 mt-6">
          Have a business?{" "}
          <a href="/auth/register" className="underline text-white">
            Get started
          </a>
        </p>
      </div>
    </section>
  );
}

