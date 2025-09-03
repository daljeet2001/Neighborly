"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import ChatList from "../components/ChatList";
import Chat from "../components/Chat";

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  if (status === "loading") {
    return <div className="p-4">Loading...</div>;
  }

  if (!session?.user?.id) {
    return <div className="p-4">You must be logged in to view messages.</div>;
  }

  return (
    <div className="flex h-screen ">
      {/* Left Sidebar - Chat List */}
      <div className="w-1/3">
        <ChatList
          userId={session.user.id}
          onSelectChat={(partnerId) => setSelectedUserId(partnerId)}
          setUsername={setUsername}
        />
      </div>

      {/* Right Panel - Chat Window */}
      <div className="flex-1 flex items-center justify-center">
        {selectedUserId && username ? (
          <Chat userId={selectedUserId} userName={username} optimistic={true} />
        ) : (
          <p className="text-gray-500">Select a conversation</p>
        )}
      </div>
    </div>
  );
}
