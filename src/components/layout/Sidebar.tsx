"use client";

import {
    Plus,
    Activity,
    Settings,
    Moon,
    Sun,
    X,
    MessageSquare,
    LogOut,
    Menu,
    MoreVertical,
    Edit2,
    Share2,
    Trash2
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeContext";
import { useLayout } from "./LayoutContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Modal from "../common/Modal";
import ShareModal from "../common/ShareModal";
import Logo from "../common/Logo";

interface SidebarProps {
    onConversationSelect?: (id: string) => void;
    currentId?: string | null;
}

export default function Sidebar({ onConversationSelect, currentId }: SidebarProps) {
    const [conversations, setConversations] = useState<any[]>([]);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
    const [renameModalId, setRenameModalId] = useState<string | null>(null);
    const [renameTitle, setRenameTitle] = useState("");
    const [shareModalId, setShareModalId] = useState<string | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    
    const navRef = useRef<HTMLElement>(null);
    const settingsRef = useRef<HTMLDivElement>(null);
    const { theme, toggleTheme } = useTheme();
    const { isSidebarOpen, toggleSidebar, closeSidebar } = useLayout();
    const router = useRouter();
    const API = process.env.NEXT_PUBLIC_API_URL;
    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    // Close settings if clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setIsSettingsOpen(false);
            }
            // Close chat action menu if clicking elsewhere
            if (activeMenuId && !(event.target as Element).closest('.chat-action-menu') && !(event.target as Element).closest('.menu-trigger-btn')) {
                setActiveMenuId(null);
            }
        };

        if (isSettingsOpen || activeMenuId) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isSettingsOpen, activeMenuId]);

    const handleMenuClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        
        if (activeMenuId === id) {
            setActiveMenuId(null);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const menuWidth = 180; // from CSS

            // Prefer right side, but stay within viewport
            let left = rect.right + 8;
            
            // If it goes off screen on the right, shift it left just enough to stay on screen
            if (left + menuWidth > viewportWidth - 10) {
                left = viewportWidth - menuWidth - 10;
            }
            
            // Ensure it doesn't go off the left side of the screen
            left = Math.max(10, left);

            setMenuPosition({ top: rect.top + (rect.height / 2), left });
            setActiveMenuId(id);
        }
    };

    // Close menu on sidebar scroll
    useEffect(() => {
        const handleScroll = () => setActiveMenuId(null);
        const nav = navRef.current;
        if (activeMenuId && nav) {
            nav.addEventListener("scroll", handleScroll);
        }
        return () => nav?.removeEventListener("scroll", handleScroll);
    }, [activeMenuId]);

    const handleRenameConversation = async () => {
        if (!renameModalId || !renameTitle.trim()) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API}/api/chat/conversations/${renameModalId}`, {
                method: "PATCH",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title: renameTitle.trim() })
            });

            if (res.ok) {
                const updated = await res.json();
                setConversations(prev => prev.map(c => c.id === renameModalId ? { ...c, title: updated.title } : c));
                
                toast.success("Conversation renamed successfully", {
                    className: "premium-toast success",
                    duration: 3000
                });
            } else {
                toast.error("Failed to rename conversation");
            }
        } catch (err) {
            toast.error("An error occurred while renaming");
        } finally {
            setRenameModalId(null);
            setRenameTitle("");
            setActiveMenuId(null);
        }
    };

    const handleDeleteConversation = async (id: string) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API}/api/chat/conversations/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                setConversations(prev => prev.filter(c => c.id !== id));
                if (currentId === id) {
                    handleNavClick("new");
                }
                
                toast.success("Conversation deleted successfully", {
                    className: "premium-toast success",
                    duration: 3000
                });

                // Close sidebar on mobile after deletion
                if (window.innerWidth <= 1024) {
                    closeSidebar();
                }
            } else {
                toast.error("Failed to delete conversation");
            }
        } catch (err) {
            toast.error("An error occurred while deleting");
        } finally {
            setDeleteModalId(null);
            setActiveMenuId(null);
        }
    };

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API}/api/chat/conversations`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.status === 401) {
                    localStorage.removeItem("token");
                    router.push("/login");
                    return;
                }
                if (res.ok) {
                    const data = await res.json();
                    setConversations(data);
                }
            } catch (err) {
                // Silently fail or handle gracefully without console error
            }
        };
        fetchConversations();
    }, [currentId]);

    const handleNavClick = (id: string) => {
        if (onConversationSelect) {
            onConversationSelect(id);
        }
        if (window.innerWidth <= 1024) {
            closeSidebar();
        }
    };

    return (
        <>
            <aside className={`sidebar ${isSidebarOpen ? "expanded" : "collapsed"}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo-container">
                    <button
                        className="sidebar-toggle-btn lg-visible"
                        onClick={toggleSidebar}
                        title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        <Menu size={20} />
                    </button>
                    
                    <div className="mobile-visible logo-wrap">
                        <Logo width={120} />
                    </div>
                </div>
                
                <button
                    className="sidebar-close-btn mobile-visible"
                    onClick={closeSidebar}
                    aria-label="Close sidebar"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="nav-list custom-scroll" ref={navRef}>
                <div className="px-2 mb-2">
                    <button
                        className={`btn-new-chat ${!currentId ? "active" : ""}`}
                        onClick={() => handleNavClick("new")}
                    >
                        <Plus size={20} strokeWidth={2} />
                        <span className="sidebar-text text-[25px]">New Chat</span>
                    </button>
                </div>
                {conversations.map((conv) => (
                    <div
                        key={conv.id}
                        className={`nav-item-wrapper ${currentId === conv.id ? "active" : ""}`}
                        onClick={() => handleNavClick(conv.id)}
                    >
                        <div className="nav-link-content overflow-hidden">
                            <MessageSquare size={18} strokeWidth={2} className="text-text-dim" />
                            <span className="truncate sidebar-text">{conv.title || "Untitled Chat"}</span>
                        </div>

                        <div 
                            className="menu-container sidebar-text" 
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="menu-trigger-btn"
                                onClick={(e) => handleMenuClick(e, conv.id)}
                                aria-label="Chat actions"
                            >
                                <MoreVertical size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </nav>

            {/* Global Chat Action Menu - Fixed positioning to pop out of sidebar */}
            {activeMenuId && (
                <div 
                    className="chat-action-menu fixed menu-fade-in shadow-xl"
                    style={{ 
                        top: `${menuPosition.top}px`, 
                        left: `${menuPosition.left}px`,
                        transform: 'translateY(-50%)'
                    }}
                >
                    <button
                        className="menu-action-item"
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            const conv = conversations.find(c => c.id === activeMenuId);
                            if (conv) {
                                setRenameTitle(conv.title || "Untitled Chat");
                                setRenameModalId(activeMenuId);
                            }
                            setActiveMenuId(null); 
                        }}
                    >
                        <Edit2 size={14} /> Rename
                    </button>
                    <button
                        className="menu-action-item"
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            setShareModalId(activeMenuId);
                            setActiveMenuId(null); 
                        }}
                    >
                        <Share2 size={14} /> Share
                    </button>
                    <div className="sidebar-divider" style={{ margin: '4px 0' }} />
                    <button
                        className="menu-action-item delete"
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeleteModalId(activeMenuId);
                            setActiveMenuId(null);
                        }}
                    >
                        <Trash2 size={14} /> Delete
                    </button>
                </div>
            )}

            <div className="mt-auto pt-2 flex flex-col gap-1">
                <hr className={`sidebar-divider ${!isSidebarOpen ? 'opacity-0' : ''}`} />

                <div className="nav-link" onClick={toggleTheme}>
                    {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                    <span className="sidebar-text">{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
                </div>

                <div className="settings-container" ref={settingsRef}>
                    <div
                        className={`nav-link ${isSettingsOpen ? "active" : ""}`}
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    >
                        <Settings size={20} />
                        <span className="sidebar-text">Settings</span>
                    </div>

                    {isSettingsOpen && (
                        <div className="settings-menu menu-fade-in shadow-xl">
                            <div className="menu-item logout" onClick={handleLogout}>
                                <LogOut size={18} />
                                <span>Logout</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>

        <Modal 
            isOpen={!!renameModalId}
            onClose={() => {
                setRenameModalId(null);
                setRenameTitle("");
            }}
            onConfirm={handleRenameConversation}
            title="Rename Conversation"
            confirmText="Rename"
            cancelText="Cancel"
            type="default"
        >
            <div className="mt-4 premium-input-container">
                <input
                    type="text"
                    className="premium-input"
                    placeholder="Enter new title..."
                    value={renameTitle}
                    onChange={(e) => setRenameTitle(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleRenameConversation();
                    }}
                />
            </div>
        </Modal>

        <Modal 
            isOpen={!!deleteModalId}
            onClose={() => setDeleteModalId(null)}
            onConfirm={() => deleteModalId && handleDeleteConversation(deleteModalId)}
            title="Delete Conversation"
            message="Are you sure you want to delete this conversation? This action cannot be undone."
            confirmText="Delete"
            cancelText="Keep Chat"
            type="danger"
        />

        <ShareModal 
            isOpen={!!shareModalId}
            onClose={() => setShareModalId(null)}
            conversationId={shareModalId || ""}
            isShared={conversations.find(c => c.id === shareModalId)?.isShared || false}
            onShareToggle={(isShared) => {
                setConversations(prev => prev.map(c => c.id === shareModalId ? { ...c, isShared } : c));
            }}
        />
        </>
    );
}
