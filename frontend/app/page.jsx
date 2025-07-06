'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Search,
  Download,
  BookOpen,
  Notebook,
  Clock,
  User
} from 'lucide-react';
import UploaderLayout from '@/components/uploaderlayout';
import SavedButton from '@/components/saved-button';

export default function HomePage() {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMaterials = () => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
    fetch('http://127.0.0.1:8000/api/materials/list/', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(async (res) => {
        if (!res.ok) {
          console.error('Material list fetch error:', res.status);
          return [];
        }
        return await res.json();
      })
      .then((data) => {
        setMaterials(data);
        setFilteredMaterials(data);
      })
      .catch((err) => {
        console.error('❌ Material fetch failed:', err);
      });
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = materials.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.subject.toLowerCase().includes(query) ||
        item.uploaded_by.toLowerCase().includes(query)
    );
    setFilteredMaterials(filtered);
  }, [searchQuery, materials]);

  const handleDownload = async (id, title) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('⚠️ Please login to download materials.');
      window.location.href = '/login';
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/materials/download/${id}/?ts=${Date.now()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store'
        }
      );

      if (res.status === 401) {
        alert('⛔ Session expired. Please login again.');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return;
      }

      if (!res.ok) throw new Error('Download failed');

      const contentDisposition = res.headers.get('Content-Disposition');
      const fileNameMatch = contentDisposition?.match(/filename="(.+)"/);
      const fileName = fileNameMatch ? fileNameMatch[1] : `${title}_${id}`;

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      alert('❌ Download failed. Try again.');
    }
  };

  return (
    <UploaderLayout>
      <div className="min-h-screen bg-gradient-to-br from-violet-100 to-indigo-100 py-8 px-4">
        {/* Hero */}
        <section className="text-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">📚 Study Material Hub</h1>
          <p className="text-lg text-gray-700 mb-4">
            Upload or access academic materials to support student learning.
          </p>
          <div className="flex justify-center">
            <Link
              href="/upload-material"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-semibold shadow-md transition"
            >
              Upload material
            </Link>
          </div>
        </section>

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by title, subject, or uploader"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black"
            />
            <Search className="absolute right-3 top-2.5 text-indigo-600" size={20} />
          </div>
        </div>

        {/* Material List */}
        <h2 className="text-2xl font-bold text-indigo-800 mb-6 text-center">
          Available Study Materials
        </h2>
        {filteredMaterials.length === 0 ? (
          <p className="text-center text-gray-600">No study materials found.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {filteredMaterials.map((item, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-2xl shadow-lg border border-indigo-200 hover:shadow-xl transition"
              >
                <h3 className="text-lg font-semibold text-indigo-800 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">
                  <Notebook className="inline-block mr-2" size={17} />
                  {item.subject}
                </p>
                <p className="text-sm text-gray-500">
                  <User className="inline-block mr-2" size={18} />
                  {item.uploaded_by || 'unknown'}
                </p>
                <p className="text-xs text-gray-400">
                  <Clock className="inline-block mr-2" size={16} />
                  {item.uploaded_at}
                </p>
                <div className="mt-4 flex flex-wrap justify-between items-center gap-2">
                  <button
                    onClick={() =>
                      window.open(
                        `http://127.0.0.1:8000/api/materials/preview/${item.id}`,
                        '_blank'
                      )
                    }
                    className="flex items-center gap-1 text-indigo-600 hover:underline"
                  >
                    <BookOpen size={18} /> Read
                  </button>
                  <button
                    onClick={() => handleDownload(item.id, item.title)}
                    className="flex items-center gap-1 text-indigo-600 hover:underline"
                  >
                    <Download size={18} /> Download
                  </button>
                  {isLoggedIn && (
                    <SavedButton
                      materialId={item.id}
                      defaultSaved={item.is_saved}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* About Section */}
      <section
        id="about"
        className="bg-indigo-50 w-full px-4 py-10 mt-20 rounded-t-2xl shadow-inner"
      >
        <h2 className="text-2xl font-bold text-indigo-800 mb-4 text-center">
          About Us
        </h2>
        <p className="text-gray-700 max-w-3xl mx-auto text-center">
          Study Material Hub is a centralized platform where students and
          educators can share and access quality academic resources. Our goal is
          to simplify learning and support collaborative education by connecting
          knowledge contributors and seekers efficiently.
        </p>
      </section>
    </UploaderLayout>
  );
}
