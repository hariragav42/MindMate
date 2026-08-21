import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Brain, Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

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
      const errorMsg = err.response?.data?.detail || err.message || 'Registration failed. Please try again.';
      setError(errorMsg);
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
          <h1 className="text-3xl font-extrabold text-text tracking-tight">Create your account</h1>
          <p className="text-base text-text/70 mt-2 font-medium">Start your mindful academic journey</p>
        </div>

        <div className="card-glass border border-white/50 shadow-sm p-6 sm:p-8 bg-white/80">
          {error && (
            <div className="mb-8 p-5 bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-2xl flex items-start gap-4 animate-slide-up">
              <AlertCircle className="w-6 h-6 text-[#FF6B6B] flex-shrink-0 mt-0.5" />
              <p className="text-base text-text font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-bold text-text mb-2">Full Name</label>
              <div className="relative">
                <Brain className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text/40" />
                <input
                  id="fullName"
                  type="text"
                  required
                  className="input-field pl-11 py-3 bg-white/50"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

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
              <label className="block text-sm font-bold text-text mb-2">Password</label>
              <div className="relative mb-3">
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
              className="btn-primary mt-4 py-3 text-lg font-bold w-full disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-glow"
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

        <p className="mt-6 text-center text-sm text-text/70 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-black hover:underline">Sign in</Link>
        </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
