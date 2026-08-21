import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Wind, Play, Pause, RotateCcw, Heart, Music, Volume2 } from 'lucide-react';

const breathingPatterns = [
  { name: '4-7-8 Calm', inhale: 4, hold: 7, exhale: 8, desc: 'Activates the parasympathetic nervous system for deep calm' },
  { name: 'Box Breathing', inhale: 4, hold: 4, exhale: 4, holdAfter: 4, desc: 'Used by Navy SEALs for rapid stress control' },
  { name: 'Quick Calm', inhale: 3, hold: 0, exhale: 6, desc: 'Extended exhale to slow your heart rate fast' },
];

const affirmations = [
  "You are doing your best, and that is enough.",
  "This feeling is temporary. You will get through this.",
  "Take a deep breath. You've handled hard things before.",
  "It's okay to take a break. Rest is productive.",
  "You are more capable than you think.",
  "One step at a time. Progress, not perfection.",
  "You deserve peace and calm in this moment.",
  "Your worth is not defined by your grades.",
];

const MoodBooster = () => {
  const [activeTab, setActiveTab] = useState('breathing');
  const [selectedPattern, setSelectedPattern] = useState(breathingPatterns[0]);
  const [phase, setPhase] = useState('idle'); // idle, inhale, hold, exhale, holdAfter
  const [timer, setTimer] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [affirmation, setAffirmation] = useState(affirmations[0]);
  const intervalRef = useRef(null);

  const getPhaseLabel = () => {
    if (phase === 'idle') return 'Press Play to Start';
    if (phase === 'inhale') return 'Breathe In';
    if (phase === 'hold' || phase === 'holdAfter') return 'Hold';
    if (phase === 'exhale') return 'Breathe Out';
    return '';
  };

  const getCircleScale = () => {
    if (phase === 'inhale') return 'scale-110';
    if (phase === 'exhale') return 'scale-90';
    return 'scale-100';
  };

  const getCircleColor = () => {
    if (phase === 'inhale') return 'bg-[#91A84F]/40';
    if (phase === 'hold' || phase === 'holdAfter') return 'bg-[#7C83F5]/20';
    if (phase === 'exhale') return 'bg-[#FF874B]/20';
    return 'bg-white/50';
  };

  useEffect(() => {
    if (!isRunning) return;

    const pattern = selectedPattern;
    const sequence = [
      { phase: 'inhale', duration: pattern.inhale },
      { phase: 'hold', duration: pattern.hold },
      { phase: 'exhale', duration: pattern.exhale },
    ];
    if (pattern.holdAfter) {
      sequence.push({ phase: 'holdAfter', duration: pattern.holdAfter });
    }

    let seqIdx = 0;
    let countdown = sequence[0].duration;
    setPhase(sequence[0].phase);
    setTimer(countdown);

    intervalRef.current = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        seqIdx++;
        if (seqIdx >= sequence.length) {
          seqIdx = 0;
          setCycles((c) => c + 1);
        }
        // Skip phases with 0 duration
        while (sequence[seqIdx].duration === 0 && seqIdx < sequence.length - 1) {
          seqIdx++;
        }
        countdown = sequence[seqIdx].duration;
        setPhase(sequence[seqIdx].phase);
      }
      setTimer(countdown);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, selectedPattern]);

  const toggleRunning = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setPhase('idle');
      setTimer(0);
    }
    setIsRunning(!isRunning);
  };

  const resetBreathing = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setPhase('idle');
    setTimer(0);
    setCycles(0);
  };

  const shuffleAffirmation = () => {
    let next;
    do {
      next = affirmations[Math.floor(Math.random() * affirmations.length)];
    } while (next === affirmation && affirmations.length > 1);
    setAffirmation(next);
  };

  const tabs = [
    { id: 'breathing', label: 'Breathing', icon: Wind },
    { id: 'affirmations', label: 'Affirmations', icon: Heart },
    { id: 'sounds', label: 'Sounds', icon: Music },
  ];

  return (
    <div className="page-container max-w-3xl relative z-10">
      <div className="text-center mb-10 animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFD886]/30 rounded-[24px] mb-5 shadow-soft border border-white/50">
          <Sparkles className="w-8 h-8 text-[#D4A017]" />
        </div>
        <h1 className="text-4xl font-extrabold text-text tracking-tight">Instant Mood Booster</h1>
        <p className="text-text/70 text-lg font-medium mt-2">Quick tools to calm your mind right now</p>
      </div>

      {/* Tab Selector */}
      <div className="flex gap-2 bg-white/50 p-2 rounded-full mb-10 max-w-md mx-auto border border-white/40 shadow-inner">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-bold transition-all duration-300
              ${activeTab === tab.id ? 'bg-primary shadow-sm text-white' : 'text-text/50 hover:text-text hover:bg-white/80'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Breathing Tab */}
      {activeTab === 'breathing' && (
        <div className="animate-fade-in">
          {/* Pattern Selector */}
          <div className="flex gap-3 mb-12 justify-center flex-wrap">
            {breathingPatterns.map((p) => (
              <button
                key={p.name}
                onClick={() => { resetBreathing(); setSelectedPattern(p); }}
                className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                  selectedPattern.name === p.name
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white/50 text-text/60 hover:bg-white hover:text-text'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Breathing Circle */}
          <div className="flex flex-col items-center mb-10">
            <div className={`w-64 h-64 rounded-full ${getCircleColor()} flex items-center justify-center transition-all duration-1000 ease-in-out ${getCircleScale()} shadow-inner border border-white/50`}>
              <div className="w-48 h-48 rounded-full bg-surface/90 backdrop-blur-md flex flex-col items-center justify-center shadow-soft border border-white/60">
                <div className="text-6xl font-black text-text">{isRunning ? timer : '--'}</div>
                <div className="text-sm font-bold text-text/60 mt-2 uppercase tracking-wider">{getPhaseLabel()}</div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <button onClick={resetBreathing} className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:bg-surface transition-colors border border-transparent shadow-sm hover:shadow-soft text-text/60 hover:text-text">
              <RotateCcw className="w-6 h-6" />
            </button>
            <button
              onClick={toggleRunning}
              className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-soft hover:shadow-glow hover:-translate-y-1 transition-all"
            >
              {isRunning ? <Pause className="w-10 h-10 text-white" /> : <Play className="w-10 h-10 text-white ml-1.5" />}
            </button>
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center border border-transparent shadow-sm text-text">
              <span className="text-base font-bold">{cycles}</span>
            </div>
          </div>

          <p className="text-center text-base font-medium text-text/60 max-w-sm mx-auto">{selectedPattern.desc}</p>
          {cycles > 0 && <p className="text-center text-xs text-primary mt-3 font-black uppercase tracking-widest">{cycles} cycle{cycles > 1 ? 's' : ''} completed</p>}
        </div>
      )}

      {/* Affirmations Tab */}
      {activeTab === 'affirmations' && (
        <div className="animate-fade-in text-center">
          <div className="card shadow-soft max-w-lg mx-auto mb-10 py-20 px-10 border-white/50 bg-white">
            <Heart className="w-12 h-12 text-[#FF6B6B] mx-auto mb-8 animate-pulse-glow rounded-full" />
            <p className="text-3xl md:text-4xl font-bold text-text leading-tight tracking-tight">
              "{affirmation}"
            </p>
          </div>
          <button onClick={shuffleAffirmation} className="btn-primary flex items-center gap-2 mx-auto shadow-soft px-8 py-4 text-base">
            <Sparkles className="w-5 h-5" /> New Affirmation
          </button>
        </div>
      )}

      {/* Sounds Tab */}
      {activeTab === 'sounds' && (
        <div className="animate-fade-in">
          <div className="grid sm:grid-cols-2 gap-5 max-w-lg mx-auto">
            {[
              { name: 'Forest Rain', url: 'https://www.youtube.com/watch?v=q76bMs-NwRk', emoji: '🌧️' },
              { name: 'Ocean Waves', url: 'https://www.youtube.com/watch?v=WHPEKLQID4U', emoji: '🌊' },
              { name: 'Lofi Study Beats', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk', emoji: '🎵' },
              { name: 'Fireplace', url: 'https://www.youtube.com/watch?v=L_LUpnjgPso', emoji: '🔥' },
            ].map((sound) => (
              <a key={sound.name} href={sound.url} target="_blank" rel="noopener noreferrer"
                 className="card-glow flex items-center gap-5 group cursor-pointer bg-white border-transparent">
                <div className="text-3xl bg-surface w-14 h-14 flex items-center justify-center rounded-[20px] group-hover:scale-110 transition-transform">{sound.emoji}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-text text-base">{sound.name}</h3>
                  <p className="text-xs font-semibold text-text/50 mt-0.5">Open in YouTube</p>
                </div>
                <Volume2 className="w-6 h-6 text-text/30 group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodBooster;
