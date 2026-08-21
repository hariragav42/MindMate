import React, { useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from './contexts/AuthContext'
import Sidebar from './components/Sidebar'
import Chatbot from './components/Chatbot'
import { ChevronLeft } from 'lucide-react'
import { CornerLeaves } from './components/Illustrations'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Assessment from './pages/Assessment'
import Result from './pages/Result'
import MoodBooster from './pages/MoodBooster'
import Resources from './pages/Resources'
import History from './pages/History'
import Profile from './pages/Profile'
import Journal from './pages/Journal'
import Admin from './pages/Admin'

const PrivateRoute = ({ children, roleRequired }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (roleRequired && user.role !== roleRequired) return <Navigate to="/dashboard" />;
  return children;
};

// Layout component to handle Sidebar + Main Content + Back Button
const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  // Don't show sidebar on landing, login, register
  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);

  // Don't show back button on root, login, register, or dashboard
  const showBackButton = !['/', '/login', '/register', '/dashboard'].includes(location.pathname) && user;

  if (isPublicPage) {
    return <main className="flex-1 flex flex-col">{children}</main>;
  }

  return (
    <div className="flex flex-1 overflow-hidden relative bg-background p-2 lg:p-4">
      {/* Decorative corner leaves from reference image */}
      <div className="fixed bottom-0 left-0 pointer-events-none z-0">
        <CornerLeaves position="bottom-left" className="w-36 h-36 lg:w-48 lg:h-48" />
      </div>
      <div className="fixed bottom-0 right-0 pointer-events-none z-0">
        <CornerLeaves position="bottom-right" className="w-36 h-36 lg:w-48 lg:h-48" />
      </div>
      {/* Top right subtle warm blob */}
      <div className="fixed -top-12 -right-12 w-64 h-64 bg-[#FF874B]/20 rounded-full blur-3xl pointer-events-none z-0" />
      
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-y-auto bg-transparent custom-scroll z-10 relative">
        {showBackButton && (
          <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-md px-6 py-4 animate-fade-in flex items-center">
             <button
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 bg-white text-[#1E1E1E] rounded-full shadow-soft hover:shadow-soft-hover border border-white/50 flex items-center gap-2 font-bold text-sm transition-all"
            >
              <ChevronLeft className="w-5 h-5" /> Back
            </button>
          </div>
        )}
        <div className="flex-1 flex flex-col min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
};

// Only show floating chatbot on subpages (on dashboard it's embedded in 3rd column)
const ChatbotWrapper = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);
  const isDashboard = location.pathname === '/dashboard';
  if (!user || isPublicPage || isDashboard) return null;
  return <Chatbot />;
};

function App() {
  return (
    <Router>
      <div className="h-screen w-full flex flex-col bg-background font-sans overflow-hidden select-none">
        <MainLayout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/assessment" element={<PrivateRoute><Assessment /></PrivateRoute>} />
            <Route path="/result" element={<PrivateRoute><Result /></PrivateRoute>} />
            <Route path="/mood-booster" element={<PrivateRoute><MoodBooster /></PrivateRoute>} />
            <Route path="/resources" element={<PrivateRoute><Resources /></PrivateRoute>} />
            <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
            <Route path="/journal" element={<PrivateRoute><Journal /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            
            <Route path="/admin" element={<PrivateRoute roleRequired="admin"><Admin /></PrivateRoute>} />
          </Routes>
        </MainLayout>
        <ChatbotWrapper />
      </div>
    </Router>
  )
}

export default App
