'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Eye } from 'lucide-react';

export default function PreviewMaterial() {
  const params = useParams();
  const id = params?.id;
  const [fileUrl, setFileUrl] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    fetch(`http://127.0.0.1:8000/api/materials/preview/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        setFileUrl(url);
      });
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-xl font-bold mb-4">
        <Eye className="inline mr-2" /> Material Preview
      </h1>

      {fileUrl ? (
        <iframe
          src={fileUrl}
          className="w-full max-w-4xl h-[80vh] border rounded shadow"
          title="Material Preview"
        ></iframe>
      ) : (
        <p className="text-gray-500">Loading file...</p>
      )}
    </div>
  );
}
