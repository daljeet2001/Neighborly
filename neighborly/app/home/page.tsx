'use client';

import dynamic from "next/dynamic";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";

import CreatePostForm from '../components/CreatePostForm';
import PostCard from '../components/PostCard';
import CreateServiceForm from '../components/CreateServiceForm';
import ServiceCard from '../components/ServiceCard';
import ChatList from '../components/ChatList';

const NeighborhoodMap = dynamic(() => import("../components/NeighborhoodMap"), { ssr: false });

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [posts, setPosts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const neighborhoodId = session?.user?.neighborhoodId;

  useEffect(() => {
    if (status === 'loading') return; 

    if (status === 'unauthenticated') {
      router.replace('/'); 
      return;
    }
    if (neighborhoodId) {
      async function load() {
        try {
          const [pRes, sRes] = await Promise.all([
            fetch('/api/posts?neighborhoodId=' + neighborhoodId),
            fetch('/api/services?neighborhoodId=' + neighborhoodId),
          ]);
          const [pData, sData] = await Promise.all([pRes.json(), sRes.json()]);
          setPosts(pData);
          setServices(sData);
        } catch (err) {
          console.error('Failed to load posts/services', err);
        }
      }
      load();
    }

  }, [status, neighborhoodId, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      <div className="md:col-span-2 space-y-4">
        <CreatePostForm neighborhoodid={neighborhoodId ?? ""} onCreated={(p) => setPosts((s) => [p, ...s])} />
        <div className="space-y-3">
          {posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      </div>

      <aside className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Services near you</h3>
          <CreateServiceForm neighborhoodid={neighborhoodId ?? ""} onCreated={(s) => setServices((x) => [s, ...x])} />
        </div>

        <div className="space-y-3 mt-3">
          {services.map((service) => <ServiceCard key={service.id} service={service} />)}
        </div>

        <div className="p-4">
          <h1 className="text-xl font-bold mb-4">Neighborhood Map</h1>
          <NeighborhoodMap />        
        </div>
      </aside>
   
    </div>
  );
}
