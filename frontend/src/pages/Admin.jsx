import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Shield, Users, BookOpen, HelpCircle, BarChart3, Plus, Trash2, Edit3, X, Save, Loader2 } from 'lucide-react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ users: 0, resources: 0, questions: 0 });
  const [users, setUsers] = useState([]);
  const [resources, setResources] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, resourcesRes, questionsRes] = await Promise.all([
        api.get('/api/admin/users').catch(() => ({ data: [] })),
        api.get('/api/resources').catch(() => ({ data: [] })),
        api.get('/api/questions').catch(() => ({ data: [] })),
      ]);
      setUsers(usersRes.data);
      setResources(resourcesRes.data);
      setQuestions(questionsRes.data);
      setStats({
        users: usersRes.data.length,
        resources: resourcesRes.data.length,
        questions: questionsRes.data.length,
      });
    } catch (err) {
      console.error('Admin data fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'questions', label: 'Questions', icon: HelpCircle },
  ];

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh] relative z-10">
        <div className="w-10 h-10 border-4 border-surface border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="page-container relative z-10">
      <div className="flex items-center gap-4 mb-10 animate-fade-in">
        <div className="w-16 h-16 bg-[#7C83F5]/20 rounded-[24px] flex items-center justify-center shadow-soft border border-white/50">
          <Shield className="w-8 h-8 text-[#7C83F5]" />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-text tracking-tight">Admin Dashboard</h1>
          <p className="text-base text-text/70 mt-1 font-medium">Manage your application</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white/50 p-2 rounded-full mb-10 max-w-xl overflow-x-auto border border-white/40 shadow-inner">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300
              ${activeTab === tab.id ? 'bg-primary shadow-sm text-white' : 'text-text/50 hover:text-text hover:bg-white/80'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="animate-fade-in">
          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            <div className="card-glow border-transparent bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center border border-white/50">
                  <Users className="w-6 h-6 text-[#91A84F]" />
                </div>
                <span className="text-sm text-text/60 font-bold uppercase tracking-wider">Total Users</span>
              </div>
              <div className="text-5xl font-black text-text">{stats.users}</div>
            </div>
            <div className="card-glow border-transparent bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center border border-white/50">
                  <BookOpen className="w-6 h-6 text-[#FF874B]" />
                </div>
                <span className="text-sm text-text/60 font-bold uppercase tracking-wider">Resources</span>
              </div>
              <div className="text-5xl font-black text-text">{stats.resources}</div>
            </div>
            <div className="card-glow border-transparent bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center border border-white/50">
                  <HelpCircle className="w-6 h-6 text-[#C98CEB]" />
                </div>
                <span className="text-sm text-text/60 font-bold uppercase tracking-wider">Questions</span>
              </div>
              <div className="text-5xl font-black text-text">{stats.questions}</div>
            </div>
          </div>

          {/* Recent Users */}
          <div className="card border-transparent bg-white shadow-sm">
            <h2 className="text-2xl font-bold text-text mb-6">Recent Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-text/50 border-b border-black/5">
                    <th className="pb-4 font-bold uppercase tracking-wider text-xs">Email</th>
                    <th className="pb-4 font-bold uppercase tracking-wider text-xs">Role</th>
                    <th className="pb-4 font-bold uppercase tracking-wider text-xs">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 10).map((u) => (
                    <tr key={u.id} className="border-b border-black/5 hover:bg-black/5 transition-colors">
                      <td className="py-4 font-semibold text-text">{u.email}</td>
                      <td className="py-4">
                        <span className={`badge ${u.role === 'admin' ? 'bg-[#FF874B]/10 text-[#FF874B] border border-[#FF874B]/20' : 'bg-[#91A84F]/10 text-[#91A84F] border border-[#91A84F]/30'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 text-text/50 font-medium">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="card animate-fade-in border-transparent bg-white shadow-sm">
          <h2 className="text-2xl font-bold text-text mb-6">All Users ({users.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-text/50 border-b border-black/5">
                  <th className="pb-4 font-bold uppercase tracking-wider text-xs">ID</th>
                  <th className="pb-4 font-bold uppercase tracking-wider text-xs">Email</th>
                  <th className="pb-4 font-bold uppercase tracking-wider text-xs">Role</th>
                  <th className="pb-4 font-bold uppercase tracking-wider text-xs">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-black/5 hover:bg-black/5 transition-colors">
                    <td className="py-4 text-text/50 font-mono text-xs">#{u.id}</td>
                    <td className="py-4 font-semibold text-text">{u.email}</td>
                    <td className="py-4">
                      <span className={`badge ${u.role === 'admin' ? 'bg-[#FF874B]/10 text-[#FF874B] border border-[#FF874B]/20' : 'bg-[#91A84F]/10 text-[#91A84F] border border-[#91A84F]/30'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 text-text/50 font-medium">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div className="card animate-fade-in border-transparent bg-white shadow-sm">
          <h2 className="text-2xl font-bold text-text mb-6">All Resources ({resources.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-text/50 border-b border-black/5">
                  <th className="pb-4 font-bold uppercase tracking-wider text-xs">Title</th>
                  <th className="pb-4 font-bold uppercase tracking-wider text-xs">Category</th>
                  <th className="pb-4 font-bold uppercase tracking-wider text-xs">Duration</th>
                  <th className="pb-4 font-bold uppercase tracking-wider text-xs">Type</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((r) => (
                  <tr key={r.id} className="border-b border-black/5 hover:bg-black/5 transition-colors">
                    <td className="py-4 font-semibold text-text">{r.title}</td>
                    <td className="py-4">
                      <span className="badge bg-[#91A84F]/10 text-[#91A84F] border border-[#91A84F]/30">{r.category}</span>
                    </td>
                    <td className="py-4 text-text/50 font-medium">{r.duration_min} min</td>
                    <td className="py-4 text-text/50 font-medium">{r.content_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="card animate-fade-in border-transparent bg-white shadow-sm">
          <h2 className="text-2xl font-bold text-text mb-6">All Questions ({questions.length})</h2>
          <div className="flex flex-col gap-4">
            {questions.map((q, i) => (
              <div key={q.id} className="p-5 border border-black/5 rounded-[24px] hover:bg-black/5 transition-colors bg-surface/30">
                <div className="flex items-start gap-4">
                  <span className="w-10 h-10 bg-white border border-white/50 rounded-[16px] flex items-center justify-center text-sm font-black text-text flex-shrink-0 mt-0.5">
                    {q.order_no || i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-text leading-relaxed">{q.text}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="badge bg-white text-text/60 border border-white/50">{q.type}</span>
                      <span className={`badge ${q.active ? 'bg-[#91A84F]/10 text-[#91A84F] border border-[#91A84F]/30' : 'bg-white text-text/40 border border-white/50'}`}>
                        {q.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
