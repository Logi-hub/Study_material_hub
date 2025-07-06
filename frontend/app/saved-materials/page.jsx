'use client';

import { useEffect, useState } from 'react';
import {
  BookOpen,
  Download,
  FolderMinus,
  Notebook,
  Clock,
  User,
  FileText
} from 'lucide-react';
import UploaderLayout from '@/components/uploaderlayout';

export default function SavedMaterialsPage() {
  const [savedMaterials, setSavedMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  useEffect(() => {
    if (!token) {
      alert('Please login to view saved materials');
      window.location.href = '/login';
      return;
    }

    fetch('http://127.0.0.1:8000/api/saved-materials/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (res) => {
        if (res.status === 401) {
          alert('⛔ Session expired. Please login again.');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return;
        }
        if (!res.ok) {
          setErrorMsg('⚠️ Failed to load saved materials.');
          return;
        }
        const data = await res.json();
        setSavedMaterials(data);
      })
      .catch((err) => {
        console.error('❌ Error fetching saved materials:', err);
        setErrorMsg('❌ Something went wrong.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUnsave = async (materialId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/unsave-material/${materialId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        setSavedMaterials((prev) => prev.filter((item) => item.material.id !== materialId));
      } else if (res.status === 401) {
        alert('⛔ Session expired. Please login again.');
        window.location.href = '/login';
      } else {
        alert('Unsave failed');
      }
    } catch (err) {
      console.error('❌ Error unsaving:', err);
      alert('❌ Error unsaving material');
    }
  };

  const handleDownload = async (materialId, title) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/materials/download/${materialId}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 401) {
        alert('⛔ Session expired. Please login again.');
        window.location.href = '/login';
        return;
      }

      if (!res.ok) throw new Error('Download failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      alert('❌ Download failed');
    }
  };

  return (
    <UploaderLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-indigo-800 mb-6">
          <FileText className="inline mr-2" /> Saved Materials
        </h1>

        {loading ? (
          <p className='text-black'>Loading saved materials...</p>
        ) : errorMsg ? (
          <p className="text-red-600">{errorMsg}</p>
        ) : savedMaterials.length === 0 ? (
          <p className="text-gray-600">No saved materials yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {savedMaterials.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md p-4 border border-indigo-200"
              >
                <h2 className="text-xl font-semibold text-indigo-700 mb-1">
                  {item.material.title}
                </h2>
                <p className="text-sm text-gray-600">
                  <Notebook className="inline-block mr-1" size={16} />
                  {item.material.subject}
                </p>
                <p className="text-sm text-gray-500">
                  <User className="inline-block mr-1" size={16} />
                  {item.material.uploaded_by}
                </p>
                <p className="text-xs text-gray-400 mb-3">
                  <Clock className="inline-block mr-1" size={14} />
                  {item.material.uploaded_at}
                </p>
                <div className="flex flex-wrap gap-3 mt-3">
                  <a
                    href={`http://127.0.0.1:8000/api/materials/preview/${item.material.id}/`}
                    target="_blank"
                    className="text-indigo-600 hover:underline flex items-center gap-1"
                    rel="noopener noreferrer"
                  >
                    <BookOpen size={16} /> Read
                  </a>
                  <button
                    onClick={() => handleDownload(item.material.id, item.material.title)}
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Download size={16} /> Download
                  </button>
                  <button
                    onClick={() => handleUnsave(item.material.id)}
                    className="text-red-600 hover:underline flex items-center gap-1"
                  >
                    <FolderMinus size={16} /> Unsave
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </UploaderLayout>
  );
}
