"use client";

import Sidebar from "@/components/layout/Sidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessage from "@/components/chat/ChatMessage";
import InputBar from "@/components/chat/InputBar";
import { ShieldCheck, MessageSquare, MapPin, Activity } from "lucide-react";
import { useLayout } from "@/components/layout/LayoutContext";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  sender: "ai" | "user";
  content: string;
  timestamp: string;
}

export default function Home() {
  const { isSidebarOpen, closeSidebar } = useLayout();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSwitchingChat, setIsSwitchingChat] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    // Small timeout to ensure DOM has updated after state change
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior, block: "end" });
    }, 50);
  };

  useEffect(() => {
    // During active streaming, we use 'auto' behavior to avoid
    // the jittery/hanging effect caused by competing smooth scroll animations.
    if (!isSwitchingChat) {
      if (streamingMessageId) {
        scrollToBottom("auto");
      } else {
        scrollToBottom("smooth");
      }
    }
  }, [messages, isSwitchingChat, streamingMessageId]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          content,
          conversationId: conversationId
        })
      });

      if (!response.ok) throw new Error("Failed to get response");

      const headerConvId = response.headers.get("x-conversation-id");
      if (headerConvId && !conversationId) {
        setConversationId(headerConvId);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      setIsTyping(false);

      if (!reader) {
        return;
      }

      const aiMsgId = "ai-" + Date.now();
      setStreamingMessageId(aiMsgId);

      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          sender: "ai",
          content: "",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        console.log("Streaming chunk:", chunk);
        accumulatedContent += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId ? { ...msg, content: accumulatedContent } : msg
          )
        );
      }

      console.log("Full AI Response:", accumulatedContent);
      setStreamingMessageId(null);
    } catch (error) {
      console.error("Chat error:", error);
      setIsTyping(false);
      setStreamingMessageId(null);
    }
  };

  const handleConversationSelect = async (id: string) => {
    if (id === "new") {
      setConversationId(null);
      setMessages([]);
      return;
    }

    setConversationId(id);
    setIsSwitchingChat(true); // Start loading state

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/chat/conversations/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const formattedMessages: Message[] = data.map((m: any) => ({
          id: m.id,
          sender: m.sender as "ai" | "user",
          content: m.content,
          timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
        setMessages(formattedMessages);

        // Use behavior "auto" for instant jump to bottom on switch
        scrollToBottom("auto");
      }
    } catch (err) {
      console.error("Failed to load conversation", err);
    } finally {
      // Small artificial delay for smooth transition feel
      setTimeout(() => {
        setIsSwitchingChat(false);
      }, 300);
    }
  }

  return (
    <main className="app-layout">
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "visible" : ""}`}
        onClick={closeSidebar}
      />
      <Sidebar onConversationSelect={handleConversationSelect} currentId={conversationId} />

      <div className="main-view">
        <ChatHeader />

        <div className="chat-area">
          <div className="chat-messages custom-scroll">
            <div className="chat-content-wrapper">
              {isSwitchingChat ? (
                <div className="messages-list chat-fade-in flex flex-col gap-6 p-4">
                  <div className="skeleton skeleton-message ai" />
                  <div className="skeleton skeleton-message user" />
                  <div className="skeleton skeleton-message ai" />
                </div>
              ) : messages.length === 0 ? (
                <div className="landing-view chat-fade-in">
                  <div className="landing-icon-wrapper">
                    <Activity size={32} />
                  </div>
                  <h1 className="landing-title">How can I help you today?</h1>
                  <p className="landing-subtitle">
                    I&apos;m Dr. Nova AI, your professional healthcare assistant. Ask me anything about your health.
                  </p>
                </div>
              ) : (
                <div className="messages-list">
  {messages.map((msg) => (
    <ChatMessage
      key={msg.id}
      sender={msg.sender}
      content={msg.content}
      timestamp={msg.timestamp}
      isStreaming={msg.id === streamingMessageId}
    />
  ))}

  {isTyping && (
    <div className="bubble bubble-ai typing-indicator chat-fade-in">
      <div className="flex gap-1.5 pt-1 pb-1 px-1">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  )}

  {/* 👇 THIS IS THE IMPORTANT PART */}
  <div ref={messagesEndRef} />
</div>

              )}
            </div>
          </div>

          <InputBar onSendMessage={handleSendMessage} />
        </div>
      </div>
    </main>
  );
}
