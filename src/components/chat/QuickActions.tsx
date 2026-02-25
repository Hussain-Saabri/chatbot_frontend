"use client";

import { motion } from "framer-motion";
import { Heart, Info, Upload, AlertTriangle } from "lucide-react";

const ACTIONS = [
    { id: "symptoms", icon: Heart, label: "Check Symptoms", color: "#ec4899" },
    { id: "tips", icon: Info, label: "Health Tips", color: "#06b6d4" },
    { id: "upload", icon: Upload, label: "Upload Reports", color: "#8b5cf6" },
    { id: "emergency", icon: AlertTriangle, label: "Emergency", color: "#f59e0b" },
];

export default function QuickActions() {
    return (
        <div className="quick-actions-row">
            {ACTIONS.map((action) => (
                <motion.div
                    key={action.id}
                    className="action-card-saas"
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <action.icon size={16} style={{ color: action.color }} />
                        <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Medical</span>
                    </div>
                    <span className="text-sm font-semibold tracking-tight">{action.label}</span>
                </motion.div>
            ))}
        </div>
    );
}
