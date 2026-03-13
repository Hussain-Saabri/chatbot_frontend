"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Logo from "@/components/common/Logo";
import Logo3D from "@/components/common/Logo3D";
import LogoFull3D from "@/components/common/LogoFull3D";
import Link from "next/link";
import { 
    AlertCircle, 
    ArrowLeft,
    CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import "@/styles/shared-simple.css";

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
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Override global overflow:hidden from RootLayout
    document.body.style.overflow = "auto";
    document.body.style.position = "static";
    document.body.style.height = "auto";

    const fetchSharedConversation = async () => {
      const startTime = Date.now();
      try {
        const res = await fetch(`${API}/api/chat/conversations/${id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setConversation({
              id: id,
              title: "Shared Consultation",
              messages: data
            });
          } else {
            setConversation(data);
          }
        } else {
          setError("This link is no longer active.");
        }
      } catch (err) {
        setError("Network error. Please try again later.");
      } finally {
        const elapsedTime = Date.now() - startTime;
        const minimumDelay = 2000; // 2 seconds
        if (elapsedTime < minimumDelay) {
          await new Promise(resolve => setTimeout(resolve, minimumDelay - elapsedTime));
        }
        setIsLoading(false);
      }
    };

    if (id) {
      fetchSharedConversation();
    }

    return () => {
      // Revert styles on unmount
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.height = "";
    };
  }, [id, API, token]);

  if (isLoading) {
    return (
        <div className="simple-page-wrapper loading-simple">
            <LogoFull3D width={400} />
            </div>
    );
  }


  if (error || !conversation) {
    return (
        <div className="simple-page-wrapper flex items-center justify-center p-6 text-center">
            <div className="max-w-sm bg-white p-10 rounded-[2rem] shadow-2xl border border-[var(--divider)]">
                <AlertCircle size={48} className="text-red-500 mx-auto mb-6" />
                <h2 className="text-xl font-bold mb-3 text-[var(--text-main)]">Access Restricted</h2>
                <p className="text-[var(--text-muted)] text-sm mb-10 leading-relaxed">{error || "This clinical consultation is no longer available for public viewing."}</p>
                <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[var(--text-main)] text-white font-bold hover:scale-105 transition-all">
                    <ArrowLeft size={18} /> Return to Hub
                </Link>
            </div>
        </div>
    );
  }

  return (
    <div className="simple-page-wrapper">
        <header className="simple-header">
            
                <Logo width={200} />
            
        </header>

        <main className="simple-content-container">
          <div className="space-y-8">
              {conversation.messages.map((msg, index) => (
                  <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
                      key={msg.id} 
                      className={`chat-bubble-node ${msg.sender === 'user' ? 'user-node' : 'ai-node'}`}
                  >
                      <div className="bubble-content">
                          {msg.sender === "ai" ? (
                              <div className="prose prose-slate dark:prose-invert max-w-none">
                                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                      {msg.content}
                                  </ReactMarkdown>
                              </div>
                          ) : (
                              <p className="font-semibold text-[15px] m-0">{msg.content}</p>
                          )}
                      </div>
                      <div className="bubble-timestamp">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                  </motion.div>
              ))}
          </div>

          
        </main>

        
    </div>
  );
}
