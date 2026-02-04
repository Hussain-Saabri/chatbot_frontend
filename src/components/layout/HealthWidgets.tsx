"use client";

import { Activity, Heart, Thermometer, Droplet, TrendingUp } from "lucide-react";

export default function HealthWidgets() {
    const stats = [
        { label: "Heart Rate", value: "72 bpm", icon: Heart, color: "text-rose-500", bg: "bg-rose-50" },
        { label: "Body Temp", value: "98.6 °F", icon: Thermometer, color: "text-orange-500", bg: "bg-orange-50" },
        { label: "Hydration", value: "85%", icon: Droplet, color: "text-blue-500", bg: "bg-blue-50" },
    ];

    return (
        <aside className="flex flex-col gap-6 w-[340px]">
            {/* Wellness Stats */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold">Wellness Stats</h2>
                    <TrendingUp size={18} className="text-primary-teal" />
                </div>
                <div className="flex flex-col gap-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="flex items-center justify-between p-3 rounded-2xl bg-white/50 border border-glass-border">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={20} />
                                </div>
                                <span className="text-sm font-medium">{stat.label}</span>
                            </div>
                            <span className="font-bold text-sm">{stat.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Health Tips card */}
            <div className="glass-card p-6 bg-primary-teal text-white border-none overflow-hidden relative">
                <div className="relative z-10">
                    <h2 className="font-bold mb-2">Health Tips Today</h2>
                    <p className="text-xs opacity-90 leading-relaxed">
                        Maintain a consistent sleep schedule to improve cognitive function and mood regulation.
                    </p>
                    <button className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition-all backdrop-blur-md">
                        View All Tips
                    </button>
                </div>
                <Activity className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10" />
            </div>

            {/* Suggested Questions */}
            <div className="glass-card p-6">
                <h2 className="font-bold mb-4">Suggested Questions</h2>
                <div className="flex flex-col gap-2">
                    {[
                        "Analyze my recent lab results",
                        "Recommend diet for low iron",
                        "Explain medical terminology",
                        "Check medication interactions"
                    ].map((q) => (
                        <button key={q} className="text-left text-xs p-3 rounded-xl border border-glass-border hover:bg-primary-glow hover:border-primary-teal transition-all text-text-secondary">
                            {q}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Summary Widget */}
            <div className="glass-card p-6 border-dashed border-primary-teal/30 bg-primary-glow/5 relative">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-primary-teal animate-pulse"></div>
                    <h2 className="font-bold text-xs uppercase tracking-wider text-primary-teal">AI Insight</h2>
                </div>
                <p className="text-xs text-text-secondary italic">
                    "Based on your profile, your hydration levels are slightly lower than optimal. Consider increasing water intake by 500ml today."
                </p>
            </div>
        </aside>
    );
}
