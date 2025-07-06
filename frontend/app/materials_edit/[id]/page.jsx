'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FilePen } from 'lucide-react';

export default function EditMaterial() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    subject: '',
    customSubject: '',
    file: null,
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/api/materials/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data;
        setForm({
          title: data.title || '',
          subject: data.subject || '',
          customSubject: '',
          file: null,
        });
      })
      .catch(() => setMessage('❌ Failed to fetch material'));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    setForm((prev) => ({
      ...prev,
      file: selectedFile,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const formData = new FormData();
    const finalSubject =
      form.subject === 'Others' && form.customSubject
        ? form.customSubject
        : form.subject;

    formData.append('title', form.title);
    formData.append('subject', finalSubject);
    if (form.file) {
      formData.append('file', form.file);
    }

    try {
      await axios.put(`http://127.0.0.1:8000/api/materials/${id}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('✅ Updated successfully!');
      setTimeout(() => router.push('/my_uploads'), 2000);
    } catch (error) {
      console.error(error);
      setMessage('❌ Update failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-indigo-700 text-center">
          <FilePen className="inline mr-2" /> Edit Material
        </h2>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-indigo-300 rounded-lg text-black"
        />

        <select
          name="subject"
          value={form.subject}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-indigo-300 rounded-lg text-black"
        >
          <option value="">--Select Subject--</option>
          <option value="Engineering">Engineering</option>
          <option value="NEET">NEET</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Biology">Biology</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Computer Science">Computer Science</option>
          <option value="General Knowledge">General Knowledge</option>
          <option value="Current Affairs">Current Affairs</option>
          <option value="Others">Others</option>
        </select>

        {form.subject === 'Others' && (
          <input
            type="text"
            name="customSubject"
            placeholder="Enter custom subject"
            value={form.customSubject}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-indigo-300 rounded-lg text-black"
          />
        )}

        <input
          type="file"
          name="file"
          accept=".pdf,.doc,.docx,.ppt"
          onChange={handleFileChange}
          className="w-full px-4 py-2 border border-indigo-300 rounded-lg text-black"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Save Changes
        </button>

        {message && (
          <p className="text-center text-sm text-red-600">{message}</p>
        )}
      </form>
    </div>
  );
}
