'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('username', data.username);

        const profileRes = await fetch('http://localhost:8000/api/uploader-profile/', {
          headers: {
            Authorization: `Bearer ${data.access}`,
          },
        });

        const profileData = await profileRes.json();

        if (profileData.upload_code) {
          localStorage.setItem('role', 'Uploader');
        } else {
          localStorage.setItem('role', 'Reader');
        }

        if (profileData.id) {
          localStorage.setItem('uploader_id', profileData.id);
        }

        setMessage('✅ Login successful!...');
        router.push('/');
      } else {
        setMessage('❌ Login failed: ' + (data.detail || 'Invalid credentials'));
      }
    } catch (err) {
      setMessage('❌ Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 to-indigo-200 px-4 py-8">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-indigo-800">📚 Study Material Hub</h1>
        <h2 className="text-xl text-center text-gray-600">Login to continue</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-indigo-300 rounded-lg text-black focus:ring-2 focus:ring-indigo-400"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-indigo-300 rounded-lg pr-10 text-black focus:ring-2 focus:ring-indigo-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {message && <p className="text-center text-sm font-semibold text-red-600">{message}</p>}

        <div className="text-center mt-4">
          <a href="/forgot-password" className="text-indigo-500 text-sm hover:underline">
            <KeyRound className="inline mr-2" /> Forgot your password?
          </a>
        </div>

        <div className="text-center text-sm text-gray-600 mt-4">
          New user?{' '}
          <Link href="/signup" className="text-indigo-700 font-semibold hover:underline">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
}
