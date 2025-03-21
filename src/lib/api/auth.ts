
import { User } from '../types';
import { supabase } from '@/integrations/supabase/client';

export const login = async (email: string, password: string): Promise<User> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    return {
      id: data.user.id,
      username: data.user.user_metadata.username || email.split('@')[0],
      email: data.user.email!,
      token: data.session.access_token,
    };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Invalid credentials');
  }
};

export const signup = async (username: string, email: string, password: string): Promise<User> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });
    
    if (error) throw error;
    
    if (!data.session) {
      // Email confirmation is required
      throw new Error('Please check your email to confirm your account');
    }
    
    return {
      id: data.user.id,
      username,
      email: data.user.email!,
      token: data.session.access_token,
    };
  } catch (error) {
    console.error('Signup error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create account');
  }
};
