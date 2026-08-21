import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Clock, Activity, TrendingDown, TrendingUp, Minus, Calendar, BarChart3 } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/assessments/history')
      .then((res) => { setHistory(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const levelColor = (level) => {
    const map = { 
      Low: 'text-[#91A84F] bg-[#91A84F]/15 border-[#91A84F]/30', 
      Moderate: 'text-[#D4A017] bg-[#FFD886]/20 border-[#FFD886]/40', 
      High: 'text-[#FF6B6B] bg-[#FF6B6B]/15 border-[#FF6B6B]/30' 
    };
    return map[level] || 'text-text/70 bg-white/50 border-white/50';
  };

  const trendIcon = (current, previous) => {
    if (!previous) return <Minus className="w-4 h-4 text-text/40" />;
    const order = { Low: 1, Moderate: 2, High: 3 };
    const diff = (order[current] || 0) - (order[previous] || 0);
    if (diff < 0) return <TrendingDown className="w-4 h-4 text-[#91A84F]" />;
    if (diff > 0) return <TrendingUp className="w-4 h-4 text-[#FF6B6B]" />;
    return <Minus className="w-4 h-4 text-text/40" />;
  };

  const dotColor = (level) => {
    const map = {
      Low: 'bg-[#91A84F] border-[#91A84F]',
      Moderate: 'bg-[#F4A261] border-[#F4A261]',
      High: 'bg-[#FF6B6B] border-[#FF6B6B]'
    };
    return map[level] || 'bg-white border-white';
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh] relative z-10">
        <div className="w-10 h-10 border-4 border-surface border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="page-container max-w-3xl relative z-10">
      <div className="mb-10 animate-fade-in">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center shadow-soft border border-white/50">
            <BarChart3 className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-text tracking-tight">Assessment History</h1>
            <p className="text-base text-text/70 mt-1 font-medium">Track your stress levels over time</p>
          </div>
        </div>
      </div>

      {history.length > 0 ? (
        <>
          {/* Summary Strip */}
          <div className="grid grid-cols-3 gap-5 mb-10 animate-fade-in">
            <div className="card text-center py-8 border-transparent bg-white">
              <div className="text-4xl font-black text-text">{history.length}</div>
              <div className="text-xs font-bold uppercase tracking-wider text-text/50 mt-2">Total</div>
            </div>
            <div className="card text-center py-8 border-transparent bg-white">
              <div className="text-4xl font-black text-text">{history[0]?.level || '--'}</div>
              <div className="text-xs font-bold uppercase tracking-wider text-text/50 mt-2">Latest</div>
            </div>
            <div className="card text-center py-8 border-transparent bg-white">
              <div className="text-4xl font-black text-text">
                {(() => {
                  const levels = history.map((h) => h.level);
                  const counts = {};
                  levels.forEach((l) => { counts[l] = (counts[l] || 0) + 1; });
                  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '--';
                })()}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-text/50 mt-2">Most Common</div>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-white/50 rounded-full" />

            <div className="flex flex-col gap-5">
              {history.map((entry, i) => (
                <div key={entry.id} className="relative flex items-start gap-6 animate-slide-right"
                     style={{ animationDelay: `${i * 60}ms`, opacity: 0 }}>
                  {/* Timeline dot */}
                  <div className={`w-4 h-4 rounded-full mt-6 flex-shrink-0 relative z-10 border-4 ${dotColor(entry.level)}`} style={{ marginLeft: '17px' }} />

                  {/* Card */}
                  <div className="card flex-1 flex items-center gap-4 py-6 px-8 shadow-sm border-transparent bg-white hover:shadow-soft">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`badge border ${levelColor(entry.level)}`}>{entry.level}</span>
                        {trendIcon(entry.level, history[i + 1]?.level)}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-text/50 mt-3">
                        <Calendar className="w-4 h-4" />
                        {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        <span className="text-text/30">|</span>
                        <Clock className="w-4 h-4" />
                        {new Date(entry.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-20 animate-fade-in bg-background/50 rounded-3xl border border-dashed border-surface">
          <div className="w-16 h-16 bg-white shadow-sm border border-surface rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-surface" />
          </div>
          <h3 className="text-lg font-bold text-primary mb-2">No History Yet</h3>
          <p className="text-sm text-primary/60 font-medium">Take your first assessment to start tracking your stress levels.</p>
        </div>
      )}
    </div>
  );
};

export default History;
