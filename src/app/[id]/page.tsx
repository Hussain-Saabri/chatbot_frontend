"use client";

import ChatContainer from "@/components/chat/ChatContainer";
import Sidebar from "@/components/layout/Sidebar";
import { useLayout } from "@/components/layout/LayoutContext";
import { use } from "react";

export default function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { isSidebarOpen, closeSidebar } = useLayout();
  const resolvedParams = use(params);
  
  return (
    <main className="app-layout">
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "visible" : ""}`}
        onClick={closeSidebar}
      />
      <Sidebar currentId={resolvedParams.id} />
      <ChatContainer initialId={resolvedParams.id} />
    </main>
  );
}
