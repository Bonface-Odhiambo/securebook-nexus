
import React from 'react';
import { AddBookFormData } from '@/lib/types';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BookForm from '@/components/BookForm/BookForm';

interface AddBookModalProps {
  onSubmit: (data: AddBookFormData) => Promise<void>;
  isLoading: boolean;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ onSubmit, isLoading }) => {
  return (
    <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">Add New Book</DialogTitle>
      </DialogHeader>
      
      <BookForm onSubmit={onSubmit} isLoading={isLoading} />
    </DialogContent>
  );
};

export default AddBookModal;
