
// Main API module that re-exports all API functions
import apiClient from './apiClient';
import { login, signup } from './api/auth';
import { 
  getBooks, 
  getBook, 
  addBook, 
  updateBook, 
  deleteBook 
} from './api/books';

// Re-export everything
export {
  apiClient,
  // Auth
  login,
  signup,
  // Books
  getBooks,
  getBook,
  addBook,
  updateBook,
  deleteBook
};
