'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UploaderLayout from '@/components/uploaderlayout';
import Link from 'next/link';
import { ShieldOff, UploadCloud } from 'lucide-react';

export default function UploadAltPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(null);
  const [customSubject, setCustomSubject] = useState('');
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const subjectOptions = [
    'Engineering', 'NEET', 'Physics', 'Chemistry', 'Biology',
    'Mathematics', 'Computer Science', 'General Knowledge', 'Current Affairs'
  ];

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    const userRole = localStorage.getItem('role');

    if (!storedToken) {
      setMessage('⚠️ Please login first!');
      router.push('/login');
    } else {
      setToken(storedToken);
      setIsAuthenticated(true);
      setRole(userRole);
    }
  }, [router]);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!subject || !title || !verificationCode || !file) {
      setMessage('❌ Please fill in all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('subject', subject === 'others' ? customSubject : subject);
    formData.append('verification_code', verificationCode);
    formData.append('file', file);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/materials/upload/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        setMessage('✅ Material uploaded successfully!');
        setSubject('');
        setTitle('');
        setVerificationCode('');
        setFile(null);

        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        const data = await res.json();
        setMessage(`❌ Upload failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      setMessage('❌ Network error. Please try again.');
    }
  };

 
  if (isAuthenticated && role !== 'Uploader') {
    return (
      <UploaderLayout>
        <div className="min-h-screen flex items-center justify-center bg-red-50 px-4 m-0 p-0">
          <div className=" w-full text-center space-y-4 border-red-300">
            <h2 className="text-xl font-bold text-red-600">
              <ShieldOff className="inline mr-2" />
              Access Denied
            </h2>
            <p className="text-gray-700">
              This page is only for <strong>authorized uploaders</strong>.
            </p>
            <p className="text-sm text-gray-600">
              To become an uploader, click below.
            </p>
            <Link
              href="/authorized"
              className="inline-block mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
            >
              Become an Uploader
            </Link>
          </div>
        </div>
      </UploaderLayout>
    );
  }

  return (
    <UploaderLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 to-indigo-200 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xl space-y-6">
          <h1 className="text-3xl font-bold text-indigo-800 text-center">
            <UploadCloud className="inline mr-2" />
            Upload Study Material
          </h1>
          <form onSubmit={handleUpload} className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Material Title"
              required
              className="w-full px-4 py-2 border-2 border-indigo-300 rounded-lg text-black"
            />
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full px-4 py-2 border-2 border-indigo-300 rounded-lg text-black"
            >
              <option value="">Select Subject</option>
              {subjectOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
              <option value="others">others</option>
            </select>

            {subject === 'others' && (
              <input
                type="text"
                placeholder="Enter Custom Subject"
                className="w-full px-4 py-2 border-2 border-indigo-300 rounded-lg text-black"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                required
              />
            )}

            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Verification Code"
              required
              className="w-full px-4 py-2 border-2 border-indigo-300 rounded-lg text-black"
            />

            <input
              type="file"
              accept=".pdf,.docx,.ppt,.pptx,.txt,.jpg,.png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              className="w-full border-2 border-dashed border-indigo-400 rounded-lg p-3 bg-indigo-50 text-sm text-gray-800"
            />
            {file && (
              <div className="text-sm text-gray-600 mt-1">
                📎 File: <strong>{file.name}</strong>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Upload Material
            </button>
          </form>

          {message && (
            <p className="text-center text-sm font-semibold text-red-600 mt-2">
              {message}
            </p>
          )}
        </div>
      </div>
    </UploaderLayout>
  );
}
