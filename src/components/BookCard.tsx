
import React from 'react';
import { Book } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookCardProps {
  book: Book;
  onClick?: () => void;
  className?: string;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick, className }) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-elevation cursor-pointer h-full",
        className
      )}
      onClick={onClick}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-secondary">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={`Cover of ${book.title}`}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
            No Cover
          </div>
        )}
        
        {book.rating && (
          <div className="absolute top-2 right-2 flex items-center backdrop-blur-md bg-black/20 text-white px-2 py-1 rounded-full text-xs">
            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
            <span>{book.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex flex-col space-y-2">
          <Badge variant="outline" className="self-start mb-1 text-xs">
            {book.category}
          </Badge>
          <h3 className="font-medium leading-tight line-clamp-1">{book.title}</h3>
          <p className="text-sm text-muted-foreground">by {book.author}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
