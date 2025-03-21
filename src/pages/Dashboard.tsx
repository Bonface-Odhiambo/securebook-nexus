import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { getBooks, addBook } from '@/lib/api';
import { Book, AddBookFormData } from '@/lib/types';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import BookCard from '@/components/BookCard';
import AddBookModal from '@/components/AddBookModal';
import { Plus, Search, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const queryClient = useQueryClient();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);
  
  const { data: books = [], isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: getBooks,
  });
  
  const addBookMutation = useMutation({
    mutationFn: addBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setIsAddBookOpen(false);
    },
  });
  
  const handleAddBook = async (data: AddBookFormData) => {
    await addBookMutation.mutateAsync(data);
  };
  
  const filteredBooks = books.filter((book) => 
    book.title.toLowerCase().includes(search.toLowerCase()) || 
    book.author.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-7xl pt-24 pb-16 px-4 sm:px-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold animate-fade-in">My Books</h1>
            <p className="text-muted-foreground mt-1 animate-fade-in delay-100">
              {user?.username}'s personal book collection
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64 animate-fade-in delay-200">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search books..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Button onClick={() => setIsAddBookOpen(true)} className="animate-fade-in delay-300">
              <Plus className="h-4 w-4 mr-2" />
              Add Book
            </Button>
          </div>
        </header>
        
        <Tabs defaultValue="all" className="animate-fade-in delay-400">
          <TabsList className="mb-8">
            <TabsTrigger value="all">All Books</TabsTrigger>
            <TabsTrigger value="reading">Reading</TabsTrigger>
            <TabsTrigger value="to-read">To Read</TabsTrigger>
            <TabsTrigger value="finished">Finished</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Loading your books...</p>
              </div>
            ) : filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredBooks.map((book) => (
                  <div 
                    key={book.id} 
                    className="animate-scale-in"
                  >
                    <BookCard 
                      book={book} 
                      onClick={() => navigate(`/books/${book.id}`)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 animate-fade-in">
                <h3 className="text-xl font-medium mb-2">No books found</h3>
                <p className="text-muted-foreground mb-6">
                  {search ? 'Try a different search term' : 'Start building your collection by adding a book'}
                </p>
                {!search && (
                  <Button onClick={() => setIsAddBookOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Book
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
          
          {/* Other tab contents would have similar structure */}
          <TabsContent value="reading" className="mt-0">
            <div className="text-center py-16 animate-fade-in">
              <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">
                This feature will be available in the next update
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="to-read" className="mt-0">
            <div className="text-center py-16 animate-fade-in">
              <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">
                This feature will be available in the next update
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="finished" className="mt-0">
            <div className="text-center py-16 animate-fade-in">
              <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">
                This feature will be available in the next update
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Dialog open={isAddBookOpen} onOpenChange={setIsAddBookOpen}>
        <AddBookModal 
          onSubmit={handleAddBook} 
          isLoading={addBookMutation.isPending}
        />
      </Dialog>
    </div>
  );
};

export default Dashboard;
