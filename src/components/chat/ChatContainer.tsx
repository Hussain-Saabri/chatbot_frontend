"use client";

import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessage from "@/components/chat/ChatMessage";
import InputBar from "@/components/chat/InputBar";
import TypingIndicator from "@/components/chat/TypingIndicator";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  sender: "ai" | "user";
  content: string;
  timestamp: string;
}

interface ChatContainerProps {
  initialId?: string | null;
}

export default function ChatContainer({ initialId = null }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSwitchingChat, setIsSwitchingChat] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(initialId);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL;

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior, block: "end" });
    }, 50);
  };

  // Sync state when initialId changes (e.g., via navigation)
  useEffect(() => {
    if (initialId !== conversationId) {
      setConversationId(initialId);
      if (initialId) {
        fetchConversation(initialId);
      } else {
        setMessages([]);
      }
    }
  }, [initialId]);

  useEffect(() => {
    if (!isSwitchingChat) {
      if (streamingMessageId) {
        scrollToBottom("auto");
      } else {
        scrollToBottom("smooth");
      }
    }
  }, [messages, isSwitchingChat, streamingMessageId]);

  const fetchConversation = async (id: string) => {
    setIsSwitchingChat(true);
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
        scrollToBottom("auto");
      }
    } catch (err) {
      // Graceful error handling
    } finally {
      setTimeout(() => {
        setIsSwitchingChat(false);
      }, 300);
    }
  };

  const streamAIResponse = async (response: Response, aiMsgId: string) => {
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let accumulatedText = "";
    let displayedText = "";
    let isStreamDone = false;

    const typeCharacter = async () => {
      while (!isStreamDone || displayedText.length < accumulatedText.length) {
        if (displayedText.length < accumulatedText.length) {
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
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }
    };

    const typingPromise = typeCharacter();
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
    try {
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

      const newConvId = response.headers.get("x-conversation-id");
      if (newConvId && !conversationId) {
        setConversationId(newConvId);
        // Instant URL update without reload
        router.replace('/' + newConvId);
      }

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
    } catch (err) {
      setIsTyping(false);
    } finally {
      setStreamingMessageId(null);
    }
  };

  return (
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
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>
        <InputBar onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
