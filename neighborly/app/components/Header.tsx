"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSocket } from "../socket.context";

export default function Header() {
  const { data: session, status } = useSession();
  const socket = useSocket();
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

useEffect(() => {
  if (!socket) return;

  socket.onopen = () => {
    console.log("Socket connected");
  };

  const handleMessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      console.log("data",data)

      if (data.type === "new_post") {
    
  setNotifications((prev) => {
  const updated = [`New post: ${data.post.title} by ${data.post.user.name}`, ...prev];
  console.log("Updated notifications:", updated);
  return updated;
});

      }
      if (data.type === "new_service") {
    
  setNotifications((prev) => {
  const updated = [`New service: ${data.service.title} by ${data.service.user.name}`, ...prev];
  console.log("Updated notifications:", updated);
  return updated;
});

      }

    //   console.log("Got message:", data);
    } catch (err) {
      console.error("Error parsing WS message:", err);
    }
  };

  socket.addEventListener("message", handleMessage);

  return () => {
socket.removeEventListener("message", handleMessage);
  };
}, [socket]);



  return (
    <header className="bg-white p-4 shadow">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-lg font-semibold">Neighborly</h1>
        <nav className="flex gap-4 items-center">
          {/* Notifications */}
          {session && (
            <div className="relative">
              <button
                className="relative"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                notifications
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                    {notifications.length}
                  </span>
                )}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded p-2 z-50 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500">No notifications</p>
                  ) : (
                    notifications.map((n, i) => (
                      <div
                        key={i}
                        className="text-sm border-b last:border-0 p-2"
                      >
                        {n}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {status === "loading" ? (
            <span className="text-sm text-gray-500">Loading...</span>
          ) : session ? (
            <>
              <span className="text-sm">
                Hi, {session.user?.name ?? "User"}
              </span>
              <button
                onClick={() =>
                  signOut().then(() => {
                    window.location.href = "/";
                  })
                }
                className="text-sm text-red-500 hover:underline"
              >
                Logout
              </button>
                  <Link href="/chat" className="text-sm">
                Messages
              </Link>
                       <Link href="/home" className="text-sm">
                Home
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm">
                Login
              </Link>
              <Link href="/auth/register" className="text-sm">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

