
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType } from '@/lib/types';
import { login as apiLogin, signup as apiSignup } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  isLoading: false,
  error: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        if (newSession) {
          const userData: User = {
            id: newSession.user.id,
            username: newSession.user.user_metadata.username || newSession.user.email?.split('@')[0] || '',
            email: newSession.user.email || '',
            token: newSession.access_token,
          };
          setUser(userData);
          localStorage.setItem('auth_token', newSession.access_token);
        } else {
          setUser(null);
          localStorage.removeItem('auth_token');
        }
        setIsLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession) {
        const userData: User = {
          id: currentSession.user.id,
          username: currentSession.user.user_metadata.username || currentSession.user.email?.split('@')[0] || '',
          email: currentSession.user.email || '',
          token: currentSession.access_token,
        };
        setUser(userData);
        localStorage.setItem('auth_token', currentSession.access_token);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await apiLogin(email, password);
      setUser(userData);
      localStorage.setItem('auth_token', userData.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await apiSignup(username, email, password);
      setUser(userData);
      localStorage.setItem('auth_token', userData.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem('auth_token');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
