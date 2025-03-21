
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AddBookFormValues } from '@/lib/schemas/bookSchema';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Image } from 'lucide-react';

interface CoverImageFieldProps {
  form: UseFormReturn<AddBookFormValues>;
}

const CoverImageField: React.FC<CoverImageFieldProps> = ({ form }) => {
  const imageUrl = form.watch('coverImage');
  
  return (
    <FormField
      control={form.control}
      name="coverImage"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-1">
            <Image className="h-4 w-4" />
            <span>Cover Image URL (optional)</span>
          </FormLabel>
          <FormControl>
            <Input placeholder="https://example.com/cover.jpg" {...field} />
          </FormControl>
          {imageUrl && (
            <div className="mt-2">
              <img 
                src={imageUrl} 
                alt="Book cover preview" 
                className="max-h-40 object-cover rounded-md border border-border"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
          )}
          <FormDescription>
            Enter a URL for the book cover image. The preview will appear here.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CoverImageField;
