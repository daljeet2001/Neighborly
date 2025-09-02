"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

type Message = {
  id?: string;
  senderId: string;
  content: string;
  sender?: { id: string; name: string | null };
  receiver?: { id: string; name: string | null };
};

export default function Chat({ userId }: { userId: string }) {
  console.log("userId in chat", userId);
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const ws = useRef<WebSocket | null>(null);

  // fetch existing messages
  useEffect(() => {
    fetch(`/api/messages/${userId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, [userId]);

  // WebSocket setup
  useEffect(() => {
    if (!session) return;
    ws.current = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);

    ws.current.onopen = () => {
      ws.current?.send(
        JSON.stringify({ type: "register", userId: session.user.id })
      );
    };

    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      console.log("Received WS chat message:", msg);
      setMessages((prev) => [...prev, msg]);
    };

    return () => ws.current?.close();
  }, [session]);

  // send new message
  const sendMessage = async () => {
    if (!input || !session) return;
    const msg = {
      type: "message",
      receiverId: userId,
      senderId: session.user.id,
      content: input,
    };

    // send via WS
    ws.current?.send(JSON.stringify(msg));

    // optimistic UI update (sender name from session)
    setMessages((prev) => [
      ...prev,
      {
        senderId: session.user.id,
        content: input,
        sender: { id: session.user.id, name: session.user.name ?? "You" },
      },
    ]);

    // persist to DB
    await fetch("/api/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: userId, content: input }),
    });

    setInput("");
  };

  return (
    <div className="border p-4 rounded-lg bg-white max-w-md">
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={m.id ?? i}
            className={
              m.senderId === session?.user.id ? "text-right" : "text-left"
            }
          >
            {/* ✅ show sender name above the bubble */}
            <div className="text-xs text-gray-500 mb-0.5">
              {m.sender?.name ?? (m.senderId === session?.user.id ? "You" : "Unknown")}
            </div>
            <span className="inline-block bg-gray-200 p-2 rounded">
              {m.content}
            </span>
          </div>
        ))}
      </div>

      {/* input field */}
      <div className="mt-2 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 rounded flex-1"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white p-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
