"use client";

import { createContext, useContext, useEffect, useState } from "react";

const SocketContext = createContext<WebSocket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("https://neighborly-2ehx.onrender.com");

    ws.onopen = () => console.log("✅ WS connected");
    ws.onclose = () => console.log("❌ WS disconnected");

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
