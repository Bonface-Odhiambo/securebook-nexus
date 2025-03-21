
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBook } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import { ArrowLeft, Star, Clock, BookOpen, Trash2, Edit } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);
  
  const { data: book, isLoading, error } = useQuery({
    queryKey: ['book', id],
    queryFn: () => getBook(id!),
    enabled: !!id && isAuthenticated,
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-4xl pt-24 pb-16 px-4">
          <div className="animate-pulse">
            <div className="h-6 w-24 bg-muted rounded mb-2"></div>
            <div className="h-9 w-3/4 bg-muted rounded mb-6"></div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3 aspect-[2/3] bg-muted rounded"></div>
              <div className="w-full md:w-2/3">
                <div className="h-5 w-20 bg-muted rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted rounded"></div>
                  <div className="h-4 w-full bg-muted rounded"></div>
                  <div className="h-4 w-2/3 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !book) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-4xl pt-24 pb-16 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Book Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The book you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-4xl pt-24 pb-16 px-4">
        <div className="mb-8 animate-fade-in">
          <Button 
            variant="ghost" 
            className="pl-0 hover:pl-1 transition-all duration-200"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Book Cover */}
          <div className="w-full md:w-1/3 max-w-xs mx-auto md:mx-0 animate-fade-in">
            <div className="aspect-[2/3] rounded-lg overflow-hidden bg-secondary shadow-elevation relative">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={`Cover of ${book.title}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                  No Cover
                </div>
              )}
              
              {book.rating && (
                <div className="absolute top-3 right-3 flex items-center backdrop-blur-md bg-black/20 text-white px-3 py-1.5 rounded-full">
                  <Star className="h-4 w-4 mr-1.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{book.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            <div className="mt-6 space-y-3 animate-fade-in delay-200">
              <Button variant="outline" className="w-full justify-start">
                <Clock className="h-4 w-4 mr-2" />
                Mark as Reading
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Book
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete {book.title} from your library.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          {/* Book Details */}
          <div className="w-full md:w-2/3 animate-fade-in delay-100">
            <Badge variant="outline" className="mb-3">
              {book.category}
            </Badge>
            
            <h1 className="text-3xl font-bold leading-tight mb-2">{book.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">by {book.author}</p>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
              <div>Published {book.publishedYear}</div>
              <Separator orientation="vertical" className="h-4" />
              <div>ISBN: {book.isbn}</div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium mb-2">About this book</h2>
                <div className={cn(
                  "relative transition-all duration-300",
                  !showFullDescription && "max-h-36 overflow-hidden"
                )}>
                  <p className="text-muted-foreground">{book.description}</p>
                  
                  {!showFullDescription && (
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
                  )}
                </div>
                
                {book.description.length > 200 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 text-primary hover:text-primary"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? 'Show less' : 'Read more'}
                  </Button>
                )}
              </div>
              
              <Separator />
              
              <div>
                <h2 className="text-lg font-medium mb-4">Book Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  <DetailItem label="Format" value="Hardcover" />
                  <DetailItem label="Language" value="English" />
                  <DetailItem label="ISBN-13" value={book.isbn} />
                  <DetailItem label="Publication Date" value={`${book.publishedYear}`} />
                  <DetailItem label="Category" value={book.category} />
                  <DetailItem label="Pages" value="320" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

interface DetailItemProps {
  label: string;
  value: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => {
  return (
    <div>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
};

export default BookDetail;
