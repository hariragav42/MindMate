import React from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Activity,
  Sparkles,
  Shield,
  Clock,
  ArrowRight,
  Heart,
  Smile,
  Zap,
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';
import {
  MindMateAvatar,
  WellnessPeaceCharacter,
  ChatbotWavingCharacter,
  InsightBloomingFace,
  CornerLeaves
} from '../components/Illustrations';

const Landing = () => {
  const features = [
    {
      step: '01',
      title: 'AI-Powered Stress Check',
      desc: 'Our intelligent model analyzes 15 academic stress factors to give you an accurate, empathetic snapshot in under 2 minutes.',
      bg: 'bg-[#FFF8E7]',
      border: 'border-[#FFE8B3]',
      accent: 'text-[#FF874B]',
      icon: Brain,
    },
    {
      step: '02',
      title: 'Personalized Micro-Relief',
      desc: 'Get science-backed 2-10 minute breathing exercises, calming audio, and mindfulness tracks tailored to your schedule.',
      bg: 'bg-[#F5F3FF]',
      border: 'border-[#E0E7FF]',
      accent: 'text-[#8B5CF6]',
      icon: Activity,
    },
    {
      step: '03',
      title: '24/7 MindMate Companion',
      desc: 'Have a friendly AI wellness buddy ready to listen, offer mood boosters, or guide you through exam anxiety anytime.',
      bg: 'bg-[#ECFDF5]',
      border: 'border-[#A7F3D0]',
      accent: 'text-[#10B981]',
      icon: Sparkles,
    },
  ];

  const stats = [
    { value: '15', label: 'Research-backed Questions', sub: 'Quick & accurate', color: 'text-[#FF874B]' },
    { value: '< 2 min', label: 'Average Check-in Time', sub: 'Fits any study break', color: 'text-[#8B5CF6]' },
    { value: '100%', label: 'Confidential & Private', sub: 'Your safe space', color: 'text-[#10B981]' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden font-sans">
      
      {/* Decorative foliage background elements */}
      <div className="fixed bottom-0 left-0 pointer-events-none z-0">
        <CornerLeaves position="bottom-left" className="w-48 h-48 lg:w-64 lg:h-64" />
      </div>
      <div className="fixed bottom-0 right-0 pointer-events-none z-0">
        <CornerLeaves position="bottom-right" className="w-48 h-48 lg:w-64 lg:h-64" />
      </div>
      <div className="fixed -top-20 -right-20 w-96 h-96 bg-[#FF874B]/25 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed top-1/3 -left-20 w-80 h-80 bg-[#C98CEB]/20 rounded-full blur-3xl pointer-events-none z-0" />

      {/* ======================================================== */}
      {/* TOP FLOATING NAV BAR                                     */}
      {/* ======================================================== */}
      <header className="relative z-20 max-w-6xl mx-auto w-full px-6 pt-6">
        <div className="bg-white/90 backdrop-blur-md rounded-full px-6 py-3.5 flex items-center justify-between shadow-soft border border-white/60">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm">
              <MindMateAvatar className="w-full h-full" />
            </div>
            <span className="font-black text-2xl text-[#1E1E1E] tracking-tight">MindMate</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 text-sm font-bold text-[#1E1E1E] hover:text-[#FF874B] transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 bg-[#FF874B] text-white text-sm font-black rounded-full shadow-[0_4px_14px_rgba(255,135,75,0.35)] hover:bg-[#FF722B] transition-all hover:scale-105"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* HERO SECTION                                             */}
      {/* ======================================================== */}
      <section className="relative z-10 max-w-6xl mx-auto w-full px-6 pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs lg:text-sm font-bold text-[#FF874B] shadow-sm border border-white/60">
              <Sparkles className="w-4 h-4 text-[#FF874B]" />
              <span>Mindful Student Wellness Platform</span>
            </div>

            {/* Vibrant Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-black text-[#1E1E1E] leading-[1.08] tracking-tight">
              Breathe Easy.<br />
              <span className="text-[#FF874B] drop-shadow-sm">Master Your Stress,</span><br />
              One Day at a Time.
            </h1>

            <p className="text-base sm:text-lg lg:text-xl font-medium text-[#1E1E1E]/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              MindMate understands academic burnout, exam stress, and study pressure. We deliver gentle, personalized relaxation that fits seamlessly into your day.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-[#FF874B] text-white text-base lg:text-lg font-black rounded-full shadow-[0_10px_25px_rgba(255,135,75,0.4)] hover:bg-[#FF722B] transition-all hover:scale-105 flex items-center justify-center gap-3"
              >
                Sign Up <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-white/90 backdrop-blur-sm text-[#1E1E1E] text-base font-bold rounded-full shadow-sm border border-white/60 hover:bg-white transition-all text-center"
              >
                Login
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs font-bold text-[#1E1E1E]/70">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> No Credit Card Required
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#8B5CF6]" /> 100% Anonymous
              </div>
            </div>

          </div>

          {/* Hero Right Visual Showcase Card */}
          <div className="lg:col-span-5 flex justify-center relative">
            
            {/* Glowing Main Showcase Card */}
            <div className="bg-white rounded-[36px] p-6 lg:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-white/80 relative w-full max-w-md">
              
              {/* Floating Top Pill */}
              <div className="absolute -top-4 right-6 bg-[#EDE9FE] text-[#6D28D9] px-4 py-1.5 rounded-full text-xs font-extrabold shadow-sm flex items-center gap-1.5">
                <span>✨</span> Real-time AI Support
              </div>

              {/* Character Illustration Banner */}
              <div className="flex flex-col items-center text-center my-4">
                <div className="relative">
                  <div className="w-44 h-44 rounded-full bg-[#FFF7ED] flex items-center justify-center shadow-inner">
                    <WellnessPeaceCharacter className="w-36 h-36" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-[#10B981] text-white p-2 rounded-full shadow-md">
                    <Heart className="w-4 h-4 fill-current" />
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <h3 className="text-2xl font-black text-[#1E1E1E]">Find Your Balance</h3>
                  <p className="text-xs font-semibold text-[#10B981]">Feeling Balanced & Calm 🌿</p>
                </div>
              </div>

              {/* Mini Interactive Preview Chat Bubble */}
              <div className="bg-[#FAF9F6] rounded-2xl p-3.5 border border-[#F0EFEB] space-y-2 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                    <MindMateAvatar className="w-full h-full" />
                  </div>
                  <span className="text-xs font-bold text-[#1E1E1E]">MindMate AI</span>
                </div>
                <p className="text-xs text-[#5C5C5C] font-medium leading-snug">
                  "Take a gentle breath before your study session. You've got this!"
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* STATS STRIP SECTION                                      */}
      {/* ======================================================== */}
      <section className="relative z-10 max-w-6xl mx-auto w-full px-6 mb-16">
        <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 lg:p-8 shadow-soft border border-white/60 grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center space-y-1 p-3">
              <div className={`text-4xl lg:text-5xl font-black ${stat.color} tracking-tight`}>
                {stat.value}
              </div>
              <h4 className="font-extrabold text-sm text-[#1E1E1E]">{stat.label}</h4>
              <p className="text-xs text-[#8E8E93] font-medium">{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* HOW IT HELPS YOU (3 CARDS)                               */}
      {/* ======================================================== */}
      <section className="relative z-10 max-w-6xl mx-auto w-full px-6 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-3xl lg:text-4xl font-black text-[#1E1E1E] tracking-tight">
            How MindMate Helps You
          </h2>
          <p className="text-sm lg:text-base text-[#1E1E1E]/80 font-medium">
            Simple, science-backed steps to take gentle control of student stress
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className={`${f.bg} rounded-[32px] p-8 border ${f.border} shadow-soft flex flex-col justify-between hover:scale-[1.02] transition-all duration-300`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                      <Icon className={`w-7 h-7 ${f.accent}`} />
                    </div>
                    <span className="text-2xl font-black text-[#1E1E1E]/20">{f.step}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-[#1E1E1E] mb-3">{f.title}</h3>
                  <p className="text-sm text-[#5C5C5C] leading-relaxed font-medium">{f.desc}</p>
                </div>

                <div className="mt-8 pt-4 border-t border-black/5 flex items-center justify-between">
                  <span className={`text-xs font-bold ${f.accent}`}>Explore feature</span>
                  <ChevronRight className={`w-4 h-4 ${f.accent}`} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* MOTIVATIONAL BANNER                                      */}
      {/* ======================================================== */}
      <section className="relative z-10 max-w-6xl mx-auto w-full px-6 mb-20">
        <div className="bg-[#EDE9FE] rounded-[36px] p-8 lg:p-12 border border-[#DDD6FE] shadow-soft flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <span className="px-3.5 py-1 bg-[#8B5CF6] text-white rounded-full text-xs font-black uppercase tracking-wider">
              Student Wellness First
            </span>
            <h3 className="text-3xl lg:text-4xl font-black text-[#2E1065] tracking-tight leading-tight">
              You are stronger than your academic fear.
            </h3>
            <p className="text-sm lg:text-base text-[#5B21B6] font-medium max-w-lg">
              Take one small step today. Check in with how you feel and let MindMate guide your way.
            </p>
          </div>
          <div className="flex-shrink-0">
            <InsightBloomingFace className="w-32 h-32 lg:w-40 lg:h-40" />
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* FINAL CALL TO ACTION (CTA)                               */}
      {/* ======================================================== */}
      <section className="relative z-10 max-w-4xl mx-auto w-full px-6 pb-20 text-center">
        <div className="bg-[#FFFFFF] rounded-[40px] p-10 lg:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/80 space-y-6">
          <div className="w-16 h-16 rounded-full overflow-hidden mx-auto shadow-md">
            <MindMateAvatar className="w-full h-full" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[#1E1E1E] tracking-tight">
            Ready to Start Your Mindful Journey?
          </h2>
          
          <p className="text-base sm:text-lg text-[#5C5C5C] font-medium max-w-xl mx-auto">
            Join students who use MindMate to take charge of their mental health and balance their studies.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="w-full sm:w-auto px-10 py-4 bg-[#FF874B] text-white text-base lg:text-lg font-black rounded-full shadow-[0_10px_25px_rgba(255,135,75,0.4)] hover:bg-[#FF722B] transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              Sign Up <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* FOOTER                                                   */}
      {/* ======================================================== */}
      <footer className="relative z-10 bg-[#FFFFFF]/90 backdrop-blur-md border-t border-white/60 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <MindMateAvatar className="w-full h-full" />
            </div>
            <span className="font-extrabold text-lg text-[#1E1E1E]">MindMate</span>
          </div>
          <p className="text-xs text-[#8E8E93] text-center font-medium">
            MindMate is a mindful wellness support tool and does not provide clinical diagnosis. Seek professional care if in crisis.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
