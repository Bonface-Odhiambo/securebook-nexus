
export interface User {
  id: string;
  username: string;
  email: string;
  token: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  isbn: string;
  publishedYear: number;
  category: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

export interface AuthFormProps {
  mode: 'login' | 'signup';
  onSuccess?: () => void;
}

export interface BookCardProps {
  book: Book;
  onClick?: () => void;
}

export interface AddBookFormData {
  title: string;
  author: string;
  coverImage: string;
  description: string;
  isbn: string;
  publishedYear: number;
  category: string;
}
