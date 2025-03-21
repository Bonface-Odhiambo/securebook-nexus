
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AddBookFormValues } from '@/lib/schemas/bookSchema';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface MetadataFieldsProps {
  form: UseFormReturn<AddBookFormValues>;
}

const MetadataFields: React.FC<MetadataFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField
        control={form.control}
        name="publishedYear"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Year</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <Input placeholder="Fiction, Science, etc." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="isbn"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ISBN</FormLabel>
            <FormControl>
              <Input placeholder="978-3-16-148410-0" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default MetadataFields;
