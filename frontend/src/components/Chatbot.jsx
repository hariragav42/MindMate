import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, Leaf, Sparkles, ClipboardCheck, Heart, ArrowRight } from 'lucide-react';
import { MindMateAvatar } from './Illustrations';

const quickReplies = [
  { label: '🌿 How do I feel?', action: 'feel' },
  { label: '📝 Start Assessment', action: 'assess' },
  { label: '💆 Mood Booster', action: 'boost' },
  { label: '📚 Resources', action: 'resources' },
];

const botResponses = {
  feel: "It's great that you're checking in with yourself! Take a moment — close your eyes, breathe slowly, and notice how your body feels. When you're ready, take our assessment to get a personalized reading. 🌿",
  assess: "Let's get a snapshot of how you're doing. I'll take you to the assessment — it's just 15 quick questions and takes under 2 minutes. Ready?",
  boost: "Need a quick pick-me-up? I'll take you to the Mood Booster where you can try breathing exercises, affirmations, or calming sounds. 🎵",
  resources: "Our resource library has guided meditations, breathing exercises, articles, and calming videos. Let me take you there! 📖",
  default: "I'm here to help you feel calmer and more focused. You can ask me about your stress levels, try a mood booster, or explore our resources. What would you like to do? 🌿",
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi, I'm MindMate 🌿\nHow can I help you?", time: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleQuickReply = async (action) => {
    const userLabel = quickReplies.find((q) => q.action === action)?.label || action;
    await processMessage(userLabel);
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput('');
    await processMessage(trimmed);
  };

  const processMessage = async (text) => {
    const newMessages = [...messages, { from: 'user', text: text, time: new Date() }];
    setMessages(newMessages);

    // Dynamic AI Chat
    setIsTyping(true);
    try {
      // Format history for backend
      const history = newMessages.map(m => ({
        role: m.from,
        parts: [m.text]
      }));
      
      const { default: api } = await import('../services/api.js');
      const res = await api.post('/api/chat', {
        // Exclude the last message from history as it's sent as the new message
        history: history.slice(0, -1),
        message: text
      });
      
      setMessages((prev) => [...prev, { from: 'bot', text: res.data.response, time: new Date() }]);
      
      if (res.data.action && res.data.action.type === 'navigate' && res.data.action.target) {
        setTimeout(() => navigate(res.data.action.target), 1500);
      }
    } catch (error) {
      console.error("Chat API error:", error);
      setMessages((prev) => [...prev, { from: 'bot', text: "I'm having a little trouble connecting right now, but I'm still here for you! 🌿", time: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-500 shadow-soft hover:shadow-glow group ${
          isOpen
            ? 'bg-white text-text border border-black/5 rotate-90'
            : 'bg-[#7C83F5] text-white'
        }`}
        aria-label={isOpen ? 'Close MindMate chat' : 'Open MindMate chat'}
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform" />
        ) : (
          <div className="w-full h-full rounded-[24px] overflow-hidden group-hover:scale-110 transition-transform">
            <MindMateAvatar className="w-full h-full" />
          </div>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-10rem)] bg-white/95 backdrop-blur-xl rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="px-6 py-5 bg-[#7C83F5] text-white flex items-center gap-4 flex-shrink-0">
            <div className="w-12 h-12 bg-white/20 rounded-[16px] overflow-hidden flex items-center justify-center backdrop-blur-sm shadow-sm border border-white/30">
              <MindMateAvatar className="w-full h-full" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-base">MindMate</h3>
              <p className="text-xs text-white/90 font-medium tracking-wide">Your wellness companion</p>
            </div>
            <div className="w-3 h-3 bg-[#91A84F] rounded-full animate-pulse border border-white/50" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scroll bg-[#F8F7F4]/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[85%] px-5 py-3.5 text-[15px] leading-relaxed ${
                  msg.from === 'user'
                    ? 'bg-[#7C83F5] text-white rounded-2xl rounded-br-md font-semibold shadow-sm'
                    : 'bg-white text-text rounded-2xl rounded-bl-md shadow-sm font-medium border-transparent'
                }`} style={{ whiteSpace: 'pre-line' }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white text-text rounded-2xl rounded-bl-md border border-transparent shadow-sm px-6 py-4">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#7C83F5]/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#7C83F5]/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#7C83F5]/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className="px-5 py-4 bg-[#F8F7F4]/90 border-t border-black/5 flex flex-wrap gap-2">
              {quickReplies.map((qr) => (
                <button
                  key={qr.action}
                  onClick={() => handleQuickReply(qr.action)}
                  className="px-4 py-2 bg-white border-transparent rounded-full text-xs font-bold text-text hover:bg-[#7C83F5] hover:text-white transition-all duration-200 shadow-sm"
                >
                  {qr.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-5 py-4 bg-white border-t border-black/5 flex items-center gap-3 flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 px-5 py-3.5 bg-[#F8F7F4] border-transparent rounded-full text-[15px] focus:outline-none focus:ring-2 focus:ring-[#7C83F5]/40 placeholder:text-text/40 font-medium transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-12 h-12 rounded-full bg-[#7C83F5] text-white flex items-center justify-center hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
