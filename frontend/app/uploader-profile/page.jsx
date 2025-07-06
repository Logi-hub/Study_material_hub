'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UploaderLayout from '@/components/uploaderlayout';
import axios from 'axios';
import {
  User, Mail, Phone, Briefcase, School, MapPin,
  ShieldCheck, Pencil, CopyIcon, LogOut
} from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const [role, setRole] = useState(null);
  const router = useRouter();

  const handleBecomeUploader = () => {
    router.push('/authorized');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');
      const storedRole = localStorage.getItem('role');
      setRole(storedRole);
      if (!token) return;

      try {
        const res = await axios.get('http://127.0.0.1:8000/api/uploader-profile/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch {
        setMessage('❌ Failed to load profile');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (profile) {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('access_token');
    if (!token || !profile) return;

    try {
      await axios.put('http://127.0.0.1:8000/api/uploader-profile/', profile, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setMessage('✅ Profile updated successfully');
      setEditMode(false);
    } catch {
      setMessage('❌ Update failed');
    }
  };

  return (
    <UploaderLayout>
      <h1 className="text-2xl font-bold text-indigo-800 mb-4">Profile</h1>

      {message && <p className="text-sm text-red-600 mb-2">{message}</p>}

      {profile && (
        <div className="space-y-4 text-gray-800">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-lg text-indigo-700">Profile Info</p>
            {role === 'Uploader' && (
              <button
                onClick={() => setEditMode((prev) => !prev)}
                className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Pencil size={18} /> {editMode ? 'Cancel' : 'Edit'}
              </button>
            )}
          </div>

          <div className="space-y-3">
            
            <div className="flex items-center gap-2">
              <User className="text-gray-600" />
              <span className="font-semibold">Username:</span>
              {editMode ? (
                <input
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  className="p-1 border rounded text-black"
                />
              ) : (
                <span>{profile.username}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Mail className="text-gray-600" />
              <span className="font-semibold">Email:</span>
              <span>{profile.email}</span>
            </div>

            {role === 'Uploader' && (
              <>
                
                <div className="flex items-center gap-2">
                  <Phone className="text-gray-600" />
                  <span className="font-semibold">Phone:</span>
                  {editMode ? (
                    <input
                      name="phone"
                      value={profile.phone || ''}
                      onChange={handleChange}
                      className="p-1 border rounded text-black"
                    />
                  ) : (
                    <span>{profile.phone}</span>
                  )}
                </div>

               
                <div className="flex items-center gap-2">
                  <Briefcase className="text-gray-600" />
                  <span className="font-semibold">Designation:</span>
                  {editMode ? (
                    <input
                      name="designation"
                      value={profile.designation || ''}
                      onChange={handleChange}
                      className="p-1 border rounded text-black"
                    />
                  ) : (
                    <span>{profile.designation}</span>
                  )}
                </div>

                
                <div className="flex items-center gap-2">
                  <School className="text-gray-600" />
                  <span className="font-semibold">Institution:</span>
                  {editMode ? (
                    <input
                      name="institution"
                      value={profile.institution || ''}
                      onChange={handleChange}
                      className="p-1 border rounded text-black"
                    />
                  ) : (
                    <span>{profile.institution}</span>
                  )}
                </div>

                
                <div className="flex items-center gap-2">
                  <MapPin className="text-gray-600" />
                  <span className="font-semibold">Place:</span>
                  {editMode ? (
                    <input
                      name="place"
                      value={profile.place || ''}
                      onChange={handleChange}
                      className="p-1 border rounded text-black"
                    />
                  ) : (
                    <span>{profile.place}</span>
                  )}
                </div>
              </>
            )}

            
            {profile.upload_code && (
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-gray-600" />
                <span className="font-semibold">Verification Code:</span>
                <code className="bg-gray-100 p-1 rounded">{profile.upload_code}</code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(profile.upload_code);
                    setMessage('✅ Verification code copied!');
                  }}
                  className="text-xs bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600"
                >
                  <CopyIcon className="inline mr-1" size={18} />
                  Copy
                </button>
              </div>
            )}
          </div>

          {editMode && role === 'Uploader' && (
            <button
              onClick={handleUpdate}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mt-4"
            >
              Save Changes
            </button>
          )}

          {role === 'Reader' && (
            <button
              onClick={handleBecomeUploader}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Become an Uploader
            </button>
          )}

          
        </div>
      )}
    </UploaderLayout>
  );
}
