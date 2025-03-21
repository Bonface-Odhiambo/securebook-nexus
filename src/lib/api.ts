
import { Book, User, AddBookFormData } from './types';
import { supabase } from '@/integrations/supabase/client';

// Mock data for demonstration
const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000',
    description: 'A powerful primer on how—and why—some products satisfy customers while others only frustrate them.',
    isbn: '978-0465050659',
    publishedYear: 2013,
    category: 'Design',
    rating: 4.5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=1000',
    description: 'In this work, Kahneman exposes the extraordinary capabilities and also the faults and biases of fast thinking.',
    isbn: '978-0374533557',
    publishedYear: 2011,
    category: 'Psychology',
    rating: 4.7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Creative Selection',
    author: 'Ken Kocienda',
    coverImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000',
    description: "An insider's account of Apple's creative process during the golden years of Steve Jobs.",
    isbn: '978-1250194466',
    publishedYear: 2018,
    category: 'Technology',
    rating: 4.3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth API
export const login = async (email: string, password: string): Promise<User> => {
  await delay(1000);
  
  // Simulate a successful login for demo purposes
  if (email && password) {
    return {
      id: '1',
      username: email.split('@')[0],
      email,
      token: 'mock-jwt-token'
    };
  }
  
  throw new Error('Invalid credentials');
};

export const signup = async (username: string, email: string, password: string): Promise<User> => {
  await delay(1000);
  
  // Simulate a successful signup
  if (username && email && password) {
    return {
      id: '2',
      username,
      email,
      token: 'mock-jwt-token'
    };
  }
  
  throw new Error('Invalid user data');
};

// Books API
export const getBooks = async (): Promise<Book[]> => {
  await delay(800);
  return [...MOCK_BOOKS];
};

export const getBook = async (id: string): Promise<Book> => {
  await delay(500);
  const book = MOCK_BOOKS.find(book => book.id === id);
  
  if (!book) {
    throw new Error('Book not found');
  }
  
  return { ...book };
};

export const addBook = async (bookData: AddBookFormData): Promise<Book> => {
  await delay(1000);
  
  const newBook: Book = {
    id: Math.random().toString(36).substring(2, 9),
    ...bookData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return newBook;
};

export const updateBook = async (id: string, bookData: Partial<Book>): Promise<Book> => {
  await delay(800);
  
  const bookIndex = MOCK_BOOKS.findIndex(book => book.id === id);
  
  if (bookIndex === -1) {
    throw new Error('Book not found');
  }
  
  const updatedBook: Book = {
    ...MOCK_BOOKS[bookIndex],
    ...bookData,
    updatedAt: new Date().toISOString()
  };
  
  return updatedBook;
};

export const deleteBook = async (id: string): Promise<void> => {
  await delay(600);
  // In a real API, we'd delete the book
};
