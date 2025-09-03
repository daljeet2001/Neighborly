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
            `${data.post.user.name} shared a new post`,
            ...prev,
          ]);
        }

        if (data.type === "new_service") {
          setNotifications((prev) => [
            `${data.service.user.name} shared a new service`,
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
    className={`max-w-6xl mx-auto flex flex-wrap items-center ${
      hideAuthButtons ? "justify-center" : "justify-between"
    } gap-3`}
  >
    {/* Logo */}
    <Link
      href="/home"
      className="flex items-center gap-2 text-[#0D1164] cursor-default flex-shrink-0"
    >
      <img
        src="/link.png"
        alt="Logo"
        className="h-8 w-8 sm:h-10 sm:w-10"
        style={{
          filter:
            "invert(11%) sepia(35%) saturate(5882%) hue-rotate(234deg) brightness(95%) contrast(105%)",
        }}
      />
      <h1 className="text-lg sm:text-2xl font-bold">Neighborly</h1>
    </Link>

    {/* Navigation (hide when on login/register) */}
    {!hideAuthButtons && (
      <nav className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-2 sm:mt-0">
        {/* Notifications */}
        {session && (
          <div className="relative flex items-center">
            <button
              className="relative flex items-center"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              <img src="/notification.png" alt="Notifications" className="h-6 w-6" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                  {notifications.length}
                </span>
              )}
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white shadow-lg rounded-lg p-2 z-50 max-h-64 overflow-y-auto">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">Notifications</span>
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="text-xs text-gray-500 hover:text-gray-800"
                  >
                    ✕
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500">No notifications</p>
                ) : (
                  notifications.map((n, i) => (
                    <div key={i} className="text-sm hover:text-[#0D1164]  last:border-0 p-2">
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
            <span className="text-sm sm:text-base truncate max-w-[100px]">
              Hi, {session.user?.name ?? "User"}
            </span>
            <button
              onClick={() =>
                signOut().then(() => {
                  window.location.href = "/";
                })
              }
              className="text-sm font-semibold text-white bg-[#0D1164] hover:bg-[#1a1e85] px-3 py-1.5 sm:px-4 sm:py-2 rounded-full"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/auth/login"
              className="text-sm font-semibold bg-gray-200 hover:bg-gray-300 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="text-sm font-semibold text-white bg-[#0D1164] hover:bg-[#1a1e85] px-3 py-1.5 sm:px-4 sm:py-2 rounded-full"
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
