import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Brain, Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const getPasswordStrength = () => {
    let score = 0;
    if (password.length > 7) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^A-Za-z0-9]/)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (strengthScore < 2) {
      setError('Please use a stronger password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(email, password, fullName);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 relative overflow-y-auto custom-scroll bg-background">
      {/* Background decoration */}
      <div className="organic-blob blob-1"></div>
      <div className="organic-blob blob-2"></div>

      <div className="w-full max-w-md animate-fade-in relative z-10 my-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white border border-white/50 shadow-sm rounded-[32px] mb-8 hover:shadow-soft transition-all duration-300">
            <Brain className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold text-text tracking-tight">Create your account</h1>
          <p className="text-lg text-text/70 mt-3 font-medium">Start your mindful academic journey</p>
        </div>

        <div className="card-glass border border-white/50 shadow-sm p-10 bg-white/80">
          {error && (
            <div className="mb-8 p-5 bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-2xl flex items-start gap-4 animate-slide-up">
              <AlertCircle className="w-6 h-6 text-[#FF6B6B] flex-shrink-0 mt-0.5" />
              <p className="text-base text-text font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-bold text-text mb-3">Full Name</label>
              <div className="relative">
                <Brain className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text/40" />
                <input
                  id="fullName"
                  type="text"
                  required
                  className="input-field pl-12 py-4 bg-white/50"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

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
              <label className="block text-sm font-bold text-text mb-3">Password</label>
              <div className="relative mb-4">
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

              {/* Password Strength Meter */}
              {password && (
                <div className="animate-fade-in">
                  <div className="flex gap-2 h-2 mb-3">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-full flex-1 rounded-full transition-all duration-300 ${
                          strengthScore >= step
                            ? step === 1 ? 'bg-[#FF6B6B]' : step === 2 ? 'bg-[#D4A017]' : 'bg-[#91A84F]'
                            : 'bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex flex-col gap-2 mt-4">
                    <div className={`text-sm flex items-center gap-2 ${password.length > 7 ? 'text-[#91A84F] font-bold' : 'text-text/50'}`}>
                      <CheckCircle2 className="w-4 h-4" /> At least 8 characters
                    </div>
                    <div className={`text-sm flex items-center gap-2 ${password.match(/[A-Z]/) && password.match(/[0-9]/) ? 'text-[#91A84F] font-bold' : 'text-text/50'}`}>
                      <CheckCircle2 className="w-4 h-4" /> Contains number & uppercase
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="btn-primary mt-6 py-4 text-lg font-bold w-full disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-glow"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.3"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/></svg>
                  Creating account...
                </>
              ) : 'Sign Up'}
            </button>
          </form>
        </div>

        <p className="mt-10 text-center text-base text-text/70 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-black hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
