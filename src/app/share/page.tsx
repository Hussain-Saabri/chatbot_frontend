"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChatMessage from "@/components/chat/ChatMessage";
import Logo from "@/components/common/Logo";
import Link from "next/link";
import { MessageSquare, ArrowLeft } from "lucide-react";

interface Message {
  id: string;
  sender: "ai" | "user";
  content: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

function SharedConversationContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchSharedConversation = async () => {
      try {
        const res = await fetch(`${API}/api/chat/shared/${id}`);
        if (res.ok) {
          const data = await res.json();
          setConversation(data);
        } else {
          setError("This conversation is not shared or does not exist.");
        }
      } catch (err) {
        setError("Failed to load shared conversation.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchSharedConversation();
    } else if (!id && typeof window !== 'undefined') {
        setIsLoading(false);
        setError("No conversation ID provided.");
    }
  }, [id, API]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="skeleton skeleton-message ai w-full max-w-2xl mb-4" />
        <div className="skeleton skeleton-message user w-full max-w-2xl mb-4" />
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-6">
        <div className="w-16 h-16 rounded-full bg-background-dim flex items-center justify-center text-text-muted mb-6">
          <MessageSquare size={32} />
        </div>
        <h1 className="text-2xl font-bold text-text-main mb-2">Conversation Not Found</h1>
        <p className="text-text-muted max-w-md mb-8">
          {error || "The link you followed may be broken or the conversation is no longer shared."}
        </p>
        <Link href="/" className="btn-primary px-6 py-3 rounded-xl font-medium flex items-center gap-2">
          <ArrowLeft size={20} />
          Back to Chat
        </Link>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <div className="main-view" style={{ width: '100%' }}>
        <header className="chat-header">
            <div className="header-left">
                <Logo width={130} />
            </div>
            {/* Clear, minimal header as requested */}
        </header>

        <div className="chat-area">
          <div className="chat-messages custom-scroll">
            <div className="chat-content-wrapper">
              <div className="messages-list py-8">
                {conversation.messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    sender={msg.sender}
                    content={msg.content}
                    timestamp={new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SharedConversationPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-screen bg-background">
                <div className="skeleton skeleton-message ai w-full max-w-2xl" />
            </div>
        }>
            <SharedConversationContent />
        </Suspense>
    );
}
