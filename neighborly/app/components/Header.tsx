"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSocket } from "../socket.context";
import { usePathname } from "next/navigation";

export default function Header() {
  const { data: session, status } = useSession();
  const socket = useSocket();
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();

  // pages where we hide auth buttons
  const hideAuthButtons =
    pathname === "/auth/login" || pathname === "/auth/register";

  useEffect(() => {
    if (!socket) return;

    socket.onopen = () => {
      console.log("Socket connected");
    };

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "new_post") {
          setNotifications((prev) => [
            `New post: ${data.post.title} by ${data.post.user.name}`,
            ...prev,
          ]);
        }

        if (data.type === "new_service") {
          setNotifications((prev) => [
            `New service: ${data.service.title} by ${data.service.user.name}`,
            ...prev,
          ]);
        }
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
    <header className="p-4">
      <div
        className={`max-w-6xl mx-auto flex items-center ${
          hideAuthButtons ? "justify-center" : "justify-between"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 text-[#0D1164]">
          <img
            src="/link.png"
            alt="Logo"
            className="h-10 w-10"
            style={{
              filter:
                "invert(11%) sepia(35%) saturate(5882%) hue-rotate(234deg) brightness(95%) contrast(105%)",
            }}
          />
          <h1 className="text-2xl font-bold">Neighborly</h1>
        </div>

        {/* Navigation (hide when on login/register) */}
        {!hideAuthButtons && (
          <nav className="flex items-center justify-center gap-4">
            {/* Notifications */}
            {session && (
              <div className="relative flex items-center">
                <button
                  className="relative flex items-center"
                  onClick={() => setShowDropdown((prev) => !prev)}
                >
                  <img
                    src="/notification.png"
                    alt="Notifications"
                    className="h-6 w-6"
                  />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-20 w-64 bg-white shadow-lg rounded-lg p-2 z-50 max-h-64 overflow-y-auto">
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

            {/* Auth & Links */}
            {status === "loading" ? (
              <span className="text-sm text-gray-500">Loading...</span>
            ) : session ? (
              <>
                <Link href="/chat" className="flex items-center">
                  <img src="/chat-bubble.png" alt="Chat" className="h-6 w-6" />
                </Link>
                <span className="text-sm">Hi, {session.user?.name ?? "User"}</span>
                <button
                  onClick={() =>
                    signOut().then(() => {
                      window.location.href = "/";
                    })
                  }
                  className="text-sm font-semibold text-white bg-[#0D1164] hover:bg-[#1a1e85] px-4 py-2 rounded-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-semibold bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-full"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm font-semibold text-white bg-[#0D1164] hover:bg-[#1a1e85] px-4 py-2 rounded-full"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
