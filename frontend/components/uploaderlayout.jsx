'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, User, Upload, Bookmark, Info, LogOut, Folder, Key } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function UploaderLayout({ children }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('uploader_id');
    alert('✅ Logout successful!');
    window.location.href = '/';
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedRole = localStorage.getItem('role');
    const currentPath = window.location.pathname;
    const protectedPaths = ['/upload-material', '/uploader-profile', '/my_uploads'];

    if (protectedPaths.includes(currentPath) && !token) {
      router.push('/login');
      return;
    }

    if (token) {
      setIsAuthenticated(true);
      if (storedRole === 'Uploader') setUserRole('Uploader');
      else setUserRole('Reader');
    }
  }, []);

  return (
    <div className="flex min-h-screen m-0 p-0">
      {isAuthenticated && (
        <div className="w-64 bg-indigo-800 text-white p-6 space-y-4 ">
          <h2 className="text-2xl font-bold mb-6">📚 Study Hub</h2>
          <nav className="space-y-3">
            <Link href="/" className="block hover:text-yellow-300">
              <Home className="inline mr-2" /> Home
            </Link>
            <Link href="/uploader-profile" className="block hover:text-yellow-300">
              <User className="inline mr-2" /> Profile
            </Link>

            {userRole === 'Uploader' && (
              <>
                <Link href="/upload-material" className="block hover:text-yellow-300">
                  <Upload className="inline mr-2" /> Upload Material
                </Link>
                <Link href="/my_uploads" className="block hover:text-yellow-300">
                  <Folder className="inline mr-2" /> My Uploads
                </Link>
              </>
            )}

            <Link href="/saved-materials" className="block hover:text-yellow-300">
              <Bookmark className="inline mr-2" /> Saved materials
            </Link>

            <Link href="/forgot-password" className="block hover:text-yellow-300">
              <Key className="inline mr-2" /> Change Password
            </Link>

            <a href="#about" className="block hover:text-yellow-300">
              <Info className="inline mr-2" size={18} /> About Us
            </a>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-800"
            >
              <LogOut /> Logout
            </button>
          </nav>
        </div>
      )}

      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
