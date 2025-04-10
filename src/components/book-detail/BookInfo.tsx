
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tag, Calendar } from "lucide-react";
import { Book } from "@/types";
import { useNavigate } from "react-router-dom";
import { useLibrary } from "@/context/LibraryContext";

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
        
        <RelatedBooks bookId={book.id} genre={book.genre} />
      </div>
    </div>
  );
};

const RelatedBooks = ({ bookId, genre }: { bookId: string, genre: string }) => {
  const navigate = useNavigate();
  const { books } = useLibrary();
  
  // Find related books by the same genre
  const relatedBooks = books ? 
    books
      .filter(b => b.id !== bookId && b.genre === genre)
      .slice(0, 3) : 
    [];
  
  if (relatedBooks.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">You might also like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedBooks.map((book) => (
          <div 
            key={book.id}
            className="rounded-lg bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow group"
            onClick={() => navigate(`/books/${book.id}`)}
          >
            <div className="relative overflow-hidden rounded-t-lg">
              <img 
                src={book.coverImage} 
                alt={`Cover of ${book.title}`}
                className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="p-3">
              <p className="font-medium text-sm line-clamp-1 group-hover:text-library-primary transition-colors">{book.title}</p>
              <p className="text-xs text-muted-foreground">by {book.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookInfo;
