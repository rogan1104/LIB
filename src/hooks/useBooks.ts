
import { useState, useEffect } from "react";
import { Book } from "../types";
import { books } from "../data/sampleData";

export const useBooks = () => {
  const [libraryBooks, setLibraryBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with sample data
  useEffect(() => {
    setLibraryBooks(books);
    setFilteredBooks(books);
    setIsLoading(false);
  }, []);

  const searchBooks = (query: string) => {
    if (!query.trim()) {
      setFilteredBooks(libraryBooks);
      return;
    }
    
    const lowercaseQuery = query.toLowerCase();
    const filtered = libraryBooks.filter(book => 
      book.title.toLowerCase().includes(lowercaseQuery) || 
      book.author.toLowerCase().includes(lowercaseQuery) ||
      book.genre.toLowerCase().includes(lowercaseQuery) ||
      book.isbn.includes(query)
    );
    
    setFilteredBooks(filtered);
  };

  const getBookById = (id: string): Book | undefined => {
    return libraryBooks.find(b => b.id === id);
  };

  const updateBookAvailability = (bookId: string, increment: boolean) => {
    setLibraryBooks(prev =>
      prev.map(b =>
        b.id === bookId
          ? { ...b, availableCopies: increment ? b.availableCopies + 1 : b.availableCopies - 1 }
          : b
      )
    );
    
    setFilteredBooks(prev =>
      prev.map(b =>
        b.id === bookId
          ? { ...b, availableCopies: increment ? b.availableCopies + 1 : b.availableCopies - 1 }
          : b
      )
    );
  };

  return {
    books: libraryBooks,
    filteredBooks,
    isLoading,
    searchBooks,
    getBookById,
    updateBookAvailability
  };
};
