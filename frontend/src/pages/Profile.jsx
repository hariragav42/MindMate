import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import {
  User,
  Save,
  CheckCircle2,
  Loader2,
  Mail,
  BookOpen,
  Clock,
  Heart,
  Camera,
  Type,
  Shield,
  Smile,
  Sparkles,
  Sliders,
  Bell
} from 'lucide-react';
import { MindMateAvatar } from '../components/Illustrations';

const Profile = () => {
  const { user, refreshUser } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    full_name: '',
    profile_pic_url: '',
    study_year: '',
    study_hours: '',
    available_time: '',
    support_preference: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    api.get('/api/profile')
      .then((res) => {
        setProfile({
          full_name: res.data.full_name || '',
          profile_pic_url: res.data.profile_pic_url || '',
          study_year: res.data.study_year || '',
          study_hours: res.data.study_hours || '',
          available_time: res.data.available_time || '',
          support_preference: res.data.support_preference || '',
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      await api.put('/api/profile', profile);
      // Immediately refresh user state so the new name reflects everywhere across the app
      if (refreshUser) {
        await refreshUser();
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      console.error('Failed to save profile', err);
      setError('Could not save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/api/profile/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setProfile((prev) => ({ ...prev, profile_pic_url: response.data.url }));
      
      // Auto-save the profile after upload
      await api.put('/api/profile', { ...profile, profile_pic_url: response.data.url });
      if (refreshUser) {
        await refreshUser();
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      console.error('Failed to upload image', err);
      setError(err.response?.data?.detail || 'Could not upload image. Maximum size is 5MB.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const displayName = profile.full_name || user?.name || user?.email?.split('@')[0] || 'Friend';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] relative z-10">
        <div className="w-12 h-12 border-4 border-white/40 border-t-[#FF874B] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto w-full space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-soft border border-white/60 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#F8F7F4] shadow-md flex-shrink-0 bg-[#FFF8E7]">
            {profile.profile_pic_url ? (
              <img src={profile.profile_pic_url} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <MindMateAvatar className="w-full h-full" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl lg:text-3xl font-extrabold text-[#1E1E1E]">{displayName}</h1>
              <span className="px-3 py-1 bg-[#FF874B]/10 text-[#FF874B] text-xs font-bold rounded-full">
                {user?.role === 'admin' ? 'Admin' : 'Pro Account'}
              </span>
            </div>
            <p className="text-xs lg:text-sm text-[#8E8E93] font-medium mt-1">
              {user?.email || 'student@university.edu'}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-[#F8F7F4] p-1.5 rounded-full border border-[#E5E5EA]">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'general'
                ? 'bg-[#FF874B] text-white shadow-sm'
                : 'text-[#5C5C5C] hover:text-[#1E1E1E]'
            }`}
          >
            General Profile
          </button>
          <button
            onClick={() => setActiveTab('academic')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'academic'
                ? 'bg-[#FF874B] text-white shadow-sm'
                : 'text-[#5C5C5C] hover:text-[#1E1E1E]'
            }`}
          >
            Wellness & Study
          </button>
        </div>
      </div>

      {/* Main Settings Form Card */}
      <form onSubmit={handleSave} className="bg-white rounded-[36px] p-6 lg:p-10 shadow-soft border border-white/60 space-y-8">
        
        {activeTab === 'general' ? (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-extrabold text-[#1E1E1E]">Personal Information</h2>
              <p className="text-xs text-[#8E8E93] font-medium mt-1">
                Customize how MindMate greets you and personalize your profile details.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full / Display Name */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-[#1E1E1E] mb-2.5">
                  <Type className="w-4 h-4 text-[#FF874B]" /> Full Name / Nickname
                </label>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  placeholder="e.g. Senthil Kumar"
                  className="w-full px-5 py-3.5 bg-[#F8F7F4] rounded-2xl text-sm font-medium text-[#1E1E1E] border border-transparent focus:border-[#FF874B] focus:bg-white focus:outline-none transition-all"
                />
                <span className="text-[11px] text-[#8E8E93] mt-1 block">
                  This is the name MindMate will use to greet you across the app!
                </span>
              </div>

              {/* Profile Picture Upload */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-[#1E1E1E] mb-2.5">
                  <Camera className="w-4 h-4 text-[#FF874B]" /> Profile Picture
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={profile.profile_pic_url}
                    onChange={(e) => setProfile({ ...profile, profile_pic_url: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                    className="flex-1 px-5 py-3.5 bg-[#F8F7F4] rounded-2xl text-sm font-medium text-[#1E1E1E] border border-transparent focus:border-[#FF874B] focus:bg-white focus:outline-none transition-all"
                  />
                  <div className="relative flex-shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isUploadingImage}
                    />
                    <button
                      type="button"
                      disabled={isUploadingImage}
                      className="h-full px-5 bg-[#FF874B] text-white font-bold text-sm rounded-2xl shadow-sm hover:bg-[#FF722A] hover:shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                      {isUploadingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                        </>
                      ) : (
                        <>
                          Upload File
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <span className="text-[11px] text-[#8E8E93] mt-1 block">
                  Upload an image or paste a URL. Max size 5MB.
                </span>
              </div>

              {/* Email Address (Read-only) */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-[#1E1E1E] mb-2.5">
                  <Mail className="w-4 h-4 text-[#8FA564]" /> Email Address
                </label>
                <div className="w-full px-5 py-3.5 bg-[#F8F7F4] rounded-2xl text-sm font-medium text-[#8E8E93] border border-[#E5E5EA] flex items-center justify-between">
                  <span>{user?.email || 'N/A'}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#E5E5EA] px-2 py-0.5 rounded text-[#5C5C5C]">
                    Verified
                  </span>
                </div>
              </div>

              {/* Account Role */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-[#1E1E1E] mb-2.5">
                  <Shield className="w-4 h-4 text-[#8B5CF6]" /> Account Type
                </label>
                <div className="w-full px-5 py-3.5 bg-[#F8F7F4] rounded-2xl text-sm font-medium text-[#8E8E93] border border-[#E5E5EA] capitalize">
                  {user?.role || 'student'} account
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-extrabold text-[#1E1E1E]">Wellness & Study Preferences</h2>
              <p className="text-xs text-[#8E8E93] font-medium mt-1">
                Help our recommendation engine tune content to your schedule and study habits.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Year of Study */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-[#1E1E1E] mb-2.5">
                  <BookOpen className="w-4 h-4 text-[#FF874B]" /> Year of Study
                </label>
                <select
                  value={profile.study_year}
                  onChange={(e) => setProfile({ ...profile, study_year: e.target.value })}
                  className="w-full px-5 py-3.5 bg-[#F8F7F4] rounded-2xl text-sm font-medium text-[#1E1E1E] border border-transparent focus:border-[#FF874B] focus:bg-white focus:outline-none transition-all cursor-pointer"
                >
                  <option value="">Select your study year</option>
                  <option value="1st Year">1st Year / Freshman</option>
                  <option value="2nd Year">2nd Year / Sophomore</option>
                  <option value="3rd Year">3rd Year / Junior</option>
                  <option value="4th Year">4th Year / Senior</option>
                  <option value="Postgraduate">Postgraduate / Masters / PhD</option>
                </select>
              </div>

              {/* Study Hours */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-[#1E1E1E] mb-2.5">
                  <Clock className="w-4 h-4 text-[#FF874B]" /> Daily Study Hours
                </label>
                <select
                  value={profile.study_hours}
                  onChange={(e) => setProfile({ ...profile, study_hours: e.target.value })}
                  className="w-full px-5 py-3.5 bg-[#F8F7F4] rounded-2xl text-sm font-medium text-[#1E1E1E] border border-transparent focus:border-[#FF874B] focus:bg-white focus:outline-none transition-all cursor-pointer"
                >
                  <option value="">Select daily study hours</option>
                  <option value="Less than 2 hours">Less than 2 hours</option>
                  <option value="2–4 hours">2–4 hours</option>
                  <option value="4–6 hours">4–6 hours</option>
                  <option value="More than 6 hours">More than 6 hours</option>
                </select>
              </div>

              {/* Relaxation Time */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-[#1E1E1E] mb-2.5">
                  <Sparkles className="w-4 h-4 text-[#8B5CF6]" /> Available Break / Relaxation Time
                </label>
                <select
                  value={profile.available_time}
                  onChange={(e) => setProfile({ ...profile, available_time: e.target.value })}
                  className="w-full px-5 py-3.5 bg-[#F8F7F4] rounded-2xl text-sm font-medium text-[#1E1E1E] border border-transparent focus:border-[#8B5CF6] focus:bg-white focus:outline-none transition-all cursor-pointer"
                >
                  <option value="">Select available break time</option>
                  <option value="2–5 min">2–5 minutes (Quick recharge)</option>
                  <option value="5–10 min">5–10 minutes (Short exercise)</option>
                  <option value="10–20 min">10–20 minutes (Standard meditation)</option>
                  <option value="20–30 min">20–30 minutes (Deep relaxation)</option>
                  <option value="More than 30 min">More than 30 minutes</option>
                </select>
              </div>

              {/* Support Preference */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-[#1E1E1E] mb-2.5">
                  <Heart className="w-4 h-4 text-[#F43F5E]" /> Preferred Wellness Activity
                </label>
                <select
                  value={profile.support_preference}
                  onChange={(e) => setProfile({ ...profile, support_preference: e.target.value })}
                  className="w-full px-5 py-3.5 bg-[#F8F7F4] rounded-2xl text-sm font-medium text-[#1E1E1E] border border-transparent focus:border-[#F43F5E] focus:bg-white focus:outline-none transition-all cursor-pointer"
                >
                  <option value="">Select preferred activity</option>
                  <option value="Meditation/Mindfulness">Meditation & Mindfulness</option>
                  <option value="Breathing Exercises">Guided Breathing Exercises</option>
                  <option value="Music/Audio">Calming Music & Ambient Audio</option>
                  <option value="Physical Exercise">Light Physical Stretches</option>
                  <option value="Reading/Articles">Short Stress Relief Articles</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Action Button & Status Bar */}
        <div className="pt-6 border-t border-[#F0EFEB] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-[#FF874B] text-white font-extrabold text-sm rounded-full shadow-[0_6px_20px_rgba(255,135,75,0.35)] hover:bg-[#FF722B] transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Profile Settings
                </>
              )}
            </button>

            {saved && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#10B981] bg-[#ECFDF5] px-3.5 py-2 rounded-full border border-[#A7F3D0] animate-fade-in">
                <CheckCircle2 className="w-4 h-4" /> Changes saved successfully!
              </span>
            )}

            {error && (
              <span className="text-xs font-bold text-[#EF4444] bg-[#FEF2F2] px-3.5 py-2 rounded-full border border-[#FECACA]">
                {error}
              </span>
            )}
          </div>

          <span className="text-[11px] text-[#8E8E93] font-medium">
            Changes update live across your MindMate companion and dashboard.
          </span>
        </div>

      </form>

    </div>
  );
};

export default Profile;
