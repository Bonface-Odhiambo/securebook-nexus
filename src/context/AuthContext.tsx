import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType } from '@/lib/types';
import { login as apiLogin, signup as apiSignup } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => { throw new Error('Not implemented') },
  signup: async () => { throw new Error('Not implemented') },
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state changed:', event, newSession);
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

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Retrieved session:', currentSession);
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

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Login attempt:', email);
      const userData = await apiLogin(email, password);
      setUser(userData);
      localStorage.setItem('auth_token', userData.token);
      return userData;
    } catch (err) {
      console.error('Login failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      toast({
        title: "Authentication failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Signup attempt:', email);
      const userData = await apiSignup(username, email, password);
      setUser(userData);
      localStorage.setItem('auth_token', userData.token);
      return userData;
    } catch (err) {
      console.error('Signup failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      setError(errorMessage);
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
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
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (err) {
      console.error('Logout error:', err);
      toast({
        title: "Logout failed",
        description: "There was a problem logging you out",
        variant: "destructive",
      });
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
