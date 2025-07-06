'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSendOTP = async () => {
    if (!email) return;
    setMessage('');
    setIsSending(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/forgot-password/email/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('✅ OTP sent to your email!');
        setOtpSent(true);
        setCooldown(30);
      } else {
        setMessage(`❌ ${data.error || 'Failed to send OTP'}`);
      }
    } catch {
      setMessage('❌ Network error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
          🔑 Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-blue-300 rounded mb-4 text-black"
        />

        <button
          onClick={handleSendOTP}
          disabled={isSending || !email || cooldown > 0}
          className={`w-full text-white py-2 rounded ${
            cooldown > 0 || isSending
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSending
            ? 'Sending...'
            : cooldown > 0
            ? `Resend OTP in ${cooldown}s`
            : otpSent
            ? 'Resend OTP'
            : 'Send OTP'}
        </button>

        {message && (
          <p className="text-center mt-3 text-sm text-red-600">{message}</p>
        )}

        {otpSent && (
          <div className="text-center mt-4">
            <Link
              href={`/reset-password?email=${encodeURIComponent(email)}`}
              className="text-blue-600 underline font-medium"
            >
              ➤ Continue to Reset Password
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
