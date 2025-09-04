'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AuthCard from './components/AuthCard';
import FeatureCard from './components/FeatureCard';
import CTASection from './components/CTAsection';

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/home'); 
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>; 
  }

  return (
    <div className="w-full max-w-7xl">
    
      <AuthCard />
    <div className="flex flex-col gap-4 w-full md:flex-row ">
  <FeatureCard
    bgImage="https://d19rpgkrjeba2z.cloudfront.net/static/gen/9177d51f4d2aeb7aa922.jpg"
    mainImage="https://images.unsplash.com/photo-1698768194564-bd8ac2f4ea94?w=900&auto=format&fit=crop&q=60"
    description="Find and connect with nearby services."
  />

  <FeatureCard
    bgImage="https://d19rpgkrjeba2z.cloudfront.net/static/gen/4ed7dbd4f62b537ce06f.jpg"
    mainImage="https://images.unsplash.com/photo-1588925511355-114811363a2c?w=900&auto=format&fit=crop&q=60"
    description="Stay informed with alerts and local news."
  />

  <FeatureCard
    bgImage="https://d19rpgkrjeba2z.cloudfront.net/static/gen/521fca1698691c4dcdf9.jpg"
    mainImage="https://images.unsplash.com/photo-1621334721541-370a13974de8?q=80&w=987&auto=format&fit=crop"
    description="Discover local favorites by neighbors."
  />
</div>

      <CTASection />
    </div>
  );
}
