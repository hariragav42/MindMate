import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import {
  Plus,
  Save,
  Trash2,
  BookOpen,
  Clock,
  Smile,
  Frown,
  Meh,
  Zap,
  Heart,
  Search,
  ChevronRight,
  Edit3,
  X
} from 'lucide-react';

const moodTags = [
  { label: 'Happy', emoji: '😊', color: '#FF874B', bg: '#FFF8E7' },
  { label: 'Calm', emoji: '😌', color: '#8B5CF6', bg: '#F5F3FF' },
  { label: 'Stressed', emoji: '😰', color: '#F43F5E', bg: '#FFF1F2' },
  { label: 'Tired', emoji: '😴', color: '#60A5FA', bg: '#EFF6FF' },
  { label: 'Grateful', emoji: '🙏', color: '#10B981', bg: '#ECFDF5' },
  { label: 'Anxious', emoji: '😟', color: '#F59E0B', bg: '#FFFBEB' },
];

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeEntry, setActiveEntry] = useState(null); // entry being edited
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [moodTag, setMoodTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewEntry, setIsNewEntry] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await api.get('/api/journal');
      setEntries(res.data || []);
    } catch (err) {
      console.error('Failed to fetch journal entries', err);
    } finally {
      setLoading(false);
    }
  };

  const startNewEntry = () => {
    setActiveEntry(null);
    setTitle('');
    setContent('');
    setMoodTag('');
    setIsNewEntry(true);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const openEntry = (entry) => {
    setActiveEntry(entry);
    setTitle(entry.title || '');
    setContent(entry.content || '');
    setMoodTag(entry.mood_tag || '');
    setIsNewEntry(false);
  };

  const handleSave = async () => {
    if (!content.trim() && !title.trim()) return;
    setSaving(true);
    try {
      const payload = {
        title: title.trim() || 'Untitled',
        content: content.trim(),
        mood_tag: moodTag || null,
      };

      if (isNewEntry || !activeEntry) {
        const res = await api.post('/api/journal', payload);
        setEntries(prev => [res.data, ...prev]);
        setActiveEntry(res.data);
        setIsNewEntry(false);
      } else {
        const res = await api.put(`/api/journal/${activeEntry.id}`, payload);
        setEntries(prev => prev.map(e => e.id === activeEntry.id ? res.data : e));
        setActiveEntry(res.data);
      }
    } catch (err) {
      console.error('Failed to save journal entry', err);
      alert('Error saving journal: ' + (err.response?.data?.detail || err.response?.data || err.message || JSON.stringify(err)));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (entryId) => {
    try {
      await api.delete(`/api/journal/${entryId}`);
      setEntries(prev => prev.filter(e => e.id !== entryId));
      if (activeEntry?.id === entryId) {
        setActiveEntry(null);
        setTitle('');
        setContent('');
        setMoodTag('');
        setIsNewEntry(false);
      }
    } catch (err) {
      console.error('Failed to delete journal entry', err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const filteredEntries = entries.filter(e => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (e.title || '').toLowerCase().includes(q) ||
           (e.content || '').toLowerCase().includes(q) ||
           (e.mood_tag || '').toLowerCase().includes(q);
  });

  const isEditing = isNewEntry || activeEntry;

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-4 p-3 sm:p-5 lg:p-6 w-full max-w-[1700px] mx-auto min-w-0">
      
      {/* LEFT PANEL: Journal Entries List */}
      <div className="w-full lg:w-[340px] flex-shrink-0 bg-white rounded-[32px] shadow-soft border border-white/60 flex flex-col overflow-hidden">
        
        {/* List Header */}
        <div className="p-5 pb-3 border-b border-[#F0EFEB] flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#8B5CF6]" />
              <h2 className="font-extrabold text-lg text-[#1E1E1E]">My Journal</h2>
            </div>
            <button
              onClick={startNewEntry}
              className="w-9 h-9 bg-[#FF874B] text-white rounded-full flex items-center justify-center shadow-sm hover:bg-[#FF722B] transition-all hover:scale-110"
              title="New Entry"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search entries..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#F8F7F4] rounded-xl text-xs font-medium text-[#1E1E1E] placeholder:text-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 transition-all"
            />
          </div>
        </div>

        {/* Entries List */}
        <div className="flex-1 overflow-y-auto custom-scroll p-3 space-y-2">
          {loading ? (
            <div className="text-center py-10 text-[#8E8E93] text-sm font-medium">Loading...</div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="text-4xl">📝</div>
              <p className="text-[#8E8E93] text-sm font-medium">
                {searchQuery ? 'No entries found' : 'No journal entries yet'}
              </p>
              {!searchQuery && (
                <button
                  onClick={startNewEntry}
                  className="px-4 py-2 bg-[#FF874B] text-white text-xs font-bold rounded-full hover:bg-[#FF722B] transition-all"
                >
                  Write Your First Entry
                </button>
              )}
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const isSelected = activeEntry?.id === entry.id;
              const mood = moodTags.find(m => m.label === entry.mood_tag);
              return (
                <div
                  key={entry.id}
                  onClick={() => openEntry(entry)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-200 group ${
                    isSelected
                      ? 'bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 shadow-sm'
                      : 'bg-[#F8F7F4] hover:bg-[#F0EFEB] border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className={`font-bold text-sm truncate ${isSelected ? 'text-[#8B5CF6]' : 'text-[#1E1E1E]'}`}>
                        {entry.title || 'Untitled'}
                      </h4>
                      <p className="text-[11px] text-[#8E8E93] font-medium mt-0.5 line-clamp-2 leading-relaxed">
                        {entry.content?.substring(0, 80)}...
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-[#8E8E93] hover:text-[#F43F5E] hover:bg-[#F43F5E]/10 rounded-lg transition-all flex-shrink-0"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-[#8E8E93] font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(entry.updated_at)}
                    </span>
                    {mood && (
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ color: mood.color, backgroundColor: mood.bg }}
                      >
                        {mood.emoji} {mood.label}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Editor / Notepad */}
      <div className="flex-1 bg-white rounded-[32px] shadow-soft border border-white/60 flex flex-col overflow-hidden min-w-0">
        
        {isEditing ? (
          <>
            {/* Editor Header */}
            <div className="px-6 py-4 border-b border-[#F0EFEB] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Edit3 className="w-5 h-5 text-[#8B5CF6] flex-shrink-0" />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Entry title..."
                  className="flex-1 text-lg font-extrabold text-[#1E1E1E] bg-transparent focus:outline-none placeholder:text-[#C7C7CC]"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving || !content.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#8B5CF6] text-white text-xs font-bold rounded-full shadow-sm hover:bg-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => { setActiveEntry(null); setIsNewEntry(false); setTitle(''); setContent(''); setMoodTag(''); }}
                  className="p-2 text-[#8E8E93] hover:text-[#1E1E1E] hover:bg-[#F8F7F4] rounded-xl transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mood Tag Selector */}
            <div className="px-6 py-3 border-b border-[#F0EFEB] flex items-center gap-2 flex-shrink-0 overflow-x-auto">
              <span className="text-xs font-semibold text-[#8E8E93] flex-shrink-0">Mood:</span>
              {moodTags.map((m) => (
                <button
                  key={m.label}
                  onClick={() => setMoodTag(moodTag === m.label ? '' : m.label)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex-shrink-0 ${
                    moodTag === m.label
                      ? 'shadow-sm scale-105'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    color: m.color,
                    backgroundColor: moodTag === m.label ? m.bg : '#F8F7F4',
                    border: moodTag === m.label ? `1.5px solid ${m.color}40` : '1.5px solid transparent',
                  }}
                >
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>

            {/* Notepad Textarea */}
            <div className="flex-1 p-6 overflow-y-auto">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind today? Write freely — this is your safe space... 🌿"
                className="w-full h-full min-h-[300px] bg-transparent text-[15px] text-[#1E1E1E] font-medium leading-[1.9] focus:outline-none placeholder:text-[#C7C7CC] resize-none"
                style={{
                  backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #F0EFEB 31px, #F0EFEB 32px)',
                  backgroundSize: '100% 32px',
                  lineHeight: '32px',
                  paddingTop: '0px',
                }}
              />
            </div>

            {/* Bottom Status Bar */}
            <div className="px-6 py-3 border-t border-[#F0EFEB] flex items-center justify-between text-[11px] text-[#8E8E93] font-medium flex-shrink-0">
              <span>{content.length} characters · {content.trim().split(/\s+/).filter(Boolean).length} words</span>
              {activeEntry && (
                <span>Last saved: {formatDate(activeEntry.updated_at)}</span>
              )}
            </div>
          </>
        ) : (
          /* Empty state — no entry selected */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="w-24 h-24 bg-[#F5F3FF] rounded-full flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-[#8B5CF6]" />
            </div>
            <h3 className="text-xl font-extrabold text-[#1E1E1E]">Your Journal</h3>
            <p className="text-sm text-[#8E8E93] font-medium max-w-sm leading-relaxed">
              Writing helps you process emotions and reflect on your day. Select an entry or start a new one.
            </p>
            <button
              onClick={startNewEntry}
              className="flex items-center gap-2 px-6 py-3 bg-[#FF874B] text-white text-sm font-bold rounded-full shadow-[0_6px_16px_rgba(255,135,75,0.35)] hover:bg-[#FF722B] transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" /> New Journal Entry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;
