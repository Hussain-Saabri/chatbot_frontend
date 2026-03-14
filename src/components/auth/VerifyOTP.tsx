import React, { useState, useRef, KeyboardEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import Logo from '@/components/common/Logo';
import '@/styles/otp.css';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
export default function VerifyOTP() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'your email address';
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus next input automatically
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Navigate back to previous input on backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Only allow numeric pastes up to 6 characters
    if (/^\d+$/.test(pastedData)) {
      const pasteArray = pastedData.slice(0, 6).split('');
      const newOtp = [...otp];
      pasteArray.forEach((char, i) => {
        newOtp[i] = char;
      });
      setOtp(newOtp);
      
      // Auto-focus next empty input
      const nextEmptyIndex = pasteArray.length < 6 ? pasteArray.length : 5;
      inputRefs.current[nextEmptyIndex]?.focus();
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    setIsVerifying(true);
    
    try {
      const res = await fetch(`${API}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpValue })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        // notify the auth guard listener
        window.dispatchEvent(new Event("nura-auth-update"));
        toast.success("Email verified successfully!");
        router.push("/");
      } else {
        toast.error(data.error || "Incorrect OTP. Please try again.");
        // clear inputs on failure
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const res = await fetch(`${API}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("A new OTP code has been sent!");
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        toast.error(data.error || "Failed to resend OTP");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="otp-card">
      <div className="flex justify-center" style={{ marginBottom: '24px' }}>
        <Logo size="xl" />
      </div>
      
      <h1 className="otp-title">Verify OTP</h1>
      
      <p className="otp-subtitle">
        Enter the 6-digit code sent to<br />
        <span className="otp-email">{email}</span>
      </p>

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              onFocus={handleFocus}
              className="otp-input"
              disabled={isVerifying}
            />
          ))}
        </div>

        <button type="submit" className="otp-button" disabled={isVerifying || otp.join('').length !== 6}>
          {isVerifying ? "Verifying..." : "Verify "}
        </button>
      </form>

      <div className="otp-footer">
        Didn't get the code? 
        <button 
          type="button" 
          className="otp-resend ml-1" 
          onClick={handleResend}
          disabled={isResending}
          style={isResending ? { opacity: 0.5, cursor: "not-allowed" } : {}}
        >
          {isResending ? "Sending..." : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}
