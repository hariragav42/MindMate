import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Search,
  Bell,
  ChevronDown,
  ArrowRight,
  Heart,
  BookOpen,
  Wind,
  Users,
  Smile,
  Send,
  Sparkles,
  ChevronRight,
  Minus,
  Maximize2,
  MessageCircle,
  Filter
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  MindMateAvatar,
  WellnessPeaceCharacter,
  ChatbotWavingCharacter,
  InsightBloomingFace,
  MoodCalm,
  MoodEnergetic,
  MoodAnxious,
  MoodSad
} from '../components/Illustrations';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMoodFilter, setActiveMoodFilter] = useState('This Week');
  const [isChatbotMinimized, setIsChatbotMinimized] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [chatMessages, setChatMessages] = useState([
    { from: 'bot', text: "How can I help you?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const histRes = await api.get('/api/assessments/history');
        setHistory(histRes.data || []);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const latestResult = history.length > 0 ? history[0] : null;

  // Use actual calculated wellness % from backend if available, fallback to hardcoded if old data
  const getWellnessScore = (result) => {
    if (result && result.score_percentage !== undefined) {
      return result.score_percentage;
    }
    const level = result?.level;
    if (level === 'Low') return 88;
    if (level === 'Moderate') return 72;
    if (level === 'High') return 45;
    return 72;
  };

  const wellnessScore = getWellnessScore(latestResult);

  // Real or dynamic User display name
  const displayName = user?.name || user?.full_name || (user?.email ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1) : 'Friend');

  // Compute Mood Overview chart data from real assessment mood_aspects
  const aspectColors = {
    'Calmness': '#A78BFA',
    'Emotional': '#F472B6',
    'Sleep': '#86EFAC',
    'Energy': '#FF874B',
    'Focus': '#60A5FA',
  };

  const computeChartData = () => {
    if (!history || history.length === 0 || !history[0]?.mood_aspects) {
      // Default placeholder when no assessments exist
      return [
        { name: 'Calmness', value: 20, color: '#A78BFA' },
        { name: 'Emotional', value: 20, color: '#F472B6' },
        { name: 'Sleep', value: 20, color: '#86EFAC' },
        { name: 'Energy', value: 20, color: '#FF874B' },
        { name: 'Focus', value: 20, color: '#60A5FA' },
      ];
    }
    // Use the latest assessment's mood_aspects
    const aspects = history[0].mood_aspects;
    const total = Object.values(aspects).reduce((sum, val) => sum + val, 0) || 1;
    return Object.entries(aspects).map(([name, score]) => ({
      name,
      value: Math.round((score / total) * 100),
      color: aspectColors[name] || '#8E8E93',
    }));
  };

  const chartData = computeChartData();

  const processChatMessage = async (text) => {
    const userMsg = { from: 'user', text: text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    
    // Create new array with user message so we can use it immediately for the API call
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setIsTyping(true);

    try {
      const historyData = newMessages.slice(0, -1).map(m => ({
        role: m.from,
        parts: [m.text]
      }));

      const res = await api.post('/api/chat', {
        history: historyData,
        message: text
      });

      const botMsg = {
        from: 'bot',
        text: res.data.response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatMessages(prevMsgs => [...prevMsgs, botMsg]);
      setIsTyping(false);
      
      if (res.data.action && res.data.action.type === 'navigate' && res.data.action.target) {
        setTimeout(() => navigate(res.data.action.target), 1500);
      }
    } catch (error) {
      console.error("Chat API error:", error);
      setChatMessages(prevMsgs => [...prevMsgs, { from: 'bot', text: "I'm having trouble connecting to my AI brain right now. 🌿", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setIsTyping(false);
    }
  };

  const handleSendChat = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;
    const text = chatInput.trim();
    setChatInput('');
    await processChatMessage(text);
  };

  const handleQuickAction = async (text) => {
    await processChatMessage(text);
  };

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-6 p-3 sm:p-5 lg:p-6 w-full max-w-[1700px] mx-auto min-w-0 transition-all duration-300">
      
      {/* ======================================================== */}
      {/* MAIN CENTER DASHBOARD CONTAINER (Expands when minimized)   */}
      {/* ======================================================== */}
      <div className={`flex-1 bg-[#FFFFFF] rounded-[36px] p-6 lg:p-8 shadow-soft border border-white/60 space-y-8 min-w-0 transition-all duration-300 ${
        isChatbotMinimized ? 'w-full' : ''
      }`}>
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-[#1E1E1E] tracking-tight flex items-center gap-2">
              Greetings, {displayName}! <span className="text-3xl">👋</span>
            </h1>
            <p className="text-[#8E8E93] text-sm lg:text-base font-medium mt-1">
              How are you feeling today?
            </p>
          </div>

          {/* Notifications, Profile, and Chat Toggle if Minimized */}
          <div className="flex items-center gap-3">
            {/* Minimized Chatbot Toggle Button in Header */}
            {isChatbotMinimized && (
              <button
                onClick={() => setIsChatbotMinimized(false)}
                className="flex items-center gap-2 px-4 py-2 bg-[#8FA564] text-white text-xs font-bold rounded-full shadow-sm hover:bg-[#7D9354] transition-all hover:scale-105"
                title="Open Companion"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Open MindMate</span>
              </button>
            )}

            <Link to="/profile" className="flex items-center gap-2 pl-1 pr-2.5 py-1 bg-[#F8F7F4] rounded-full hover:bg-[#EFEFEA] transition-colors">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-white flex items-center justify-center">
                {user?.profile?.profile_pic_url ? (
                  <img src={user.profile.profile_pic_url.startsWith('http') ? user.profile.profile_pic_url : `http://localhost:8011${user.profile.profile_pic_url}`} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <MindMateAvatar className="w-full h-full" />
                )}
              </div>
              <span className="text-xs font-bold text-[#1E1E1E] hidden sm:inline">{displayName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8E8E93]" />
            </Link>
          </div>
        </div>

        {/* ROW 1: Hero Cards (Mental Wellness & Mood Overview) */}
        <div className={`grid grid-cols-1 ${isChatbotMinimized ? 'lg:grid-cols-12 xl:grid-cols-12' : 'lg:grid-cols-12'} gap-6`}>
          
          {/* Card 1: Your Mental Wellness (72%) */}
          <div className={`${isChatbotMinimized ? 'lg:col-span-7' : 'lg:col-span-7'} bg-[#FFFBF7] rounded-[32px] p-6 lg:p-8 border border-[#FFE8D6]/60 flex flex-col sm:flex-row items-center justify-between relative overflow-hidden shadow-sm group`}>
            <div className="space-y-4 z-10 text-center sm:text-left">
              <span className="text-xs lg:text-sm font-bold text-[#5C5C5C] tracking-wide">
                Your Mental Wellness
              </span>
              <div className="text-6xl lg:text-7xl font-black text-[#1E1E1E] tracking-tight">
                {wellnessScore}%
              </div>
              <p className="text-xs lg:text-sm font-medium text-[#5C5C5C] max-w-[220px]">
                You're doing better than yesterday! 🎉
              </p>
              <div>
                <Link
                  to="/assessment"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF874B] text-white text-xs lg:text-sm font-bold rounded-full shadow-[0_6px_16px_rgba(255,135,75,0.35)] hover:bg-[#FF722B] transition-all hover:scale-105"
                >
                  View Full Report <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Illustration with Circular Glowing Ring */}
            <div className="relative mt-6 sm:mt-0 flex-shrink-0 flex items-center justify-center">
              <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-full border-[10px] border-[#FFE2CF] border-t-[#FF874B] border-r-[#FF874B] flex items-center justify-center transform -rotate-45 relative">
                <div className="w-4 h-4 bg-[#FF874B] rounded-full absolute top-1 right-5 shadow-sm" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <WellnessPeaceCharacter className="w-40 h-40 lg:w-44 lg:h-44" />
              </div>
            </div>
          </div>

          {/* Card 2: Mood Overview (Donut Chart) */}
          <div className={`${isChatbotMinimized ? 'lg:col-span-5' : 'lg:col-span-5'} bg-[#FFFFFF] rounded-[32px] p-6 border border-[#F0EFEB] flex flex-col justify-between shadow-sm`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-base text-[#1E1E1E]">Mood Overview</h3>
            </div>

            {/* Donut Chart with smiling face */}
            <div className="flex items-center justify-center gap-6 py-2">
              <div className="w-36 h-36 relative flex items-center justify-center flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Smiling center avatar */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-9 h-9 rounded-full bg-[#FF874B] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    😊
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2 text-xs font-semibold">
                {chartData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[#5C5C5C]">{item.name}</span>
                    </div>
                    <span className="text-[#1E1E1E] font-bold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Insight Pill Banner */}
            <div className="bg-[#EDE9FE] rounded-2xl p-3 flex items-center gap-2.5 text-xs text-[#5B21B6] font-medium mt-2">
              <span className="text-base flex-shrink-0">✏️</span>
              <p className="leading-tight">
                {(() => {
                  if (history.length === 0) return 'Take your first assessment to see your mood overview here!';
                  const sorted = [...chartData].sort((a, b) => b.value - a.value);
                  const best = sorted[0];
                  const weakest = sorted[sorted.length - 1];
                  return `Strongest: ${best.name} (${best.value}%). Area to improve: ${weakest.name} (${weakest.value}%). Keep going!`;
                })()}
              </p>
            </div>
          </div>
        </div>

        {/* ROW 2: Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-[#1E1E1E] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Action 1: Log Your Mood */}
            <Link
              to="/assessment"
              className="bg-[#FFF8E7] rounded-[24px] p-4 flex items-center justify-between group hover:shadow-soft hover:scale-[1.02] transition-all border border-[#FFE8B3]/50"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#FFB703] flex items-center justify-center text-white shadow-sm flex-shrink-0">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1E1E1E]">Log Your Mood</h4>
                  <p className="text-[11px] text-[#8E8E93] font-medium">Track how you feel right now</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8E8E93] group-hover:text-[#FFB703] group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* Action 2: Write Journal */}
            <Link
              to="/journal"
              className="bg-[#F5F3FF] rounded-[24px] p-4 flex items-center justify-between group hover:shadow-soft hover:scale-[1.02] transition-all border border-[#E0E7FF]/50"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#8B5CF6] flex items-center justify-center text-white shadow-sm flex-shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1E1E1E]">Write Journal</h4>
                  <p className="text-[11px] text-[#8E8E93] font-medium">Express your thoughts</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8E8E93] group-hover:text-[#8B5CF6] group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* Action 3: Guided Meditation */}
            <Link
              to="/mood-booster"
              className="bg-[#ECFDF5] rounded-[24px] p-4 flex items-center justify-between group hover:shadow-soft hover:scale-[1.02] transition-all border border-[#A7F3D0]/50"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#10B981] flex items-center justify-center text-white shadow-sm flex-shrink-0">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1E1E1E]">Guided Meditation</h4>
                  <p className="text-[11px] text-[#8E8E93] font-medium">Relax your mind in minutes</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8E8E93] group-hover:text-[#10B981] group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* Action 4: Connect */}
            <Link
              to="/resources?tab=community"
              className="bg-[#FFF1F2] rounded-[24px] p-4 flex items-center justify-between group hover:shadow-soft hover:scale-[1.02] transition-all border border-[#FECDD3]/50"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#F43F5E] flex items-center justify-center text-white shadow-sm flex-shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1E1E1E]">Connect</h4>
                  <p className="text-[11px] text-[#8E8E93] font-medium">Talk with caring people</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8E8E93] group-hover:text-[#F43F5E] group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </div>

        {/* ROW 3: Today's Insight & How are you feeling */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Card 1: Today's Insight */}
          <div className="lg:col-span-5 bg-[#EDE9FE] rounded-[32px] p-6 lg:p-7 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-base text-[#2E1065]">Today's Insight</h3>
            </div>
            
            <div className="flex items-center gap-4 my-2">
              <div className="flex-shrink-0">
                <InsightBloomingFace className="w-24 h-24" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-extrabold text-sm text-[#1E1E1E] leading-snug">
                  Progress, not perfection.
                </h4>
                <p className="text-xs text-[#5B21B6] font-medium leading-relaxed">
                  You're becoming the best version of yourself, one day at a time.
                </p>
              </div>
            </div>

            <div className="mt-2">
              <Link
                to="/resources"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white text-xs font-bold rounded-full shadow-sm hover:bg-[#7C3AED] transition-all hover:scale-105"
              >
                Explore More <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: How are you feeling? (4 Mood Cards) */}
          <div className="lg:col-span-7 bg-[#FFFFFF] rounded-[32px] p-6 border border-[#F0EFEB] flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-[#1E1E1E]">How are you feeling?</h3>
              <Link to="/assessment" className="text-xs font-bold text-[#FF874B] hover:underline">
                See All
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              {/* Calm */}
              <div
                onClick={() => navigate('/mood-booster')}
                className="bg-[#F5F3FF] rounded-[24px] p-3.5 flex flex-col items-center text-center cursor-pointer hover:shadow-soft hover:scale-[1.03] transition-all justify-between"
              >
                <div className="w-full flex justify-start">
                  <span className="font-bold text-xs text-[#1E1E1E]">Calm</span>
                </div>
                <div className="my-1">
                  <MoodCalm className="w-16 h-16" />
                </div>
                <div className="w-full flex items-center justify-between mt-1">
                  <p className="text-[10px] text-[#8E8E93] text-left leading-tight max-w-[55px]">
                    Feeling peaceful and relaxed
                  </p>
                  <button className="w-6 h-6 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Energetic */}
              <div
                onClick={() => navigate('/mood-booster')}
                className="bg-[#FEF3C7] rounded-[24px] p-3.5 flex flex-col items-center text-center cursor-pointer hover:shadow-soft hover:scale-[1.03] transition-all justify-between"
              >
                <div className="w-full flex justify-start">
                  <span className="font-bold text-xs text-[#1E1E1E]">Energetic</span>
                </div>
                <div className="my-1">
                  <MoodEnergetic className="w-16 h-16" />
                </div>
                <div className="w-full flex items-center justify-between mt-1">
                  <p className="text-[10px] text-[#8E8E93] text-left leading-tight max-w-[55px]">
                    Full of energy and motivation
                  </p>
                  <button className="w-6 h-6 rounded-full bg-[#FF874B] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Anxious */}
              <div
                onClick={() => navigate('/mood-booster')}
                className="bg-[#FCE7F3] rounded-[24px] p-3.5 flex flex-col items-center text-center cursor-pointer hover:shadow-soft hover:scale-[1.03] transition-all justify-between"
              >
                <div className="w-full flex justify-start">
                  <span className="font-bold text-xs text-[#1E1E1E]">Anxious</span>
                </div>
                <div className="my-1">
                  <MoodAnxious className="w-16 h-16" />
                </div>
                <div className="w-full flex items-center justify-between mt-1">
                  <p className="text-[10px] text-[#8E8E93] text-left leading-tight max-w-[55px]">
                    Overwhelmed and worried
                  </p>
                  <button className="w-6 h-6 rounded-full bg-[#F43F5E] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Sad */}
              <div
                onClick={() => navigate('/mood-booster')}
                className="bg-[#DCFCE7] rounded-[24px] p-3.5 flex flex-col items-center text-center cursor-pointer hover:shadow-soft hover:scale-[1.03] transition-all justify-between"
              >
                <div className="w-full flex justify-start">
                  <span className="font-bold text-xs text-[#1E1E1E]">Sad</span>
                </div>
                <div className="my-1">
                  <MoodSad className="w-16 h-16" />
                </div>
                <div className="w-full flex items-center justify-between mt-1">
                  <p className="text-[10px] text-[#8E8E93] text-left leading-tight max-w-[55px]">
                    Feeling low and down
                  </p>
                  <button className="w-6 h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ROW 4: Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#1E1E1E]">Recent Activity</h2>
            <Link to="/history" className="text-xs font-bold text-[#FF874B] hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Activity 1 */}
            <div className="bg-[#FFFFFF] border border-[#F0EFEB] rounded-[24px] p-4 flex items-center gap-3.5 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF8E7] flex items-center justify-center text-lg flex-shrink-0">
                😊
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[#1E1E1E]">Mood Logged</span>
                  <span className="px-2 py-0.5 bg-[#FF874B]/10 text-[#FF874B] text-[10px] font-bold rounded-full">Happy</span>
                </div>
                <p className="text-[11px] text-[#8E8E93] font-medium mt-0.5">Today, 9:30 AM</p>
              </div>
            </div>

            {/* Activity 2 */}
            <div className="bg-[#FFFFFF] border border-[#F0EFEB] rounded-[24px] p-4 flex items-center gap-3.5 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-[#F5F3FF] flex items-center justify-center text-[#8B5CF6] flex-shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="font-bold text-xs text-[#1E1E1E] truncate">Journal Entry</h5>
                <p className="text-[11px] text-[#5C5C5C] font-medium truncate">Morning thoughts</p>
                <p className="text-[10px] text-[#8E8E93]">Today, 8:15 AM</p>
              </div>
            </div>

            {/* Activity 3 */}
            <div className="bg-[#FFFFFF] border border-[#F0EFEB] rounded-[24px] p-4 flex items-center gap-3.5 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-[#ECFDF5] flex items-center justify-center text-[#10B981] flex-shrink-0">
                <Wind className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="font-bold text-xs text-[#1E1E1E] truncate">Meditation</h5>
                <p className="text-[11px] text-[#5C5C5C] font-medium truncate">5-min Breathing</p>
                <p className="text-[10px] text-[#8E8E93]">Yesterday, 7:30 PM</p>
              </div>
            </div>

            {/* Activity 4 */}
            <div className="bg-[#FFFFFF] border border-[#F0EFEB] rounded-[24px] p-4 flex items-center gap-3.5 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF1F2] flex items-center justify-center text-[#F43F5E] flex-shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="font-bold text-xs text-[#1E1E1E] truncate">Reflection</h5>
                <p className="text-[11px] text-[#5C5C5C] font-medium truncate">Self-love journey</p>
                <p className="text-[10px] text-[#8E8E93]">Yesterday, 6:45 PM</p>
              </div>
            </div>

          </div>
        </div>

      </div>


      {/* ======================================================== */}
      {/* RIGHT COLUMN: MINDMATE COMPANION PANEL (MINIMISABLE)     */}
      {/* ======================================================== */}
      {!isChatbotMinimized ? (
        <div className="w-full xl:w-[360px] flex-shrink-0 flex flex-col bg-[#FFFFFF] rounded-[36px] shadow-soft border border-white/60 overflow-hidden animate-slide-up transition-all duration-300">
          
          {/* Companion Green Header */}
          <div className="bg-[#8FA564] p-4 text-white flex items-center justify-between rounded-t-[36px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20 p-0.5 border border-white/40">
                <MindMateAvatar className="w-full h-full" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">MindMate</h3>
                <p className="text-[11px] text-white/90 font-medium">Always here for you ⌵</p>
              </div>
            </div>
            <button
              onClick={() => setIsChatbotMinimized(true)}
              title="Minimize Companion"
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Minus className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Waving Boy Hero Illustration Banner */}
          <div className="p-5 flex flex-col items-center text-center border-b border-[#F0EFEB]">
            <div className="mb-2">
              <ChatbotWavingCharacter className="w-28 h-28" />
            </div>
            <h4 className="font-black text-lg text-[#1E1E1E] flex items-center gap-1.5 justify-center">
              Hey {displayName}! <span className="text-lg">👋</span>
            </h4>
            <p className="text-xs text-[#5C5C5C] font-medium mt-1 leading-snug max-w-[240px]">
              I'm MindMate, your AI companion. How can I support you today?
            </p>

            {/* Quick Action Chips */}
            <div className="w-full space-y-2 mt-4">
              <button
                onClick={() => handleQuickAction('How do I feel?')}
                disabled={isTyping}
                className="w-full py-2.5 px-4 bg-[#FFFFFF] border border-[#E5E5EA] rounded-full text-xs font-bold text-[#1E1E1E] flex items-center gap-2.5 hover:bg-[#F8F7F4] hover:border-[#FF874B] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>💜</span>
                <span>How do I feel?</span>
              </button>
              <button
                onClick={() => handleQuickAction('Start Reflection')}
                disabled={isTyping}
                className="w-full py-2.5 px-4 bg-[#FFFFFF] border border-[#E5E5EA] rounded-full text-xs font-bold text-[#1E1E1E] flex items-center gap-2.5 hover:bg-[#F8F7F4] hover:border-[#FF874B] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>🌿</span>
                <span>Start Reflection</span>
              </button>
              <button
                onClick={() => handleQuickAction('Log Mood')}
                disabled={isTyping}
                className="w-full py-2.5 px-4 bg-[#FFFFFF] border border-[#E5E5EA] rounded-full text-xs font-bold text-[#1E1E1E] flex items-center gap-2.5 hover:bg-[#F8F7F4] hover:border-[#FF874B] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>📦</span>
                <span>Log Mood</span>
              </button>
            </div>
          </div>

          {/* Live Conversation Stream */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[300px] custom-scroll bg-[#FAF9F6]">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
                <div className="flex items-end gap-2 max-w-[88%]">
                  {msg.from === 'bot' && (
                    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mb-1">
                      <MindMateAvatar className="w-full h-full" />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                      msg.from === 'user'
                        ? 'bg-[#FF874B] text-white rounded-br-none shadow-sm'
                        : 'bg-[#FFFFFF] text-[#1E1E1E] rounded-bl-none border border-[#F0EFEB] shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
                <span className="text-[10px] text-[#8E8E93] mt-1 px-1">
                  {msg.time} {msg.from === 'user' ? '✓✓' : ''}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <MindMateAvatar className="w-full h-full" />
                </div>
                <div className="bg-[#FFFFFF] p-2.5 rounded-2xl rounded-bl-none border border-[#F0EFEB] flex gap-1">
                  <span className="w-1.5 h-1.5 bg-[#8FA564] rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-[#8FA564] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-[#8FA564] rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendChat} className="p-3 bg-[#FFFFFF] border-t border-[#F0EFEB] flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={isTyping}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2.5 bg-[#F8F7F4] rounded-full text-xs font-medium text-[#1E1E1E] placeholder:text-[#8E8E93] focus:outline-none focus:ring-1 focus:ring-[#8FA564] disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isTyping}
              className="w-9 h-9 rounded-full bg-[#8FA564] text-white flex items-center justify-center hover:bg-[#7D9354] disabled:opacity-50 transition-colors flex-shrink-0 shadow-sm disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>

        </div>
      ) : (
        /* Floating/Docked Quick Restore Pill when Minimized */
        <div className="fixed bottom-6 right-6 z-40 animate-fade-in">
          <button
            onClick={() => setIsChatbotMinimized(false)}
            className="flex items-center justify-center w-14 h-14 bg-[#8FA564] text-white rounded-full shadow-[0_10px_30px_rgba(143,165,100,0.4)] hover:bg-[#7D9354] transition-all hover:scale-105"
            title="Ask MindMate AI"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-white/20">
              <MindMateAvatar className="w-full h-full" />
            </div>
          </button>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
