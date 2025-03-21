
import { Book, User, AddBookFormData } from './types';
import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';

// API client setup (fallback for existing Spring backend)
const API_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
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

// Books API
export const getBooks = async (): Promise<Book[]> => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      coverImage: book.cover_image || '',
      description: book.description || '',
      isbn: book.isbn || '',
      publishedYear: book.published_year || new Date().getFullYear(),
      category: book.category || '',
      rating: book.rating || undefined,
      createdAt: book.created_at,
      updatedAt: book.updated_at,
    }));
  } catch (error) {
    console.error('Error fetching books:', error);
    throw new Error('Failed to fetch books');
  }
};

export const getBook = async (id: string): Promise<Book> => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      author: data.author,
      coverImage: data.cover_image || '',
      description: data.description || '',
      isbn: data.isbn || '',
      publishedYear: data.published_year || new Date().getFullYear(),
      category: data.category || '',
      rating: data.rating || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error fetching book:', error);
    throw new Error('Book not found');
  }
};

export const addBook = async (bookData: AddBookFormData): Promise<Book> => {
  try {
    const { data, error } = await supabase
      .from('books')
      .insert({
        title: bookData.title,
        author: bookData.author,
        cover_image: bookData.coverImage,
        description: bookData.description,
        isbn: bookData.isbn,
        published_year: bookData.publishedYear,
        category: bookData.category,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      author: data.author,
      coverImage: data.cover_image || '',
      description: data.description || '',
      isbn: data.isbn || '',
      publishedYear: data.published_year || new Date().getFullYear(),
      category: data.category || '',
      rating: data.rating || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error adding book:', error);
    throw new Error('Failed to add book');
  }
};

export const updateBook = async (id: string, bookData: Partial<Book>): Promise<Book> => {
  try {
    const { data, error } = await supabase
      .from('books')
      .update({
        title: bookData.title,
        author: bookData.author,
        cover_image: bookData.coverImage,
        description: bookData.description,
        isbn: bookData.isbn,
        published_year: bookData.publishedYear,
        category: bookData.category,
        rating: bookData.rating,
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      author: data.author,
      coverImage: data.cover_image || '',
      description: data.description || '',
      isbn: data.isbn || '',
      publishedYear: data.published_year || new Date().getFullYear(),
      category: data.category || '',
      rating: data.rating || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error updating book:', error);
    throw new Error('Failed to update book');
  }
};

export const deleteBook = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting book:', error);
    throw new Error('Failed to delete book');
  }
};
