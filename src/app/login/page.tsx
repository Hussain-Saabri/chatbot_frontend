"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Activity, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import '@/styles/auth.css';
import { useRouter } from "next/navigation";
import { toast } from 'sonner';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            
            const data = await response.json();
            
            if (data.token) {
    localStorage.setItem('token', data.token); // Token save ho gaya
}
            if (response.ok) {
                toast.success('User logged in successfully!');
                setTimeout(() => {
                    router.push("/");
                }, 1000);
            } else {
                setError(data.error || 'Login failed. Please try again.');
            }
        } catch (err) {
            setError('Could not connect to the server. Is the backend running?');
            console.error('Login error:', err);
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
                        alt="Nova AI Illustration"
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
                    <div className="auth-logo">
                        <div className="logo-icon">
                            <Activity size={24} />
                        </div>
                        <span className="logo-text">Nova<span style={{ color: 'var(--primary)' }}>AI</span></span>
                    </div>

                    <div className="auth-header">
                        <h1>Welcome back</h1>
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

                    <form className="auth-form" onSubmit={handleSignIn}>
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
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="checkbox-group">
                                <input type="checkbox" id="remember" />
                                <span>Keep me logged in</span>
                            </label>
                            <Link href="#" className="auth-link" style={{ fontSize: '0.9rem' }}>
                                Forgot password?
                            </Link>
                        </div>

                        <button type="submit" className="auth-btn" disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account? <Link href="/signup" className="auth-link">Create account</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
