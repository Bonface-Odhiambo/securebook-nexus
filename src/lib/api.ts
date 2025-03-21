
import { Book, User, AddBookFormData } from './types';
import axios from 'axios';

// API client setup
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
    const response = await apiClient.post('/auth/login', { email, password });
    
    // Store the token in localStorage for later use
    localStorage.setItem('auth_token', response.data.token);
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Invalid credentials');
  }
};

export const signup = async (username: string, email: string, password: string): Promise<User> => {
  try {
    const response = await apiClient.post('/auth/signup', { username, email, password });
    
    // Store the token in localStorage for later use
    localStorage.setItem('auth_token', response.data.token);
    
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw new Error('Failed to create account');
  }
};

// Books API
export const getBooks = async (): Promise<Book[]> => {
  try {
    const response = await apiClient.get('/books');
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw new Error('Failed to fetch books');
  }
};

export const getBook = async (id: string): Promise<Book> => {
  try {
    const response = await apiClient.get(`/books/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching book:', error);
    throw new Error('Book not found');
  }
};

export const addBook = async (bookData: AddBookFormData): Promise<Book> => {
  try {
    const response = await apiClient.post('/books', bookData);
    return response.data;
  } catch (error) {
    console.error('Error adding book:', error);
    throw new Error('Failed to add book');
  }
};

export const updateBook = async (id: string, bookData: Partial<Book>): Promise<Book> => {
  try {
    const response = await apiClient.put(`/books/${id}`, bookData);
    return response.data;
  } catch (error) {
    console.error('Error updating book:', error);
    throw new Error('Failed to update book');
  }
};

export const deleteBook = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/books/${id}`);
  } catch (error) {
    console.error('Error deleting book:', error);
    throw new Error('Failed to delete book');
  }
};
