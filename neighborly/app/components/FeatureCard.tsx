"use client";



export default function FeatureCard({
  bgImage,
  mainImage,
  description,
}: {
  bgImage: string;
  mainImage: string;
  description: string;
}) {
  return (
    <div
      className="relative flex flex-col items-center justify-center rounded-2xl overflow-hidden shadow-lg w-full max-w-sm p-6 text-center"
      style={{
        backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.45) 100%), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Foreground Image */}
      <div className="w-full h-72 relative mb-4 rounded-xl overflow-hidden">
        <img
          src={mainImage}
          alt="Feature image"
          
          className="object-contain object-center"
        />
      </div>

      {/* Text */}
      <p className="text-lg font-semibold text-white">{description}</p>
    </div>
  );
}
