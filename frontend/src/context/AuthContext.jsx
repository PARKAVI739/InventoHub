import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import { useToast } from './ToastContext.jsx';

const STORAGE_KEY = 'inventohub_token';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY) || '');
  const [initializing, setInitializing] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setInitializing(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        const payload = data?.data ?? data;
        if (!payload?.user) {
          throw new Error('Invalid profile response');
        }
        setUser(payload.user);
      } catch (error) {
        setToken('');
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    bootstrap();
  }, [token]);

  const handleAuthSuccess = useCallback((payload, message) => {
    const { token: newToken, user: userData } = payload || {};
    if (!newToken || !userData) {
      throw new Error('Invalid authentication payload');
    }
    setToken(newToken);
    localStorage.setItem(STORAGE_KEY, newToken);
    setUser(userData);
    if (message) {
      showToast(message, { type: 'success' });
    }
  }, [showToast]);

  const login = useCallback(async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    const payload = data?.data ?? data;
    handleAuthSuccess(
      payload,
      payload?.user?.name ? `Welcome back, ${payload.user.name.split(' ')[0]}!` : 'Signed in successfully'
    );
  }, [handleAuthSuccess]);

  const register = useCallback(async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    const authPayload = data?.data ?? data;
    handleAuthSuccess(authPayload, 'Account created successfully');
  }, [handleAuthSuccess]);

  const logout = useCallback(() => {
    setUser(null);
    setToken('');
    localStorage.removeItem(STORAGE_KEY);
    showToast('Signed out successfully', { type: 'info' });
  }, [showToast]);

  const value = useMemo(() => ({
    user,
    token,
    initializing,
    login,
    register,
    logout,
    setUser
  }), [user, token, initializing, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};



