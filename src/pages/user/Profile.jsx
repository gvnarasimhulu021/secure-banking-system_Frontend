import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserSidebar from '../../components/UserSidebar.jsx';
import Topbar from '../../components/Topbar.jsx';
import { userService } from '../../services/userService.js';
import { useAuth } from '../../context/AuthContext.jsx';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await userService.getProfile();
      setProfile(data);
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        address: data.address || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await userService.updateProfile(formData);
      setProfile({ ...profile, ...formData });
      setSuccess('Profile updated successfully');
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      phone: profile?.phone || '',
      address: profile?.address || ''
    });
    setEditMode(false);
    setError('');
    setSuccess('');
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
  };

  if (!profile) {
    return (
      <div className="flex h-screen">
        <UserSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <UserSidebar />
      <div className="flex-1 bg-gray-50 overflow-auto">
        <Topbar title="Profile" />
        
        <div className="p-6 flex items-center justify-center">
          <div className="w-full max-w-[600px] bg-white rounded-card p-6">
            {/* User Avatar */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-light-green-bg rounded-full flex items-center justify-center">
                <span className="text-[20px] font-medium text-primary">{getInitials(profile.name)}</span>
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-light-green-bg border-[0.5px] border-medium-green text-primary rounded-small text-[13px]">
                {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-light-red-bg border-[0.5px] border-danger text-danger rounded-small text-[13px]">
                {error}
              </div>
            )}

            {!editMode ? (
              // View Mode
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <h3 className="text-[16px] font-medium text-gray-900">Personal Information</h3>
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 bg-medium-green text-white text-[13px] font-medium rounded-small hover:bg-primary transition-colors"
                  >
                    Edit profile
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between py-3 border-b border-gray-50">
                    <span className="text-[13px] text-gray-500 w-24">Full Name</span>
                    <span className="text-[13px] text-gray-900 font-medium">{profile.name || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-50">
                    <span className="text-[13px] text-gray-500 w-24">Email</span>
                    <span className="text-[13px] text-gray-900 font-medium">{profile.email || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-50">
                    <span className="text-[13px] text-gray-500 w-24">Phone</span>
                    <span className="text-[13px] text-gray-900 font-medium">{profile.phone || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-[13px] text-gray-500 w-24">Address</span>
                    <span className="text-[13px] text-gray-900 font-medium text-right">{profile.address || 'Not set'}</span>
                  </div>
                </div>
              </div>
            ) : (
              // Edit Mode
              <div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <h3 className="text-[16px] font-medium text-gray-900">Edit Profile</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-[13px] text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full h-10 px-3 text-[14px] border-[0.5px] border-gray-200 rounded-small focus:outline-none focus:border-medium-green"
                    />
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-[13px] text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={profile.email || ''}
                      disabled
                      className="w-full h-10 px-3 text-[14px] bg-gray-50 border-[0.5px] border-gray-200 rounded-small text-gray-500"
                    />
                    <div className="text-[11px] text-gray-500 mt-1">Email cannot be changed</div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[13px] text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="w-full h-10 px-3 text-[14px] border-[0.5px] border-gray-200 rounded-small focus:outline-none focus:border-medium-green"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-[13px] text-gray-700 mb-1">Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your address"
                      rows={3}
                      className="w-full px-3 text-[14px] border-[0.5px] border-gray-200 rounded-small focus:outline-none focus:border-medium-green resize-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 h-10 bg-medium-green text-white font-medium rounded-small hover:bg-primary transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save changes'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 h-10 bg-gray-200 text-gray-700 font-medium rounded-small hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
