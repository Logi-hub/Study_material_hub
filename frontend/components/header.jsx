'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem('access_token');
      setIsLoggedIn(!!token);
    };
    checkLogin();

    window.addEventListener('storage', checkLogin);

    const interval = setInterval(checkLogin, 1000);
    return () => {
      window.removeEventListener('storage', checkLogin);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('uploader_id');
    alert('✅ Logout successful!');
    window.location.href = '/';
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center border-b border-indigo-300 ">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-2xl font-bold text-indigo-700 tracking-wide">
          📚 Study Material Hub
        </Link>
        <Link href="/" className="text-indigo-700 hover:underline font-semibold">
          | Home
        </Link>
      </div>

      <div className="space-x-4">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-red-600 hover:underline font-semibold"
          >
            Logout
          </button>
        ) : (
          <>
            <Link href="/login" className="text-indigo-600 hover:underline font-semibold">
              Login
            </Link>
            <Link href="/signup" className="text-indigo-600 hover:underline font-semibold">
              Signup
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
