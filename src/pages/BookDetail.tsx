
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLibrary } from "@/context/LibraryContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ErrorState from "@/components/book-detail/ErrorState";
import BookCover from "@/components/book-detail/BookCover";
import BookInfo from "@/components/book-detail/BookInfo";
import BorrowDialog from "@/components/book-detail/BorrowDialog";

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
    return <ErrorState type="loading" />;
  }
  
  if (!book) {
    return <ErrorState type="notFound" />;
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
            <BookCover 
              book={book} 
              isAuthenticated={isAuthenticated} 
              borrowLoading={borrowLoading} 
              handleBorrow={handleBorrow}
              dialogOpen={dialogOpen}
              setDialogOpen={setDialogOpen}
            />
            
            <BookInfo book={book} />
          </div>
        </div>
      </main>
      
      <BorrowDialog 
        open={dialogOpen} 
        setOpen={setDialogOpen} 
        bookTitle={book.title} 
      />
      
      <Footer />
    </div>
  );
};

export default BookDetail;
