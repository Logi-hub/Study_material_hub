'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ClipboardCopy, Check, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function AuthorizedUploaderPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    phone: '',
    designation: '',
    institution: '',
    place: '',
  });

  const [message, setMessage] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const access = localStorage.getItem('access_token');
    if (!access) {
      setMessage('❌ You must be logged in to access this page.');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      setToken(access);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setCode('');
    setLoading(true);

    if (!token) {
      setMessage('❌ Access token missing. Please login again.');
      return;
    }

    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/api/register-uploader/',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setCode(res.data.code);
      setMessage('✅ You are now verified as an uploader.');
      localStorage.setItem('role', 'Uploader');
      setTimeout(() => {
        router.push('/uploader-profile');
      }, 2000);
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        'Something went wrong!';
      setMessage(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 to-indigo-200 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md border border-indigo-200"
      >
        <h2 className="text-indigo-700 text-3xl font-bold text-center mb-6 tracking-wide">
          <ShieldCheck size={30} className="inline mr-2" />
          Uploader Verification
        </h2>

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          className="w-full mb-4 p-3 rounded-full border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black placeholder-gray-500"
          onChange={handleChange}
          value={form.phone}
          required
        />
        <input
          type="text"
          name="designation"
          placeholder="Designation"
          className="w-full mb-4 p-3 rounded-full border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black placeholder-gray-500"
          onChange={handleChange}
          value={form.designation}
          required
        />
        <input
          type="text"
          name="institution"
          placeholder="Institution/Company"
          className="w-full mb-4 p-3 rounded-full border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black placeholder-gray-500"
          onChange={handleChange}
          value={form.institution}
          required
        />
        <textarea
          name="place"
          placeholder="Your place/Location"
          className="w-full mb-4 p-3 rounded-2xl border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black placeholder-gray-500"
          onChange={handleChange}
          value={form.place}
          required
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-full transition-all duration-200"
        >
          {loading ? 'Verifying...' : 'Submit Verification'}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm font-semibold text-red-600">
            {message}
          </p>
        )}

        {code && (
          <div className="mt-4 text-center text-sm font-semibold text-green-700">
            <div className="flex justify-center items-center gap-2">
              <ShieldCheck />
              Verification Code:{' '}
              <span className="bg-green-100 px-2 py-1 rounded-md">{code}</span>
              <button
                onClick={handleCopy}
                className="text-indigo-600 hover:text-indigo-800"
                title="Copy"
              >
                {copied ? <Check size={18} /> : <ClipboardCopy size={18} />}
              </button>
            </div>
            {copied && (
              <p className="text-center text-xs mt-1 text-green-600 font-medium">
                Code copied to clipboard!
              </p>
            )}

            <br />
            <p className="mt-2">
              <ArrowLeft />
              <a className="text-indigo-700 underline" href="/materials/upload">
                Go to Upload Page
              </a>{' '}
              |{' '}
              <a className="text-indigo-700 underline" href="/">
                Back to Home
              </a>
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
