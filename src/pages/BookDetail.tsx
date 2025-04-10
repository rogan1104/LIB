
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import BookCover from "@/components/book-detail/BookCover";
import BookInfo from "@/components/book-detail/BookInfo";
import ErrorState from "@/components/book-detail/ErrorState";
import BorrowDialog from "@/components/book-detail/BorrowDialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLibrary } from "@/context/LibraryContext";
import { useAuth } from "@/context/AuthContext";

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { getBookById, borrowBook, isLoading, books } = useLibrary();
  
  const [book, setBook] = useState(id ? getBookById(id) : undefined);
  const [isBorrowDialogOpen, setIsBorrowDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<any[]>([]);
  const [borrowLoading, setBorrowLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const foundBook = getBookById(id);
      if (foundBook) {
        setBook(foundBook);
        // Find related books by same genre instead of author
        const booksByGenre = books ? 
          books.filter(b => 
            b.id !== id && 
            b.genre === foundBook.genre
          ).slice(0, 3) : 
          [];
        setRelatedBooks(booksByGenre);
      } else {
        setError("Book not found");
      }
    }
  }, [id, getBookById, books]);

  const handleBorrow = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to borrow books.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!book) return;

    try {
      setBorrowLoading(true);
      await borrowBook(book.id);
      setIsBorrowDialogOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to borrow book",
        variant: "destructive",
      });
    } finally {
      setBorrowLoading(false);
    }
  };

  if (isLoading) {
    return <ErrorState type="loading" />;
  }

  if (error || !book) {
    return <ErrorState type="notFound" />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="md:col-span-1">
            <BookCover 
              book={book}
              isAuthenticated={isAuthenticated}
              borrowLoading={borrowLoading}
              handleBorrow={handleBorrow}
              setDialogOpen={setIsBorrowDialogOpen}
              dialogOpen={isBorrowDialogOpen}
            />
          </div>
          
          {/* Book Information */}
          <div className="md:col-span-2">
            <BookInfo book={book} />
          </div>
        </div>
        
        {/* Related Books Section - Updated to show books by genre with image and title */}
        {relatedBooks.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">More from {book.genre} genre</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBooks.map(relatedBook => (
                <div 
                  key={relatedBook.id} 
                  onClick={() => navigate(`/books/${relatedBook.id}`)} 
                  className="cursor-pointer group"
                >
                  <div className="relative overflow-hidden rounded-md shadow-md hover:shadow-lg transition-shadow">
                    <img 
                      src={relatedBook.coverImage} 
                      alt={`Cover of ${relatedBook.title}`}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <h3 className="mt-3 font-semibold text-lg group-hover:text-library-primary transition-colors">{relatedBook.title}</h3>
                  <p className="text-gray-600">{relatedBook.author}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Borrow Dialog */}
        <BorrowDialog
          open={isBorrowDialogOpen}
          setOpen={setIsBorrowDialogOpen}
          bookTitle={book.title}
          bookId={book.id}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default BookDetail;
