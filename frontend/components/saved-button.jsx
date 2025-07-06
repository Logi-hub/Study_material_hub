'use client';
import { useState, useEffect } from 'react';
import { Bookmark, BookmarkMinus } from 'lucide-react';

export default function SavedButton({ materialId, defaultSaved }) {
  const [isSaved, setIsSaved] = useState(defaultSaved);

  useEffect(() => {
    setIsSaved(defaultSaved);
  }, [defaultSaved]);

  const handleToggle = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('⚠️ Please login to save materials.');
      window.location.href = '/login';
      return;
    }
    try {
      const url = `http://127.0.0.1:8000/api/${isSaved ? 'unsave' : 'save'}-material/${materialId}/`;
      const method = isSaved ? 'DELETE' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Action failed');
      setIsSaved(!isSaved);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to update saved status.');
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-1 ${
        isSaved ? 'text-red-600' : 'text-green-600'
      } hover:underline text-sm `}
    >
      {isSaved ? <BookmarkMinus size={16} /> : <Bookmark size={16} />}
      {isSaved ? 'Unsave' : 'Save'}
    </button>
  );
}
