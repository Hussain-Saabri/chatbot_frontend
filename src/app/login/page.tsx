"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '@/components/common/Logo';
import '@/styles/auth.css';
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

// Placeholder Client ID - User will provide this
const GOOGLE_CLIENT_ID = "449528196298-iiedmrh3an15dlhff1hef32c54d0kqg5.apps.googleusercontent.com";

import LogoFull3D from '@/components/common/LogoFull3D';

function LoginContent() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');
    const API = process.env.NEXT_PUBLIC_API_URL;

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${API}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.token) {
                localStorage.setItem('token', data.token);
                window.dispatchEvent(new Event('nura-auth-update'));
            }
            if (response.ok) {
                toast.success('Logged in successfully!');
                sessionStorage.setItem('skip_auth_redirect', 'true');
                setShowSuccess(true);
                setTimeout(() => {
                    sessionStorage.removeItem('skip_auth_redirect');
                    router.push("/");
                }, 2000);
            } else if (response.status === 403 && data.unverifiedEmail) {
                if (data.otpauthUrl) {
                    sessionStorage.setItem('temp_otpauthUrl', data.otpauthUrl);
                }
                toast.error(data.error);
                setTimeout(() => {
                    router.push(`/verify-otp?email=${encodeURIComponent(data.unverifiedEmail)}`);
                }, 1000);
            } else {
                setError(data.error || 'Login failed. Please try again.');
            }
        } catch (err) {
            setError('Could not connect to the server. Is the backend running?');
        } finally {
            if (!showSuccess) setIsLoading(false);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API}/api/auth/google`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        access_token: tokenResponse.access_token
                    }),
                });

                const data = await response.json();

                if (response.ok && data.token) {
                    localStorage.setItem('token', data.token);
                    window.dispatchEvent(new Event('nura-auth-update'));
                    
                    if (data.isNewUser) {
                        toast.success('Google registration successful!');
                    } else {
                        toast.success('Google Sign-In successful!');
                    }
                    
                    sessionStorage.setItem('skip_auth_redirect', 'true');
                    setShowSuccess(true);
                    setTimeout(() => {
                        sessionStorage.removeItem('skip_auth_redirect');
                        router.push("/");
                    }, 3000);
                } else {
                    toast.error(data.error || 'Google Sign-In failed');
                    setIsLoading(false);
                }
            } catch (err) {
                toast.error('Could not connect to the server');
                setIsLoading(false);
            }
        },
        onError: () => {
            toast.error('Google Login Failed');
        },
    });

    if (showSuccess) {
        return (
            <div className="flex flex-col items-center justify-center bg-white p-4" style={{ height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <LogoFull3D width={300} />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="flex flex-col items-center"
                    style={{ marginTop: '24px' }}
                >
                    <span style={{ 
                        color: '#475569', 
                        fontSize: '1.4rem', 
                        fontWeight: '400', 
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        opacity: 0.8
                    }}>
                        Welcome back
                    </span>
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: 40 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        style={{ 
                            height: '2px', 
                            backgroundColor: '#2bbf90', 
                            marginTop: '12px',
                            borderRadius: '2px'
                        }} 
                    />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-form-side login-form-side">
                <motion.div
                    className="auth-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex justify-center" style={{ marginBottom: '12px' }}>
                        <Logo size="lg" />
                    </div>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid #fee2e2', marginBottom: '10px' }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <form className="auth-form" onSubmit={handleSignIn}>
                        <div className="form-group">
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

                        <div className="auth-divider">
                            <span>OR</span>
                        </div>

                        <button
                            type="button"
                            className="google-btn"
                            onClick={() => googleLogin()}
                            disabled={isLoading}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span>Sign in with Google</span>
                        </button>
                    </form>

                    <div className="auth-card-footer" style={{ marginTop: '10px', textAlign: 'center', fontSize: '0.9rem', color: '#6b7280' }}>
                        Don't have an account? <Link href="/signup" className="auth-link" style={{ color: '#000', fontWeight: '600', marginLeft: '4px' }}>Sign up</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <LoginContent />
        </GoogleOAuthProvider>
    );
}
