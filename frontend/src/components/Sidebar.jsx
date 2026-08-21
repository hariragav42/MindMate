import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { API_BASE } from '../services/api';
import {
  Home,
  Smile,
  FileText,
  BarChart2,
  BookOpen,
  Award,
  Users,
  Compass,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { MindMateAvatar, ThumbsUpCharacter } from './Illustrations';

const getAvatarUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://localhost:')) {
    return `${API_BASE}${url.substring(url.indexOf('/uploads'))}`;
  }
  if (url.startsWith('/')) {
    return `${API_BASE}${url}`;
  }
  return url;
};

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: Home },
    { label: 'Mood Tracker', path: '/mood-booster', icon: Smile },
    { label: 'Reflection', path: '/assessment', icon: FileText },
    { label: 'Insights', path: '/history', icon: BarChart2 },
    { label: 'Journal', path: '/journal', icon: BookOpen },
    { label: 'Community', path: '/resources?tab=community', icon: Users },
    { label: 'Resources', path: '/resources', icon: Compass },
    { label: 'Settings', path: '/profile', icon: Settings },
  ];

  const displayName = user?.name || user?.email?.split('@')[0] || 'John Doe';

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#FFFFFF] rounded-[32px] shadow-soft p-5 w-64 border border-white/60">
      {/* Logo / Brand Header */}
      <Link to="/dashboard" className="flex items-center gap-3 px-2 py-2 mb-6 group flex-shrink-0">
        <div className="w-12 h-12 flex-shrink-0 rounded-2xl overflow-hidden shadow-sm">
          <MindMateAvatar className="w-full h-full" />
        </div>
        <div>
          <h1 className="font-extrabold text-xl text-[#1E1E1E] leading-tight tracking-tight">MindMate</h1>
          <p className="text-[11px] text-[#8E8E93] font-medium leading-tight mt-0.5">Your mental wellness<br/>companion</p>
        </div>
      </Link>

      {/* Navigation Items */}
      <nav className="space-y-1.5 flex-1 overflow-y-auto custom-scroll pr-2 pb-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[14px] font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-[#FF874B] text-white shadow-[0_8px_20px_rgba(255,135,75,0.35)]'
                    : 'text-[#5C5C5C] hover:text-[#1E1E1E] hover:bg-[#F8F7F4]'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-[#8E8E93]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

      {/* Motivational Card & Profile */}
      <div className="space-y-3 pt-4 border-t border-[#F0EFEB] flex-shrink-0">
        {/* Doing Great Card */}
        <div className="bg-[#EDE9FE] rounded-[24px] p-4 relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <h4 className="font-bold text-[13px] text-[#2E1065] leading-tight">You are doing great!</h4>
            <p className="text-[11px] text-[#6D28D9] font-medium mt-1 leading-snug max-w-[130px]">
              Keep going on your self-care journey.
            </p>
          </div>
          <div className="absolute right-1 -bottom-2 z-0 opacity-95 pointer-events-none">
            <ThumbsUpCharacter className="w-20 h-20" />
          </div>
        </div>

        {/* User Account / Profile Strip */}
        <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-[#F8F7F4] transition-colors">
          <Link to="/profile" className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-[#E5E5EA] bg-white flex items-center justify-center">
              {user?.profile?.profile_pic_url ? (
                <img src={getAvatarUrl(user.profile.profile_pic_url)} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <MindMateAvatar className="w-full h-full" />
              )}
            </div>
            <div className="min-w-0">
              <h5 className="font-bold text-[13px] text-[#1E1E1E] truncate">{displayName}</h5>
              <p className="text-[10px] text-[#8E8E93] font-medium">Pro Account</p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 text-[#8E8E93] hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-3 bg-white rounded-full shadow-soft text-[#1E1E1E]"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-40 backdrop-blur-sm animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop & Mobile Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      } p-3 lg:p-4 flex-shrink-0 h-screen`}>
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
