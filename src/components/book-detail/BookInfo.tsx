
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tag, Calendar } from "lucide-react";
import { Book } from "@/types";
import { useNavigate } from "react-router-dom";

interface BookInfoProps {
  book: Book;
}

const BookInfo = ({ book }: BookInfoProps) => {
  const navigate = useNavigate();

  return (
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
        
        <RelatedBooks bookId={book.id} />
      </div>
    </div>
  );
};

const RelatedBooks = ({ bookId }: { bookId: string }) => {
  const navigate = useNavigate();
  
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">You might also like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div 
            key={idx}
            className="rounded-lg bg-white shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/books/book-${(parseInt(bookId.split('-')[1]) % 25) + idx + 1}`)}
          >
            <div className="h-24 bg-library-accent rounded mb-2"></div>
            <p className="font-medium truncate">Related Book {idx + 1}</p>
            <p className="text-xs text-muted-foreground">Similar Genre</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookInfo;
