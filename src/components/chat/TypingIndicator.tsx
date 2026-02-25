"use client";

import { motion } from "framer-motion";

export default function TypingIndicator() {
    return (
        <div
            style={{
                display: 'inline-flex',
                padding: '8px 4px',
                alignItems: 'center',
                gap: '6px',
                width: 'fit-content',
                marginLeft: '12px'
            }}
        >
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: 'var(--primary)',
                        borderRadius: '50%',
                        display: 'block'
                    }}
                    animate={{
                        y: [0, -6, 0],
                        opacity: [0.4, 1, 0.4]
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.2
                    }}
                />
            ))}
        </div>
    );
}
