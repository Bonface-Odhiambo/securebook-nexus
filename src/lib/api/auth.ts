
import { User } from '../types';
import { supabase } from '@/integrations/supabase/client';

export const login = async (email: string, password: string): Promise<User> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Login error from Supabase:', error);
      throw new Error(error.message || 'Invalid credentials');
    }
    
    if (!data.user || !data.session) {
      throw new Error('No user or session returned from authentication provider');
    }
    
    return {
      id: data.user.id,
      username: data.user.user_metadata.username || email.split('@')[0],
      email: data.user.email!,
      token: data.session.access_token,
    };
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Invalid credentials');
    }
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
    
    if (error) {
      console.error('Signup error from Supabase:', error);
      throw new Error(error.message || 'Failed to create account');
    }
    
    if (!data.user) {
      throw new Error('No user returned from authentication provider');
    }
    
    // If email confirmation is not required, we'll have a session
    if (data.session) {
      return {
        id: data.user.id,
        username,
        email: data.user.email!,
        token: data.session.access_token,
      };
    }
    
    // If we don't have a session but the signup succeeded, it means email confirmation is required
    throw new Error('Please check your email to confirm your account before logging in');
  } catch (error) {
    console.error('Signup error:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Failed to create account');
    }
  }
};
