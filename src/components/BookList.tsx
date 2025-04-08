
import React, { useState } from "react";
import { Book } from "../types";
import BookCard from "./BookCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BookListProps {
  books: Book[];
  title?: string;
}

const BookList: React.FC<BookListProps> = ({ books, title }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("title");
  const [filter, setFilter] = useState("all");
  const booksPerPage = 8;
  
  // Filter books
  const filterBooks = (books: Book[]) => {
    if (filter === "available") {
      return books.filter(book => book.availableCopies > 0);
    } else if (filter === "unavailable") {
      return books.filter(book => book.availableCopies === 0);
    } else {
      return books;
    }
  };
  
  // Sort books
  const sortBooks = (books: Book[]) => {
    switch(sortBy) {
      case "title":
        return [...books].sort((a, b) => a.title.localeCompare(b.title));
      case "author":
        return [...books].sort((a, b) => a.author.localeCompare(b.author));
      case "newest":
        return [...books].sort((a, b) => b.publishYear - a.publishYear);
      case "oldest":
        return [...books].sort((a, b) => a.publishYear - b.publishYear);
      default:
        return books;
    }
  };
  
  const filteredAndSortedBooks = sortBooks(filterBooks(books));
  
  // Get current books
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredAndSortedBooks.slice(indexOfFirstBook, indexOfLastBook);
  
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredAndSortedBooks.length / booksPerPage);
  
  return (
    <div className="container mx-auto p-4">
      {title && <h2 className="text-2xl font-semibold mb-6">{title}</h2>}
      
      <div className="flex flex-col sm:flex-row justify-between mb-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-0">
          <div className="flex items-center">
            <span className="text-sm mr-2">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="author">Author</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center">
            <span className="text-sm mr-2">Filter:</span>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Books</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Showing {indexOfFirstBook + 1}-{Math.min(indexOfLastBook, filteredAndSortedBooks.length)} of {filteredAndSortedBooks.length} books
        </div>
      </div>
      
      {currentBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">No books found matching your criteria.</p>
        </div>
      )}
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              size="icon"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  onClick={() => paginate(page)}
                  className={`h-8 w-8 p-0 ${
                    page === currentPage ? "bg-library-primary hover:bg-library-secondary" : ""
                  }`}
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              size="icon"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookList;
