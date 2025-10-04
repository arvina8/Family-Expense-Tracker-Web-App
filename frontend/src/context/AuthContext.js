import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [memberships, setMemberships] = useState([]); // raw memberships from API
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedGroup = localStorage.getItem('currentGroup');
    if (token) {
      client.get('/auth/me')
        .then(res => {
          setUser(res.data.user);
          const mships = res.data.user.memberships || [];
          setMemberships(mships);
          const groups = mships.map(m => m.group).filter(Boolean);
          const initial = savedGroup || (groups[0]?._id || null);
          setCurrentGroup(initial);
          if (initial) localStorage.setItem('currentGroup', initial); else localStorage.removeItem('currentGroup');
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await client.get('/auth/me');
      setUser(res.data.user);
      const mships = res.data.user.memberships || [];
      setMemberships(mships);
      // Don't override currentGroup if still part of memberships; if not, pick first.
      const groups = mships.map(m => m.group).filter(Boolean);
      if (!currentGroup || !groups.find(g => g._id === currentGroup)) {
        const fallback = groups[0]?._id || null;
        setCurrentGroup(fallback);
        if (fallback) localStorage.setItem('currentGroup', fallback); else localStorage.removeItem('currentGroup');
      }
      return res.data.user;
    } catch (e) {
      console.error('Failed to refresh user', e);
      throw e;
    }
  }, [currentGroup]);

  const login = async (email, password) => {
    const res = await client.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    const mships = res.data.user.memberships || [];
    setMemberships(mships);
    const groups = mships.map(m => m.group).filter(Boolean);
    const initial = groups[0]?._id || null;
    setCurrentGroup(initial);
    if (initial) localStorage.setItem('currentGroup', initial); else localStorage.removeItem('currentGroup');
    return res.data.user;
  };

  const register = async (name, email, password) => {
    const res = await client.post('/auth/register', { name, email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    const mships = res.data.user.memberships || [];
    setMemberships(mships);
    const groups = mships.map(m => m.group).filter(Boolean);
    const initial = groups[0]?._id || null;
    setCurrentGroup(initial);
    if (initial) localStorage.setItem('currentGroup', initial); else localStorage.removeItem('currentGroup');
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCurrentGroup(null);
    setMemberships([]);
  };

  const switchGroup = (groupId) => {
    setCurrentGroup(groupId);
    if (groupId) localStorage.setItem('currentGroup', groupId);
  };

  return (
    <AuthContext.Provider value={{ user, memberships, currentGroup, setCurrentGroup: switchGroup, login, register, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
