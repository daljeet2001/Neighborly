"use client";

import { createContext, useContext, useEffect, useRef } from "react";

const SocketContext = createContext<WebSocket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4001");
    socketRef.current = ws;

    ws.onopen = () => console.log("WS connected");
    ws.onclose = () => console.log("WS disconnected");

    return () => {
      ws.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);

