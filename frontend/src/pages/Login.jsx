import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Brain, Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="organic-blob blob-1"></div>
      <div className="organic-blob blob-2"></div>

      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white border border-white/50 shadow-sm rounded-[32px] mb-8 hover:shadow-soft transition-all duration-300">
            <Brain className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold text-text tracking-tight">Welcome back</h1>
          <p className="text-lg text-text/70 mt-3 font-medium">Sign in to continue to MindMate</p>
        </div>

        {/* Card */}
        <div className="card-glass border border-white/50 shadow-sm p-10 bg-white/80">
          {error && (
            <div className="mb-8 p-5 bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-2xl flex items-start gap-4 animate-slide-up">
              <AlertCircle className="w-6 h-6 text-[#FF6B6B] flex-shrink-0 mt-0.5" />
              <p className="text-base text-text font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-bold text-text mb-3">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text/40" />
                <input
                  id="email"
                  type="email"
                  required
                  className="input-field pl-12 py-4 bg-white/50"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-bold text-text">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text/40" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field pl-12 pr-12 py-4 bg-white/50"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl text-text/40 hover:text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary mt-6 py-4 text-lg font-bold w-full disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-glow"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.3"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/></svg>
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="mt-10 text-center text-base text-text/70 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-black hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
