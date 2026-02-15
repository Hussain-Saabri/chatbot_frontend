"use client";

import React from 'react';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    width?: string | number;
    height?: string | number;
    className?: string;
    iconOnly?: boolean;
}

export default function Logo({
    size = 'md',
    width,
    height,
    className = '',
    iconOnly = false
}: LogoProps) {
    const sizes = {
        sm: { height: 26 },
        md: { height: 32 },
        lg: { height: 40 },
        xl: { height: 60 }
    };

    const currentSize = sizes[size];
    const finalHeight = height || (width ? 'auto' : currentSize.height);
    const finalWidth = width || 'auto';

    if (iconOnly) {
        return (
            <div className={`flex items-center select-none cursor-default ${className}`}>
                <svg
                    width={finalWidth}
                    height={finalHeight}
                    viewBox="0 0 60 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ height: finalHeight, width: finalWidth }}
                >
                    <rect x="10" y="10" width="40" height="40" rx="8" fill="#2bbf90" />
                    <path d="M22 20V40M22 20L38 40V20" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M30 15V19M30 41V45M15 30H19M41 30H45" stroke="#2bbf90" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>
        );
    }

    return (
        <div className={`flex items-center select-none cursor-default ${className}`}>
            <svg
                width={finalWidth}
                height={finalHeight}
                viewBox="0 0 200 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ height: finalHeight, width: finalWidth }}
            >
                <rect x="10" y="10" width="40" height="40" rx="8" fill="#2bbf90" />
                <path d="M22 20V40M22 20L38 40V20" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M30 15V19M30 41V45M15 30H19M41 30H45" stroke="#2bbf90" strokeWidth="2" strokeLinecap="round" />

                <text
                    x="60"
                    y="42"
                    fontFamily="Inter, sans-serif"
                    fontWeight="700"
                    fontSize="28"
                    fill="currentColor"
                    className="text-text-main"
                >
                    Nura<tspan fill="#2bbf90">AI</tspan>
                </text>
            </svg>
        </div>
    );
}
