
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
  const [borrowLoading, setBorrowLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const foundBook = getBookById(id);
      if (foundBook) {
        setBook(foundBook);
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
