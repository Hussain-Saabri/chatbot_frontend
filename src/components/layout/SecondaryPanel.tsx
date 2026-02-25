"use client";

import { Activity, FileText, Zap, Heart, Thermometer, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function SecondaryPanel() {
    return (
        <aside className="secondary-panel custom-scrollbar">
            <div className="panel-section">
                <h3 className="heading-sm">Health Insights</h3>

                <div className="insight-card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Blood Glucose</span>
                        <TrendingUp size={14} className="text-primary" />
                    </div>
                    <div className="insight-value">98 <span className="text-xs text-text-muted font-medium">mg/dL</span></div>
                    <div className="w-full h-1 bg-gray-100 rounded-full mt-2">
                        <div className="w-[70%] h-full bg-primary rounded-full" />
                    </div>
                    <p className="text-[10px] text-text-muted mt-2">Stable • Last checked 2h ago</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="insight-card mb-0">
                        <Heart size={14} className="text-red-500 mb-2" />
                        <div className="text-sm font-bold">72 <span className="text-[10px] text-text-muted">BPM</span></div>
                        <div className="text-[9px] text-text-muted uppercase font-bold">Pulse</div>
                    </div>
                    <div className="insight-card mb-0">
                        <Thermometer size={14} className="text-orange-500 mb-2" />
                        <div className="text-sm font-bold">98.6 <span className="text-[10px] text-text-muted">°F</span></div>
                        <div className="text-[9px] text-text-muted uppercase font-bold">Temp</div>
                    </div>
                </div>
            </div>

            <div className="panel-section">
                <h3 className="heading-sm">Quick Actions</h3>
                <div className="flex flex-col gap-2">
                    <button className="flex items-center gap-3 p-3 bg-bg-app border border-sidebar-border rounded-md hover:border-primary transition-standard text-left group">
                        <div className="w-8 h-8 rounded bg-primary-soft text-primary flex items-center justify-center transition-standard group-hover:bg-primary group-hover:text-white">
                            <Zap size={16} />
                        </div>
                        <div>
                            <div className="text-xs font-bold">Symptom Checker</div>
                            <div className="text-[9px] text-text-muted">AI-powered diagnostic</div>
                        </div>
                    </button>

                    <button className="flex items-center gap-3 p-3 bg-bg-app border border-sidebar-border rounded-md hover:border-primary transition-standard text-left group">
                        <div className="w-8 h-8 rounded bg-primary-soft text-primary flex items-center justify-center transition-standard group-hover:bg-primary group-hover:text-white">
                            <Activity size={16} />
                        </div>
                        <div>
                            <div className="text-xs font-bold">Vital Sync</div>
                            <div className="text-[9px] text-text-muted">Sync wearable data</div>
                        </div>
                    </button>
                </div>
            </div>

            <div className="panel-section border-none">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="heading-sm mb-0">Recent Reports</h3>
                    <span className="text-[10px] font-bold text-primary cursor-pointer hover:underline">View All</span>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="report-item">
                        <div className="w-8 h-8 rounded bg-white border border-sidebar-border flex items-center justify-center text-text-muted">
                            <FileText size={16} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-semibold">Blood_Work_Jan.pdf</span>
                            <span className="text-[9px] text-text-dim text-xs">Analyzed by Nura AI</span>
                        </div>
                    </div>

                    <div className="report-item">
                        <div className="w-8 h-8 rounded bg-white border border-sidebar-border flex items-center justify-center text-text-muted">
                            <FileText size={16} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-semibold">Thyroid_Scan.jpg</span>
                            <span className="text-[9px] text-text-dim text-xs">Ready for review</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
