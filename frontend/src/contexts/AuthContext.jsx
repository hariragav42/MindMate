import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to format a friendly readable username from email or full_name
  const formatDisplayName = (fullName, email) => {
    if (fullName && fullName.trim()) {
      return fullName.trim();
    }
    if (email) {
      const handle = email.split('@')[0];
      // Clean up dots, numbers, underscores and capitalize
      const clean = handle.replace(/[._\d]+/g, ' ').trim();
      if (clean) {
        return clean.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      }
      return handle.charAt(0).toUpperCase() + handle.slice(1);
    }
    return 'Friend';
  };

  const fetchUserDetails = async (token, role, userId, email) => {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Fetch me and profile in parallel
      const [meRes, profileRes] = await Promise.allSettled([
        api.get('/api/auth/me'),
        api.get('/api/profile')
      ]);

      const userEmail = meRes.status === 'fulfilled' ? meRes.value.data.email : (email || localStorage.getItem('email') || '');
      const profileData = profileRes.status === 'fulfilled' ? profileRes.value.data : {};
      const fullName = profileData?.full_name || '';
      const name = formatDisplayName(fullName, userEmail);

      const updatedUser = {
        token,
        role,
        id: userId,
        email: userEmail,
        full_name: fullName,
        name: name,
        profile: profileData
      };

      setUser(updatedUser);
      if (userEmail) localStorage.setItem('email', userEmail);
      if (name) localStorage.setItem('name', name);
    } catch (err) {
      console.error('Failed to load user details:', err);
      const fallbackEmail = email || localStorage.getItem('email') || '';
      const fallbackName = localStorage.getItem('name') || formatDisplayName('', fallbackEmail);
      setUser({ token, role, id: userId, email: fallbackEmail, name: fallbackName });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const user_id = localStorage.getItem('user_id');
    const email = localStorage.getItem('email');
    
    if (token && role && user_id) {
      fetchUserDetails(token, role, user_id, email).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await api.post('/api/auth/login', formData);
    const { access_token, role, user_id } = response.data;
    
    localStorage.setItem('token', access_token);
    localStorage.setItem('role', role);
    localStorage.setItem('user_id', user_id);
    localStorage.setItem('email', email);
    
    await fetchUserDetails(access_token, role, user_id, email);
  };

  const register = async (email, password, fullName) => {
    await api.post('/api/auth/register', { email, password });
    await login(email, password);
    
    if (fullName) {
      await api.put('/api/profile', { full_name: fullName });
      // Refresh user details to get the new name
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const user_id = localStorage.getItem('user_id');
      await fetchUserDetails(token, role, user_id, email);
    }
  };



  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser: () => user && fetchUserDetails(user.token, user.role, user.id, user.email) }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
