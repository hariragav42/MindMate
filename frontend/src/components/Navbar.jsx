import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Leaf, Menu, X, LayoutDashboard, ClipboardCheck, BookOpen, Clock, User, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children, icon: Icon }) => (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
        ${isActive(to)
          ? 'text-secondary bg-accent'
          : 'text-body/70 hover:text-secondary hover:bg-accent/50'
        }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-secondary to-teal-400 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-glow transition-all duration-300">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary tracking-tight">MindMate</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
                <NavLink to="/assessment" icon={ClipboardCheck}>Assessment</NavLink>
                <NavLink to="/resources" icon={BookOpen}>Resources</NavLink>
                <NavLink to="/history" icon={Clock}>History</NavLink>
                <NavLink to="/profile" icon={User}>Profile</NavLink>
                {user.role === 'admin' && (
                  <NavLink to="/admin" icon={Shield}>Admin</NavLink>
                )}
                <div className="w-px h-6 bg-gray-200 mx-2" />
                <button onClick={handleLogout} className="btn-ghost text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">Login</Link>
                <Link to="/register" className="btn-primary">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-gray-100 animate-fade-in">
            <div className="flex flex-col gap-1">
              {user ? (
                <>
                  <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
                  <NavLink to="/assessment" icon={ClipboardCheck}>Assessment</NavLink>
                  <NavLink to="/resources" icon={BookOpen}>Resources</NavLink>
                  <NavLink to="/history" icon={Clock}>History</NavLink>
                  <NavLink to="/profile" icon={User}>Profile</NavLink>
                  {user.role === 'admin' && (
                    <NavLink to="/admin" icon={Shield}>Admin</NavLink>
                  )}
                  <button onClick={handleLogout} className="mt-2 btn-ghost text-rose-500 text-left">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login">Login</NavLink>
                  <NavLink to="/register">Register</NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
