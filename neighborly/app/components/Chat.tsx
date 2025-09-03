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

export default function Chat({ userId, userName,optimistic}: { userId: string; userName: string; optimistic: boolean }) {
  console.log('username', userName);
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch existing messages
  useEffect(() => {
    fetch(`/api/messages/${userId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, [userId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // WebSocket setup
  useEffect(() => {
    if (!session) return;
    ws.current = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);

    ws.current.onopen = () => {
      ws.current?.send(JSON.stringify({ type: "register", userId: session.user.id }));
    };

    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setMessages((prev) => [...prev, msg]);
    };

    return () => ws.current?.close();
  }, [session]);

  const sendMessage = async () => {
    if (!input || !session) return;

    const msg = {
      type: "message",
      receiverId: userId,
      senderId: session.user.id,
      content: input,
    };

    ws.current?.send(JSON.stringify(msg));
    if(optimistic){
         setMessages((prev) => [
      ...prev,
      {
        senderId: session.user.id,
        content: input,
        sender: { id: session.user.id, name: session.user.name ?? "You" },
      },
    ]);

    }

 

    await fetch("/api/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: userId, content: input }),
    });

    setInput("");
  };

  return (
    <div className="flex flex-col h-[500px] w-[400px]   rounded-xl shadow-md  overflow-hidden ">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 mt-2 ">
        <div className="w-10 h-10 flex rounded-full bg-gray-200 items-center justify-center text-gray-600 font-semibold">
          {userName[0]}
        </div>
        <div className="font-medium text-gray-800">{userName}</div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.map((m, i) => (
          <div
            key={m.id ?? i}
            className={`flex ${m.senderId === session?.user.id ? "justify-end" : "justify-start"}`}
          >
            <div className="flex flex-col max-w-[70%]">
              {m.sender?.name && (
                <div className="text-xs text-gray-500 mb-0.5">
                  {m.senderId === session?.user.id ? "You" : m.sender.name}
                </div>
              )}
              <div
                className={`p-2 rounded-lg ${
                  m.senderId === session?.user.id ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                {m.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div className="flex p-3  gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0D1164]"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="w-full rounded-full bg-[#0D1164] text-white py-3 font-semibold hover:bg-opacity-90 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
