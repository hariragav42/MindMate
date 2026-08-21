import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { BookOpen, Search, Clock, ExternalLink, Activity, Heart, Play, Sparkles, Zap, Filter } from 'lucide-react';

const Resources = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If the query string changes externally, update state
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  useEffect(() => {
    api.get('/api/resources')
      .then((res) => { setResources(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories = ['all', ...new Set(resources.map((r) => r.category).filter(Boolean))];

  const filtered = resources.filter((r) => {
    const matchesSearch = !searchQuery || r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.tags_json || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || r.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const categoryIcon = (cat) => {
    const map = { breathing: Zap, exercise: Activity, meditation: Heart, audio: Play, article: BookOpen, video: Play, animation: Sparkles };
    return map[(cat || '').toLowerCase()] || BookOpen;
  };

  const categoryColor = (cat) => {
    const map = {
      breathing: 'bg-[#91A84F]/20 text-[#91A84F]',
      exercise: 'bg-[#FF874B]/20 text-[#FF874B]',
      meditation: 'bg-[#C98CEB]/20 text-[#C98CEB]',
      audio: 'bg-[#7C83F5]/20 text-[#7C83F5]',
      article: 'bg-white text-text',
      video: 'bg-[#E5A0D3]/20 text-[#E5A0D3]',
      animation: 'bg-[#FFD886]/30 text-[#D4A017]',
    };
    return map[(cat || '').toLowerCase()] || 'bg-white/50 text-text/70';
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh] relative z-10">
        <div className="w-10 h-10 border-4 border-surface border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="page-container relative z-10">
      <div className="mb-10 animate-fade-in">
        <h1 className="text-4xl font-extrabold text-text tracking-tight">Resource Library</h1>
        <p className="text-lg text-text/70 mt-2 font-medium">Browse curated relaxation and study resources</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-5 mb-10 animate-fade-in">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text/40" />
          <input
            type="text"
            placeholder="Search resources..."
            className="input-field pl-12 shadow-sm py-4 text-base"
            value={searchQuery}
            onChange={(e) => {
              const val = e.target.value;
              setSearchQuery(val);
              if (val) {
                setSearchParams({ q: val });
              } else {
                setSearchParams({});
              }
            }}
          />
        </div>
        <div className="flex gap-2.5 overflow-x-auto custom-scroll pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-6 py-3.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                activeFilter === cat
                  ? 'bg-primary text-white shadow-soft'
                  : 'bg-white text-text/60 hover:text-text hover:bg-white/80 hover:shadow-sm'
              }`}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Grid */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r, i) => {
            const Icon = categoryIcon(r.category);
            return (
              <div key={r.id} className="card-glow group animate-slide-up bg-white p-6 shadow-sm border-transparent" style={{ animationDelay: `${i * 60}ms`, opacity: 0 }}>
                <div className="flex items-start gap-5 mb-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${categoryColor(r.category)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-text/40">{r.category}</span>
                    <h3 className="font-bold text-text text-base mt-1 truncate">{r.title}</h3>
                  </div>
                </div>

                {r.content_text && (
                  <p className="text-sm text-text/60 mb-6 line-clamp-3 leading-relaxed font-medium">{r.content_text}</p>
                )}

                <div className="flex items-center justify-between mt-auto pt-5 border-t border-black/5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-text/40">
                    <Clock className="w-4 h-4" /> {r.duration_min} min
                  </div>
                  {r.content_url && (
                    <a href={r.content_url} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-1.5 text-sm text-primary font-bold hover:underline">
                      Open <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-background/50 rounded-3xl border border-dashed border-surface">
          <Filter className="w-12 h-12 text-surface mx-auto mb-4" />
          <p className="text-primary/50 font-medium">No resources match your search</p>
        </div>
      )}
    </div>
  );
};

export default Resources;
