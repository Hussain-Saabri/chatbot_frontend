"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface LogoFull3DProps {
    width?: number;
    className?: string;
}

export default function LogoFull3D({
    width = 200,
    className = ''
}: LogoFull3DProps) {
    const height = (width * 60) / 200;
    return (
        <div 
            className={`relative flex items-center justify-center ${className}`}
            style={{ 
                perspective: '1200px',
                width: '90%',
                maxWidth: width,
                aspectRatio: '200 / 60',
                margin: '0 auto'
            }}
        >
            <motion.div
                initial={{
                    rotateY: -20,
                    rotateX: -10,
                    y: 0
                }}
                animate={{
                    rotateY: [-20, 20, -20],
                    rotateX: [-10, 10, -10],
                    y: [0, -15, 0]
                }}
                transition={{
                    rotateY: {
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    },
                    rotateX: {
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    },
                    y: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }
                }}
                style={{
                    width: '100%',
                    height: '100%',
                    transformStyle: 'preserve-3d'
                }}
            >
                {/* Main Logo Container with Glassmorphism/Depth */}
                <div 
                    className="absolute inset-0 flex items-center justify-center select-none"
                    style={{ 
                        transform: 'translateZ(20px)',
                    }}
                >
                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 200 60"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Icon Box with Depth - Shifted right for centering */}
                        <rect x="25" y="10" width="40" height="40" rx="8" fill="#2bbf90" />
                        <path d="M37 20V40M37 20L53 40V20" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M45 15V19M45 41V45M30 30H34M56 30H60" stroke="#2bbf90" strokeWidth="2" strokeLinecap="round" />

                        <text
                            x="75"
                            y="42"
                            fontFamily="Inter, sans-serif"
                            fontWeight="700"
                            fontSize="28"
                            fill="currentColor"
                            className="text-[#1e293b]"
                        >
                            Nura<tspan fill="#2bbf90">AI</tspan>
                        </text>
                    </svg>
                </div>

                {/* Subtle Ambient Glow */}
                <motion.div
                    animate={{
                        opacity: [0.1, 0.2, 0.1],
                        scale: [0.8, 1.0, 0.8]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-[-5%] bg-[#2bbf90] rounded-full blur-[80px] -z-10"
                />
            </motion.div>
        </div>
    );
}
