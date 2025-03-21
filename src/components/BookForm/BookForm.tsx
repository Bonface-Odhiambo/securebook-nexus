
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddBookFormData } from '@/lib/types';
import { addBookSchema, AddBookFormValues } from '@/lib/schemas/bookSchema';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Book, BookA, BadgePlus } from 'lucide-react';

import BasicInfoFields from './BasicInfoFields';
import CoverImageField from './CoverImageField';
import MetadataFields from './MetadataFields';
import DescriptionField from './DescriptionField';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface BookFormProps {
  onSubmit: (data: AddBookFormData) => Promise<void>;
  isLoading: boolean;
}

// Sample book data with great images
const sampleBooks = [
  {
    title: "The Art of Programming",
    author: "Robert C. Martin",
    coverImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    description: "A comprehensive guide to writing clean, maintainable code that scales. Covers best practices and design patterns for modern software development.",
    isbn: "9781234567897",
    publishedYear: 2021,
    category: "Programming",
  },
  {
    title: "Digital Nomad",
    author: "Emma Wilson",
    coverImage: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    description: "Explore the world of remote work and location independence. This book provides practical tips for living and working from anywhere in the world.",
    isbn: "9781234567890",
    publishedYear: 2020,
    category: "Lifestyle",
  },
  {
    title: "Code Masters",
    author: "James Johnson",
    coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    description: "The definitive guide to mastering multiple programming languages and becoming a versatile developer in today's tech landscape.",
    isbn: "9781234567891",
    publishedYear: 2022,
    category: "Programming",
  },
  {
    title: "Digital Revolution",
    author: "Sarah Chen",
    coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    description: "An exploration of how technology is transforming society, business, and our everyday lives. A must-read for understanding our digital future.",
    isbn: "9781234567892",
    publishedYear: 2019,
    category: "Technology",
  },
  {
    title: "Quantum Computing",
    author: "Michael Zhang",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    description: "An introduction to the fascinating world of quantum computing, explaining complex concepts in an accessible way for non-physicists.",
    isbn: "9781234567893",
    publishedYear: 2023,
    category: "Science",
  },
];

const BookForm: React.FC<BookFormProps> = ({ onSubmit, isLoading }) => {
  const form = useForm<AddBookFormValues>({
    resolver: zodResolver(addBookSchema),
    defaultValues: {
      title: '',
      author: '',
      coverImage: '',
      description: '',
      isbn: '',
      publishedYear: new Date().getFullYear(),
      category: '',
    },
  });

  const handleSubmit = async (data: AddBookFormValues) => {
    try {
      // Make sure we're passing a complete AddBookFormData object
      // If coverImage is empty, provide a default empty string
      const bookData: AddBookFormData = {
        title: data.title,
        author: data.author,
        coverImage: data.coverImage || '',
        description: data.description,
        isbn: data.isbn,
        publishedYear: data.publishedYear,
        category: data.category,
      };
      
      await onSubmit(bookData);
      form.reset();
      toast({
        title: "Book added",
        description: "Your book has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding book:', error);
      toast({
        title: "Failed to add book",
        description: "There was an error adding your book. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fillSampleBook = (book: typeof sampleBooks[0]) => {
    form.reset(book);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex justify-end mb-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <BookA className="h-4 w-4 mr-2" />
                  Sample Books
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[250px]">
                <DropdownMenuLabel>Choose a sample book</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {sampleBooks.map((book, index) => (
                  <DropdownMenuItem key={index} onClick={() => fillSampleBook(book)}>
                    {book.title} by {book.author}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <BasicInfoFields form={form} />
          <CoverImageField form={form} />
          <MetadataFields form={form} />
          <DescriptionField form={form} />
        </div>
        
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Book className="mr-2 h-4 w-4" />
                Add Book
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BookForm;
