"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, UserPlus, Activity, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from "framer-motion";
import Logo from "@/components/common/Logo";
import '@/styles/auth.css';
import { toast } from 'sonner';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const API = process.env.NEXT_PUBLIC_API_URL;
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${API}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Account created successfully!');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1000);
            } else {
                setError(data.error || 'Signup failed. Please try again.');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during signup');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            {/* Illustration Side */}
            <div className="auth-illustration-side">
                <motion.div
                    className="illustration-content"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <img
                        src="/auth-illustration.png"
                        alt="Join Nura AI"
                        className="illustration-image"
                    />
                </motion.div>
            </div>

            {/* Form Side */}
            <div className="auth-form-side">
                <motion.div
                    className="auth-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex justify-center" style={{ marginBottom: '30px' }}>
                        <Logo size="xl" />
                    </div>

                    <div className="auth-header" style={{ marginTop: '-20px' }}>
                        <h1>Create account</h1>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid #fee2e2' }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <form className="auth-form" onSubmit={handleSignUp}>
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={20} />
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={20} />
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={20} />
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="auth-btn" disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <span>Get Started</span>
                                    <UserPlus size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer" style={{ marginTop: '-30px' }}>
                        Already have an account? <Link href="/login" className="auth-link">Sign in</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
