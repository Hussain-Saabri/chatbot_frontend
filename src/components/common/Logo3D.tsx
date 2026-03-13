"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface Logo3DProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export default function Logo3D({
    size = 'md',
    className = ''
}: Logo3DProps) {
    const sizes = {
        sm: 40,
        md: 60,
        lg: 100,
        xl: 140
    };

    const currentSize = sizes[size];

    return (
        <div 
            className={`relative flex items-center justify-center ${className}`}
            style={{ 
                perspective: '1000px',
                width: currentSize,
                height: currentSize 
            }}
        >
            <motion.div
                animate={{
                    rotateY: [0, 360],
                    y: [0, -10, 0]
                }}
                transition={{
                    rotateY: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    },
                    y: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }
                }}
                style={{
                    width: '70%',
                    height: '70%',
                    position: 'relative',
                    transformStyle: 'preserve-3d'
                }}
            >
                {/* Front Face */}
                <div 
                    className="absolute inset-0 bg-gradient-to-br from-[#2bbf90] to-[#24a37a] rounded-xl flex items-center justify-center shadow-2xl border border-white/20"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <svg
                        viewBox="0 0 60 60"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-[70%] h-[70%]"
                    >
                        <path d="M22 20V40M22 20L38 40V20" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                {/* Back Face */}
                <div 
                    className="absolute inset-0 bg-gradient-to-br from-[#2bbf90] to-[#24a37a] rounded-xl flex items-center justify-center shadow-2xl border border-white/20"
                    style={{ 
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                    }}
                >
                    <svg
                        viewBox="0 0 60 60"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-[70%] h-[70%]"
                    >
                        <path d="M22 20V40M22 20L38 40V20" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                
                {/* Enhanced Green Glow Effect */}
                <motion.div
                    animate={{
                        opacity: [0.4, 0.8, 0.4],
                        scale: [1, 1.4, 1]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-[-20%] bg-[#2bbf90] rounded-full blur-3xl -z-10"
                />
            </motion.div>
        </div>
    );
}
