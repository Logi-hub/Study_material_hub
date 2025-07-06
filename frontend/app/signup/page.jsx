'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, CheckCircle, UserPlus, Clock } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    otp: '',
    password: '',
    confirm_password: '',
    role: 'Reader',
    is_authorized_uploader: false,
  });

  useEffect(() => {
    let interval;
    if (otpSent && resendTimer > 0) {
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, resendTimer]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSendOTP = async () => {
    if (!formData.username || !formData.email) {
      setMessage('❌ Please enter username and email first.');
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/send-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: 'temp@1234',
          role: formData.role,
          is_authorized_uploader: formData.is_authorized_uploader
        })
      });

      const data = await res.json();

      if (res.ok) {
        setOtpSent(true);
        setResendTimer(30);
        setMessage('✅ OTP sent to your email.');
      } else {
        setMessage(data.error || '❌ Failed to send OTP.');
      }
    } catch {
      setMessage('❌ Network error while sending OTP.');
    }
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp) {
      setMessage('❌ Enter the OTP to verify.');
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/verify-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp
        })
      });

      const data = await res.json();

      if (res.ok) {
        setOtpVerified(true);
        setMessage('✅ OTP verified successfully!');
      } else {
        setMessage(data.error || '❌ Invalid OTP.');
      }
    } catch {
      setMessage('❌ Network error while verifying OTP.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!otpVerified) {
      setMessage('❌ Please verify OTP first.');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setMessage('❌ Passwords do not match.');
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        const loginRes = await fetch('http://127.0.0.1:8000/api/login/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password
          })
        });

        const loginData = await loginRes.json();

        if (loginRes.ok) {
          localStorage.setItem('access_token', loginData.access);
          localStorage.setItem('refresh_token', loginData.refresh);
          setMessage('✅ Signup & login successful!');
          window.location.href = formData.is_authorized_uploader ? '/authorized' : '/';
        }
      } else {
        setMessage(data.error || '❌ Signup failed.');
      }
    } catch {
      setMessage('❌ Network error during signup.');
    }
  };

  const handleClear = () => {
    setOtpVerified(false);
    setOtpSent(false);
    setResendTimer(30);
    setMessage('');
    setFormData({
      username: '',
      email: '',
      otp: '',
      password: '',
      confirm_password: '',
      role: 'Reader',
      is_authorized_uploader: false
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-indigo-800">📚 Study Material Hub</h1>
        <h2 className="text-xl text-center text-gray-600 flex justify-center items-center gap-2">
          <UserPlus size={20} />Sign Up
        </h2>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg text-black"
          />

          <div className="flex gap-2">
            <button type="button" onClick={handleSendOTP} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
              Send OTP
            </button>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border rounded-lg text-black"
            />
          </div>

          <div className="flex gap-2 items-center">
            <input
              name="otp"
              type="text"
              placeholder="Enter OTP"
              value={formData.otp}
              onChange={handleChange}
              disabled={otpVerified}
              className="flex-1 px-4 py-2 border rounded-lg text-black disabled:opacity-50"
            />
            {otpVerified ? (
              <CheckCircle size={24} className="text-green-600" />
            ) : (
              <button type="button" onClick={handleVerifyOTP} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Verify
              </button>
            )}
          </div>

          {otpSent && (
            <div className="text-sm text-gray-600 mt-1 flex justify-center items-center gap-2">
              {resendTimer > 0 ? (
                <span className="flex items-center gap-1 text-gray-500">
                  <Clock size={14} /> Resend OTP in {resendTimer}s
                </span>
              ) : (
                <button type="button" onClick={handleSendOTP} className="text-indigo-600 font-medium hover:underline">
                  Resend OTP
                </button>
              )}
            </div>
          )}

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg text-black pr-10"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-500">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              name="confirm_password"
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg text-black pr-10"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-2.5 text-gray-500">
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg text-black">
            <option value="Reader">Reader</option>
            <option value="Uploader">Uploader</option>
          </select>

          {formData.role === 'Uploader' && (
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="is_authorized_uploader"
                checked={formData.is_authorized_uploader}
                onChange={handleChange}
                className="h-4 w-4"
              />
              Tick this box if you want to become an uploader.
            </label>
          )}

          <div className="flex gap-3">
            <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Signup</button>
            <button type="button" onClick={handleClear} className="flex-1 border border-indigo-400 text-indigo-600 py-2 rounded-lg hover:bg-indigo-100">Clear</button>
          </div>
        </form>

        {message && <p className="text-center text-sm text-red-600 font-medium">{message}</p>}

        <div className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-700 font-semibold hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
}
