"use client";

import React from 'react';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    iconOnly?: boolean; // Kept for compatibility, but will render text-mark
}

export default function Logo({ size = 'md', className = '', iconOnly = false }: LogoProps) {
    const sizes = {
        sm: { fontSize: '1.25rem' },
        md: { fontSize: '1.75rem' },
        lg: { fontSize: '2.5rem' },
        xl: { fontSize: '3.5rem' }
    };

    const currentSize = sizes[size];

    return (
        <div className={`flex items-center font-sans tracking-tighter select-none cursor-default ${className}`}>
            <div className="flex items-baseline leading-none">
                <span
                    className="font-black"
                    style={{
                        fontSize: currentSize.fontSize,
                        background: 'linear-gradient(135deg, #111827 0%, #374151 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Nura
                </span>
                <span
                    className="font-light ml-1"
                    style={{
                        fontSize: `calc(${currentSize.fontSize} * 0.95)`,
                        background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '0.02em'
                    }}
                >
                    AI
                </span>
            </div>
        </div>
    );
}
