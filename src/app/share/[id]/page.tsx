"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ChatMessage from "@/components/chat/ChatMessage";
import { ShieldCheck, MessageSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";

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

export default function SharedConversationPage() {
  const params = useParams();
  const id = params.id as string;
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
    }
  }, [id, API]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-height-screen p-4 bg-background">
        <div className="skeleton skeleton-message ai w-full max-w-2xl mb-4" />
        <div className="skeleton skeleton-message user w-full max-w-2xl mb-4" />
        <div className="skeleton skeleton-message ai w-full max-w-2xl" />
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="flex flex-col items-center justify-center min-height-screen p-4 bg-background text-center">
        <div className="w-16 h-16 rounded-full bg-background-dim flex items-center justify-center text-text-muted mb-6">
          <MessageSquare size={32} />
        </div>
        <h1 className="text-2xl font-bold text-text-main mb-2">Conversation Not Found</h1>
        <p className="text-text-muted max-w-md mb-8">
          {error || "The link you followed may be broken or the conversation is no longer shared."}
        </p>
        <Link href="/" className="btn-primary px-6 py-3 rounded-xl font-medium flex items-center gap-2">
          <ArrowLeft size={20} />
          Go to Chat
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Public Header */}
      <header className="chat-header px-4 lg:px-20">
        <div className="flex items-center gap-3">
          <div className="dr-avatar bg-primary-soft flex items-center justify-center text-primary">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="dr-name">{conversation.title || "Shared Conversation"}</h1>
            <p className="text-xs text-text-muted">Shared view • Read only</p>
          </div>
        </div>
        
        <Link 
            href="/signup" 
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-all"
        >
            Try Dr. Nura AI
        </Link>
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto custom-scroll">
        <div className="chat-content-wrapper p-4 md:p-8">
          <div className="messages-list max-w-3xl mx-auto">
            {conversation.messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                sender={msg.sender}
                content={msg.content}
                timestamp={new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              />
            ))}
            
            <div className="mt-12 p-8 rounded-2xl bg-primary-soft/30 border border-primary-border/20 text-center">
               <h3 className="text-lg font-bold text-text-main mb-2">Want to continue this conversation?</h3>
               <p className="text-text-muted mb-6">Create your own account to chat with Dr. Nura AI and save your health history.</p>
               <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/signup" className="btn-primary px-8 py-3 rounded-xl font-medium">
                    Get Started
                  </Link>
                  <Link href="/login" className="px-8 py-3 rounded-xl font-medium text-text-main hover:bg-background-dim transition-all">
                    Sign In
                  </Link>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Branding */}
      <footer className="p-6 text-center text-text-muted text-sm border-t border-divider">
        Powered by Dr. Nura AI Healthcare Assistant
      </footer>
    </div>
  );
}
