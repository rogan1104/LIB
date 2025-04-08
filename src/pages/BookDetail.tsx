
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLibrary } from "@/context/LibraryContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Calendar,
  Tag,
  MapPin,
  AlertCircle,
  ArrowLeft,
  Loader2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBookById, borrowBook, isLoading: libraryLoading } = useLibrary();
  const { isAuthenticated } = useAuth();
  
  const [borrowLoading, setBorrowLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const book = id ? getBookById(id) : undefined;
  
  const handleBorrow = async () => {
    if (!book || !isAuthenticated) return;
    
    setBorrowLoading(true);
    try {
      await borrowBook(book.id);
      setDialogOpen(true);
    } catch (error) {
      console.error(error);
    } finally {
      setBorrowLoading(false);
    }
  };
  
  if (libraryLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-library-primary" />
            <p className="text-muted-foreground">Loading book details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!book) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Book Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The book you are looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => navigate("/books")}
            className="bg-library-primary hover:bg-library-secondary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Books
          </Button>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Book Cover */}
            <div className="md:col-span-1">
              <div className="overflow-hidden rounded-lg shadow-lg">
                <img
                  src={book.coverImage}
                  alt={`Cover of ${book.title}`}
                  className="w-full h-auto object-cover"
                />
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-library-primary" />
                    Location
                  </h3>
                  <p className="text-sm">{book.location}</p>
                </div>
                
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="font-semibold mb-2">Availability</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Total Copies:</span>
                      <p className="font-medium">{book.copies}</p>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Available:</span>
                      <p className="font-medium">{book.availableCopies}</p>
                    </div>
                  </div>
                </div>
                
                {isAuthenticated && (
                  <Button
                    onClick={handleBorrow}
                    disabled={book.availableCopies === 0 || borrowLoading}
                    className="w-full bg-library-primary hover:bg-library-secondary"
                  >
                    {borrowLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <BookOpen className="mr-2 h-4 w-4" />
                        {book.availableCopies > 0 ? "Borrow This Book" : "Not Available"}
                      </>
                    )}
                  </Button>
                )}
                
                {!isAuthenticated && (
                  <Button
                    onClick={() => navigate("/login")}
                    className="w-full bg-library-primary hover:bg-library-secondary"
                  >
                    Log In to Borrow
                  </Button>
                )}
                
                {/* Success Dialog */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Book Borrowed Successfully!</DialogTitle>
                      <DialogDescription>
                        You have successfully borrowed "{book.title}". The due date is 14 days from today.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        onClick={() => {
                          setDialogOpen(false);
                          navigate("/my-books");
                        }}
                        className="bg-library-primary hover:bg-library-secondary"
                      >
                        View My Books
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            {/* Book Details */}
            <div className="md:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-library-accent text-library-primary">
                  {book.genre}
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{book.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">by {book.author}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Tag className="h-5 w-5 mr-2 text-library-primary" />
                  <span>ISBN: {book.isbn}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-library-primary" />
                  <span>Published: {book.publishYear}</span>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="mb-6 text-lg leading-relaxed">{book.description}</p>
                
                <div className="mt-8 bg-muted p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">About the Author</h2>
                  <p className="text-lg leading-relaxed">
                    {book.author} is the acclaimed author of "{book.title}". 
                    Their work spans across various genres and has been translated into multiple languages.
                  </p>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">You might also like</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* We would normally fetch related books here */}
                    {/* For demo, we'll just show placeholder elements */}
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div 
                        key={idx}
                        className="rounded-lg bg-white shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => navigate(`/books/book-${(parseInt(book.id.split('-')[1]) % 25) + idx + 1}`)}
                      >
                        <div className="h-24 bg-library-accent rounded mb-2"></div>
                        <p className="font-medium truncate">Related Book {idx + 1}</p>
                        <p className="text-xs text-muted-foreground">Similar Genre</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BookDetail;
