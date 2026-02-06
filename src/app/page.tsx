"use client";

import Sidebar from "@/components/layout/Sidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessage from "@/components/chat/ChatMessage";
import InputBar from "@/components/chat/InputBar";
import { ShieldCheck, MessageSquare, MapPin, Activity } from "lucide-react";
import { useLayout } from "@/components/layout/LayoutContext";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import TypingIndicator from "@/components/chat/TypingIndicator";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL;

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
  const streamAIResponse = async (response: Response, aiMsgId: string) => {
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let accumulatedText = "";
    let displayedText = "";
    let isStreamDone = false;

    // Helper to add characters to the UI one by one
    const typeCharacter = async () => {
      while (!isStreamDone || displayedText.length < accumulatedText.length) {
        if (displayedText.length < accumulatedText.length) {
          // Determine typing speed: speed up if we are falling behind
          const remaining = accumulatedText.length - displayedText.length;
          const delay = remaining > 100 ? 5 : (remaining > 20 ? 15 : 30);

          displayedText += accumulatedText[displayedText.length];

          setMessages(prev => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg && lastMsg.id === aiMsgId) {
              const updated = [...prev];
              updated[updated.length - 1] = { ...lastMsg, content: displayedText };
              return updated;
            }
            return prev;
          });

          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          // Wait for more data to arrive
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }
    };

    // Start the typing animation loop in parallel
    const typingPromise = typeCharacter();

    // Read characters from the stream
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        isStreamDone = true;
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      accumulatedText += chunk;
    }

    await typingPromise;
  };

  const handleSendMessage = async (content: string) => {

    // 1️⃣ Add user message first
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "user",
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);

    setIsTyping(true);

    // 2️⃣ Call backend
    const token = localStorage.getItem("token");
    const response = await fetch(`${API}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ content, conversationId })
    });

    if (!response.ok) throw new Error("AI failed");

    // 3️⃣ Insert your AI message block HERE 👇

    const aiMsgId = "ai-" + Date.now();

    setMessages(prev => [
      ...prev,
      {
        id: aiMsgId,
        sender: "ai",
        content: "",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);

    setStreamingMessageId(aiMsgId);
    setIsTyping(false);

    await streamAIResponse(response, aiMsgId);

    setStreamingMessageId(null);
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
      const res = await fetch(`${API}/api/chat/conversations/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }
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
      // Silence error log
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

                  <h1 className="landing-title">How can I help you today?</h1>
                  <p className="landing-subtitle">
                    I&apos;m Dr. Nura AI, your professional healthcare assistant. Ask me anything about your health.
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

                  {isTyping && <TypingIndicator />}

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
