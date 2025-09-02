"use client";

import { useEffect, useState } from "react";

type ChatListProps = {
  userId: string;
  onSelectChat: (partnerId: string) => void;
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


export default function ChatList({ userId, onSelectChat }: ChatListProps) {
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
    <div>
      <button
        onClick={fetchUsers}
        className="p-2 w-full bg-blue-600 text-white"
      >
        + New Chat
      </button>

      {showUsers ? (
        <div>
          {users
            .filter((u) => u.id !== userId) // don’t list yourself
            .map((u) => (
              <div
                key={u.id}
                onClick={() => onSelectChat(u.id)}
                className="p-3 cursor-pointer hover:bg-gray-100 border-b"
              >
                {u.name ?? u.email}
              </div>
            ))}
        </div>
      ) : (
        conversations.map((conv) => (
          <div
            key={conv.user.id}
            onClick={() => onSelectChat(conv.user.id)}
            className="p-3 cursor-pointer hover:bg-gray-100 border-b"
          >
            <div className="font-medium">{conv.user.name ?? conv.user.email}</div>
            <div className="text-sm text-gray-500 truncate">{conv.lastMessage}</div>
          </div>
        ))
      )}
    </div>
  );
}

