import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ClipboardCheck, ChevronLeft, ChevronRight, Send, Loader2 } from 'lucide-react';

const Assessment = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/questions')
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load questions');
        setLoading(false);
      });
  }, []);

  const currentQ = questions[currentIdx];
  const totalQ = questions.length;
  const progress = totalQ > 0 ? ((currentIdx + 1) / totalQ) * 100 : 0;

  const handleSingleSelect = (qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: { answer_value: value, option_values: null } }));
  };

  const handleMultiSelect = (qId, value) => {
    setAnswers((prev) => {
      const existing = prev[qId]?.option_values || [];
      const updated = existing.includes(value)
        ? existing.filter((v) => v !== value)
        : [...existing, value];
      return { ...prev, [qId]: { answer_value: null, option_values: updated } };
    });
  };

  const isAnswered = (qId) => {
    const a = answers[qId];
    if (!a) return false;
    if (a.answer_value) return true;
    if (a.option_values && a.option_values.length > 0) return true;
    return false;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        answers: questions.map((q) => ({
          question_id: q.id,
          answer_value: answers[q.id]?.answer_value || null,
          option_values: answers[q.id]?.option_values || null,
        })),
      };
      const res = await api.post('/api/assessments', payload);
      navigate('/result', { state: { result: res.data } });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit assessment');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-surface border-t-secondary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-primary/50 font-medium">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="page-container text-center py-20">
        <p className="text-primary/50 font-medium">No questions available. Please contact your administrator.</p>
      </div>
    );
  }

  const options = (() => {
    try {
      return JSON.parse(currentQ.options_json);
    } catch {
      return [];
    }
  })();

  return (
    <div className="page-container max-w-3xl relative z-10">
      {/* Header */}
      <div className="mb-10 animate-fade-in">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-16 h-16 bg-white shadow-soft rounded-[24px] flex items-center justify-center border border-white/50">
            <ClipboardCheck className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-text tracking-tight">Stress Assessment</h1>
            <p className="text-base text-text/70 mt-1 font-medium">Answer honestly — there are no right or wrong answers</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-text/60 uppercase tracking-wider">Question {currentIdx + 1} of {totalQ}</span>
          <span className="text-sm font-black text-primary">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 bg-white/50 rounded-full overflow-hidden border border-white/30">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Dot indicators */}
        <div className="flex gap-1.5 mt-4 justify-center flex-wrap">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIdx(i)}
              className={`h-3 rounded-full transition-all duration-300 ${
                i === currentIdx
                  ? 'bg-primary w-10 shadow-sm'
                  : isAnswered(q.id)
                  ? 'bg-primary/40 w-3 hover:bg-primary/60'
                  : 'bg-white w-3 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question Card */}
      <div className="card shadow-soft border-white/50 mb-8 animate-fade-in bg-white" key={currentQ.id}>
        <h2 className="text-2xl font-bold text-text mb-8 leading-relaxed">{currentQ.text}</h2>

        {currentQ.type === 'multi' && (
          <p className="text-xs text-primary mb-4 font-bold uppercase tracking-wider">Select all that apply</p>
        )}

        <div className="flex flex-col gap-3">
          {options.map((opt, i) => {
            const isSelected =
              currentQ.type === 'multi'
                ? (answers[currentQ.id]?.option_values || []).includes(opt)
                : answers[currentQ.id]?.answer_value === opt;

            return (
              <button
                key={i}
                onClick={() =>
                  currentQ.type === 'multi'
                    ? handleMultiSelect(currentQ.id, opt)
                    : handleSingleSelect(currentQ.id, opt)
                }
                className={`w-full text-left px-5 py-4 rounded-[20px] border-2 transition-all duration-200 text-base font-semibold
                  ${isSelected
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-white bg-surface text-text/70 hover:border-primary/50 hover:bg-white hover:text-text hover:shadow-sm'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-${currentQ.type === 'multi' ? 'md' : 'full'} border-2 flex items-center justify-center flex-shrink-0 transition-colors
                    ${isSelected ? 'border-primary bg-primary' : 'border-white bg-white shadow-sm'}`}>
                    {isSelected && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  {opt}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="bg-coral/10 text-coral p-4 rounded-2xl mb-6 text-sm font-medium border border-coral/30 animate-fade-in">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
          disabled={currentIdx === 0}
          className="btn-secondary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        {currentIdx < totalQ - 1 ? (
          <button
            onClick={() => setCurrentIdx(currentIdx + 1)}
            className="btn-primary flex items-center gap-2"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary flex items-center gap-2 shadow-soft disabled:opacity-60"
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
            ) : (
              <><Send className="w-4 h-4" /> Submit Assessment</>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Assessment;
