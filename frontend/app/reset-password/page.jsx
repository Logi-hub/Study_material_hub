'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, KeyRound } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get('email') || '';

  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [emailFromQuery]);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('❌ Passwords do not match');
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/reset-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Password reset successful! Redirecting...');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setMessage(`❌ ${data.error || 'Failed to reset password'}`);
      }
    } catch {
      setMessage('❌ Network error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-100">
      <form
        onSubmit={handleReset}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-800">
          <KeyRound className="inline mr-2" /> Reset Password
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          readOnly
          className="w-full px-4 py-2 border border-indigo-300 rounded-lg text-black"
        />

        <input
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOTP(e.target.value)}
          required
          className="w-full px-4 py-2 border border-indigo-300 rounded-lg text-black"
        />

        <div className="relative">
          <input
            type={showNewPassword ? 'text' : 'password'}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-indigo-300 rounded-lg text-black pr-10"
          />
          <div
            onClick={() => setShowNewPassword((prev) => !prev)}
            className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
          >
            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>

        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-indigo-300 rounded-lg text-black pr-10"
          />
          <div
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>

        <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
          Reset Password
        </button>

        {message && (
          <p className="text-center text-red-600 text-sm">{message}</p>
        )}
      </form>
    </div>
  );
}
