import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Activity, ArrowRight, BookOpen, Clock, Heart, Play, Sparkles, Zap, Home } from 'lucide-react';

const levelConfig = {
  Low: {
    color: 'from-[#91A84F] to-[#7B8766]',
    bg: 'bg-[#91A84F]/15',
    text: 'text-[#91A84F]',
    border: 'border-[#91A84F]/30',
    emoji: '🌿',
    message: 'Your stress levels are manageable. Keep up the good habits!',
    tip: 'Continue maintaining your current routines and try the resources below to stay on track.',
  },
  Moderate: {
    color: 'from-[#FFD886] to-[#F4A261]',
    bg: 'bg-[#FFD886]/20',
    text: 'text-[#D4A017]',
    border: 'border-[#FFD886]/40',
    emoji: '🍂',
    message: 'You\'re experiencing moderate stress. Let\'s work on reducing it.',
    tip: 'Try incorporating short breaks and breathing exercises into your daily routine.',
  },
  High: {
    color: 'from-[#FF6B6B] to-[#E05252]',
    bg: 'bg-[#FF6B6B]/15',
    text: 'text-[#FF6B6B]',
    border: 'border-[#FF6B6B]/30',
    emoji: '🌧️',
    message: 'Your stress levels are elevated. It\'s important to gently take action.',
    tip: 'Start with guided breathing or meditation. If stress persists, consider reaching out to a counselor.',
  },
};

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(location.state?.result || null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!result) {
      navigate('/dashboard');
      return;
    }
    api.get('/api/recommendations/latest')
      .then((res) => {
        setRecommendations(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [result, navigate]);

  if (!result) return null;

  const config = levelConfig[result.predicted_level] || levelConfig.Moderate;

  const categoryIcon = (cat) => {
    const map = { breathing: Zap, exercise: Activity, meditation: Heart, audio: Play, article: BookOpen, video: Play, animation: Sparkles };
    return map[(cat || '').toLowerCase()] || BookOpen;
  };

  return (
    <div className="page-container max-w-3xl relative z-10">
      {/* Result Hero */}
      <div className="text-center mb-10 animate-slide-up">
        <div className="text-6xl mb-4">{config.emoji}</div>
        <div className={`inline-flex items-center gap-2 px-6 py-2.5 ${config.bg} ${config.text} rounded-full text-lg font-bold mb-5 border ${config.border} shadow-sm`}>
          <Activity className="w-5 h-5" />
          {result.predicted_level} Stress
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-text mb-3 tracking-tight">{config.message}</h1>
        <p className="text-text/70 max-w-lg mx-auto font-medium text-lg">{config.tip}</p>
      </div>

      {/* Score Visual */}
      <div className="card shadow-soft mb-10 animate-slide-up bg-white" style={{ animationDelay: '100ms', opacity: 0 }}>
        <h2 className="text-xl font-bold text-text mb-4">Your Stress Level</h2>
        <div className="relative h-4 bg-surface/80 rounded-full overflow-hidden mb-3 border border-white/50 shadow-inner">
          <div className={`absolute inset-y-0 left-0 bg-gradient-to-r ${config.color} rounded-full transition-all duration-1000 ease-out shadow-sm`}
               style={{ width: result.predicted_level === 'Low' ? '30%' : result.predicted_level === 'Moderate' ? '60%' : '90%' }} />
        </div>
        <div className="flex justify-between text-xs text-text/50 font-semibold uppercase tracking-wider">
          <span>Low</span><span>Moderate</span><span>High</span>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-10 animate-slide-up" style={{ animationDelay: '200ms', opacity: 0 }}>
        <h2 className="text-3xl font-extrabold text-text mb-1 tracking-tight">Recommended Resources</h2>
        <p className="text-base text-text/60 mb-6 font-medium">Personalized based on your result</p>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-surface border-t-primary rounded-full animate-spin mx-auto" />
          </div>
        ) : recommendations.length > 0 ? (
          <div className="flex flex-col gap-4">
            {recommendations.map((rec, i) => {
              const Icon = categoryIcon(rec.resource?.category);
              return (
                <div key={rec.id} className="card-glow flex items-center gap-4 animate-slide-right p-5 bg-white border-transparent"
                     style={{ animationDelay: `${300 + i * 80}ms`, opacity: 0 }}>
                  <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-white/50">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-text/50 uppercase tracking-wider">{rec.resource?.category}</span>
                    <h3 className="font-bold text-text text-base mt-0.5 truncate">{rec.resource?.title}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-text/50">
                    <Clock className="w-4 h-4" /> {rec.resource?.duration_min}m
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-primary/50 text-center py-6 font-medium">No recommendations available</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '500ms', opacity: 0 }}>
        <Link to="/dashboard" className="btn-secondary flex-1 text-center flex items-center justify-center gap-2">
          <Home className="w-5 h-5" /> Back to Dashboard
        </Link>
        <Link to="/resources" className="btn-primary flex-1 text-center flex items-center justify-center gap-2">
          Explore All Resources <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default Result;
