import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Brain, Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    try {
      await googleLogin(credentialResponse.credential);
      navigate('/dashboard');
    } catch (err) {
      console.error("Google login failed", err);
      let errMsg = 'Google Sign-In failed. Please try again.';
      if (err.response) {
        errMsg = `Server error: ${err.response.status} - ${JSON.stringify(err.response.data)}`;
      } else if (err.request) {
        errMsg = `Network error: Could not reach server.`;
      } else {
        errMsg = `Error: ${err.message}`;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="flex-1 w-full overflow-y-auto custom-scroll bg-background relative">
      {/* Background decoration */}
      <div className="organic-blob blob-1 fixed"></div>
      <div className="organic-blob blob-2 fixed"></div>

      <div className="flex min-h-full flex-col items-center px-4 py-8">
        <div className="w-full max-w-md flex flex-col my-auto">
        {/* Back Button */}
        <div className="mb-4">
          <Link to="/" className="inline-flex items-center gap-2 text-text/60 hover:text-primary font-bold transition-colors bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm w-max">
            <ArrowLeft className="w-5 h-5" /> Back
          </Link>
        </div>

        <div className="animate-fade-in relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white border border-white/50 shadow-sm rounded-[24px] mb-4 hover:shadow-soft transition-all duration-300">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-text tracking-tight">Welcome back</h1>
          <p className="text-base text-text/70 mt-2 font-medium">Sign in to continue to MindMate</p>
        </div>

        {/* Card */}
        <div className="card-glass border border-white/50 shadow-sm p-6 sm:p-8 bg-white/80">
          {error && (
            <div className="mb-8 p-5 bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-2xl flex items-start gap-4 animate-slide-up">
              <AlertCircle className="w-6 h-6 text-[#FF6B6B] flex-shrink-0 mt-0.5" />
              <p className="text-base text-text font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-bold text-text mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text/40" />
                <input
                  id="email"
                  type="email"
                  required
                  className="input-field pl-11 py-3 bg-white/50"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-text">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text/40" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field pl-11 pr-11 py-3 bg-white/50"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl text-text/40 hover:text-primary transition-colors"
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
              className="btn-primary mt-4 py-3 text-lg font-bold w-full disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-glow"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.3"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/></svg>
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-text/60 font-bold">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  setError('Google Sign-In failed.');
                }}
                theme="outline"
                size="large"
                shape="pill"
                width="320"
              />
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-text/70 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-black hover:underline">Sign up</Link>
        </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
