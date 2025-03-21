
import { Book, AddBookFormData } from '../types';
import { supabase } from '@/integrations/supabase/client';

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
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('You must be logged in to add a book');
    }
    
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
        user_id: session.user.id, // Add the user_id from the current session
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
