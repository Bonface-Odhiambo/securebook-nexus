
import { z } from 'zod';

export const addBookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  coverImage: z.string().url({ message: 'Must be a valid URL' }).optional().or(z.literal('')),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  isbn: z.string().min(10, 'ISBN must be at least 10 characters'),
  publishedYear: z.coerce.number()
    .min(1000, 'Year must be at least 1000')
    .max(new Date().getFullYear(), `Year cannot be later than ${new Date().getFullYear()}`),
  category: z.string().min(1, 'Category is required'),
});

export type AddBookFormValues = z.infer<typeof addBookSchema>;
