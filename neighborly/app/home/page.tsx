"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import CreatePostForm from "../components/CreatePostForm";
import PostCard from "../components/PostCard";
import CreateServiceForm from "../components/CreateServiceForm";
import ServiceCard from "../components/ServiceCard";

import { Plus } from "lucide-react";

const NeighborhoodMap = dynamic(() => import("../components/NeighborhoodMap"), { ssr: false });

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [posts, setPosts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const neighborhoodId = session?.user?.neighborhoodId;

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const [view, setView] = useState<"posts" | "services">("posts");

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace("/");
      return;
    }

    if (neighborhoodId) {
      async function load() {
        try {
          const [pRes, sRes] = await Promise.all([
            fetch("/api/posts?neighborhoodId=" + neighborhoodId),
            fetch("/api/services?neighborhoodId=" + neighborhoodId),
          ]);
          const [pData, sData] = await Promise.all([pRes.json(), sRes.json()]);
          setPosts(pData);
          setServices(sData);
        } catch (err) {
          console.error("Failed to load posts/services", err);
        }
      }
      load();
    }
  }, [status, neighborhoodId, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 space-y-4">
        {/* Toggle Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setView("posts")}
            className={`px-4 py-2 rounded-full font-semibold ${
              view === "posts" ? "bg-[#0D1164] text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setView("services")}
            className={`px-4 py-2 rounded-full font-semibold ${
              view === "services" ? "bg-[#0D1164] text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Services
          </button>
        </div>

        {/* Create button */}
        {view === "posts" ? (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 font-semibold text-white bg-[#0D1164] hover:bg-[#1a1e85] px-4 py-2 rounded-full"
          >
            <Plus size={18} /> Post
          </button>
        ) : (
          <button
            onClick={() => setOpen2(true)}
            className="flex items-center gap-2 font-semibold text-white bg-[#0D1164] hover:bg-[#1a1e85] px-4 py-2 rounded-full"
          >
            <Plus size={18} /> Service
          </button>
        )}

        {/* Modal for creating post */}
        {open && (
          <div className="fixed inset-0 bg-white/40 flex items-center justify-center z-100">
            <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Create Post</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <CreatePostForm
                neighborhoodid={neighborhoodId ?? ""}
                onCreated={(p) => {
                  setPosts((s: any) => [p, ...s]);
                  setOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Modal for creating service */}
        {open2 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 relative">
              <button
                onClick={() => setOpen2(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <CreateServiceForm
                neighborhoodid={neighborhoodId ?? ""}
                onCreated={(s) => setServices((x) => [s, ...x])}
                setOpen2={setOpen2}
              />
            </div>
          </div>
        )}

        {/* Scrollable content */}
        <div className="h-[800px] overflow-y-auto pr-2 space-y-3  rounded-lg p-3">
          {view === "posts"
            ? posts.map((post: any) => <PostCard key={post.id} post={post} />)
            : services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
        </div>
      </div>

      <aside className="space-y-4">
   
        <div onClick={() => setOpen2(true)} className="cursor-pointer max-w-sm rounded-2xl shadow-sm hover:shadow-md transition bg-white overflow-hidden" >
          <img src="/servicebanner.jpg" alt="local business" className="w-full h-40 object-cover" />
           <div className="p-4"> 
           <h3 className="font-semibold text-lg mb-1">Own a local business?</h3>
           <p className="text-gray-600 text-sm"> Create a service to connect with neighbors, post updates in the feed, and gain new customers. </p>
           </div> {/* Footer */} 
           <div className="flex items-center justify-between border-t p-4 text-[#0D1164] font-semibold"> Create service 
            <span className="ml-2">➔</span>
            </div> 
        </div>

        <div>
          <h1 className="text-xl font-bold mb-4">Neighborhood Map</h1>
          <NeighborhoodMap />
        </div>

        
      </aside>
    </div>
  );
}
