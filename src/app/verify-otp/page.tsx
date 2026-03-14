"use client";
import React, { Suspense } from 'react';
import VerifyOTP from '@/components/auth/VerifyOTP';

function VerifyOTPContent() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f6f8fb',
      padding: '20px'
    }}>
      <VerifyOTP />
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading verification...</div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}
