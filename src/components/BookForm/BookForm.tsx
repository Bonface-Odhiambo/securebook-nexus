
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddBookFormData } from '@/lib/types';
import { addBookSchema, AddBookFormValues } from '@/lib/schemas/bookSchema';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Book } from 'lucide-react';

import BasicInfoFields from './BasicInfoFields';
import CoverImageField from './CoverImageField';
import MetadataFields from './MetadataFields';
import DescriptionField from './DescriptionField';

interface BookFormProps {
  onSubmit: (data: AddBookFormData) => Promise<void>;
  isLoading: boolean;
}

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
        <div className="grid grid-cols-1 gap-4">
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
