'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import UploaderLayout from '@/components/uploaderlayout';
import Link from 'next/link';
import { FolderOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MyUploadsPage() {
  const [materials, setMaterials] = useState([]);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setMessage('❌ Please login first');
      return;
    }

    axios
      .get('http://127.0.0.1:8000/api/materials/my-uploads/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMaterials(res.data))
      .catch(() => setMessage('❌ Failed to load uploads'));
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    if (!confirm('Are you sure you want to delete this material?')) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/materials/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMaterials((prev) => prev.filter((m) => m.id !== id));
    } catch {
      alert('❌ Failed to delete material');
    }
  };

  return (
    <UploaderLayout>
      <h1 className="text-2xl font-bold text-indigo-800 mb-4">
        <FolderOpen className="inline mr-2" /> My Uploads
      </h1>

      {message && <p className="text-red-600 mb-4">{message}</p>}

      {materials.length === 0 ? (
        <p className="text-gray-600">You have not uploaded any materials yet.</p>
      ) : (
        <ul className="space-y-4">
          {materials.map((material) => (
            <li
              key={material.id}
              className="bg-white p-4 shadow rounded-lg flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold text-indigo-700">
                  {material.title}
                </h2>
                <p className="text-sm text-gray-500">{material.subject}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push(`/preview/${material.id}`)}
                  className="text-blue-600 hover:underline"
                >
                  View |
                </button>
                <Link
                  href={`/materials_edit/${material.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Edit |
                </Link>
                <button
                  onClick={() => handleDelete(material.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </UploaderLayout>
  );
}
