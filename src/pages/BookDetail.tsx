
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
  const { getBookById, borrowBook, isLoading } = useLibrary();
  
  const [book, setBook] = useState(id ? getBookById(id) : undefined);
  const [isBorrowDialogOpen, setIsBorrowDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      const foundBook = getBookById(id);
      if (foundBook) {
        setBook(foundBook);
        // Find related books by same author
        const booksByAuthor = getBookById ? 
          bookList.filter(b => 
            b.id !== id && 
            b.author === foundBook.author
          ).slice(0, 3) : 
          [];
        setRelatedBooks(booksByAuthor);
      } else {
        setError("Book not found");
      }
    }
  }, [id, getBookById]);

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
      await borrowBook(book.id);
      setIsBorrowDialogOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to borrow book",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !book) {
    return <ErrorState message={error || "Book not found"} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="md:col-span-1">
            <BookCover book={book} />
          </div>
          
          {/* Book Information */}
          <div className="md:col-span-2">
            <BookInfo book={book} />
            
            {/* Borrow Button */}
            <div className="mt-8">
              <Button
                onClick={handleBorrow}
                disabled={book.availableCopies <= 0}
                className="w-full md:w-auto bg-library-primary hover:bg-library-secondary"
                size="lg"
              >
                {book.availableCopies > 0
                  ? "Borrow This Book"
                  : "Currently Unavailable"}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Related Books Section */}
        {relatedBooks.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">More by this Author</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBooks.map(book => (
                <div key={book.id} onClick={() => navigate(`/books/${book.id}`)} className="cursor-pointer">
                  <img 
                    src={book.coverImage} 
                    alt={book.title}
                    className="w-full h-64 object-cover rounded-md shadow-md hover:shadow-lg transition-shadow"
                  />
                  <h3 className="mt-3 font-semibold">{book.title}</h3>
                  <p className="text-gray-600">{book.author}</p>
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
