"use client";

import { useEffect, useState } from "react";

type ChatListProps = {
  userId: string;
  onSelectChat: (partnerId: string) => void;
  setUsername: (name: string) => void;
};

type Conversation = {
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  lastMessage: string;
  lastAt: string;
};


export default function ChatList({ userId, onSelectChat,setUsername }: ChatListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users, setUsers] = useState<{id: string; name: string|null; email: string}[]>([]);
  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      const res = await fetch(`/api/messages/conversations/${userId}`);
      setConversations(await res.json());
    };
    fetchChats();
  }, [userId]);

  const fetchUsers = async () => {
    const res = await fetch("/api/user");
    setUsers(await res.json());
    setShowUsers(true);
  };

  return (
    <div className="py-4">
      <button
        onClick={fetchUsers}
        className="text-sm font-semibold text-white bg-[#0D1164] hover:bg-[#1a1e85] px-3 py-1.5 sm:px-4 sm:py-2 rounded-full"
      >
        + New Chat
      </button>

 {showUsers ? (
  <div className=" overflow-hidden">
    {users
      .filter((u) => u.id !== userId) // Exclude the current user
      .map((u) => (
        <div
          key={u.id}
           onClick={() => {
    onSelectChat(u.id);
    setUsername(u.name ?? u.email);
    setShowUsers(false); 
  }}
          className="flex mt-2 hover:rounded-full items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 hover:rounded-full transition-colors"
        >
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
            {u.name?.[0] ?? u.email?.[0] ?? "U"}
          </div>
          {/* User Name */}
          <div className="font-medium text-gray-800">{u.name ?? u.email}</div>
        </div>
      ))}
  </div>
) : (
  <div className=" overflow-hidden">
    {conversations.map((conv) => (
      <div
        key={conv.user.id}
        onClick={() => {
          onSelectChat(conv.user.id);
          setUsername(conv.user.name ?? conv.user.email);
          setShowUsers(false);
        }}
        className=" mt-2 hover:rounded-full flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 transition-colors"
      >
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
          {conv.user.name?.[0] ?? conv.user.email?.[0] ?? "U"}
        </div>
        <div className="flex-1">
          {/* User Name */}
          <div className="font-medium text-gray-800">{conv.user.name ?? conv.user.email}</div>
          {/* Last Message */}
          <div className="text-sm text-gray-500 truncate">{conv.lastMessage}</div>
        </div>
      </div>
    ))}
  </div>
)}

    </div>
  );
}

