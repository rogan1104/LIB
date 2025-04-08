
import React from "react";
import { MapPin, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Book } from "@/types";
import { useNavigate } from "react-router-dom";

interface BookCoverProps {
  book: Book;
  isAuthenticated: boolean;
  borrowLoading: boolean;
  handleBorrow: () => void;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dialogOpen: boolean;
}

const BookCover = ({
  book,
  isAuthenticated,
  borrowLoading,
  handleBorrow,
  setDialogOpen,
  dialogOpen
}: BookCoverProps) => {
  const navigate = useNavigate();
  
  return (
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
        
        {isAuthenticated ? (
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
        ) : (
          <Button
            onClick={() => navigate("/login")}
            className="w-full bg-library-primary hover:bg-library-secondary"
          >
            Log In to Borrow
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookCover;
