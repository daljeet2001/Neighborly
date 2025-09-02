'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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
    <div className="">
      LandingPage
    </div>
  );
}
