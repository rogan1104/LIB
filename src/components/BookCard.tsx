
import React from "react";
import { useNavigate } from "react-router-dom";
import { Book as BookType } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, BookOpen } from "lucide-react";

interface BookCardProps {
  book: BookType;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="book-card overflow-hidden h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={book.coverImage} 
          alt={`Cover of ${book.title}`}
          className="w-full h-full object-cover transition-all hover:scale-105"
        />
        <Badge 
          className="absolute top-2 right-2 bg-library-accent text-library-primary"
        >
          {book.genre}
        </Badge>
      </div>
      <CardContent className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg line-clamp-1">{book.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">by {book.author}</p>
        <p className="text-sm line-clamp-2 mb-3 flex-grow">{book.description}</p>
        <div className="flex justify-between items-center mt-2">
          <Badge variant={book.availableCopies > 0 ? "outline" : "secondary"}>
            {book.availableCopies > 0 ? `${book.availableCopies} available` : "Unavailable"}
          </Badge>
          <Button 
            size="sm"
            onClick={() => navigate(`/books/${book.id}`)}
            className="bg-library-primary hover:bg-library-secondary"
          >
            <Info className="mr-2 h-4 w-4" />
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
