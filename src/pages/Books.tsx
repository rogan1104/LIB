
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookList from "@/components/BookList";
import SearchBar from "@/components/SearchBar";
import { useLibrary } from "@/context/LibraryContext";
import { useNavigate } from "react-router-dom";

const Books = () => {
  const { books, searchBooks, isLoading } = useLibrary();
  const navigate = useNavigate();
  
  const handleSearch = (query: string) => {
    searchBooks(query);
    navigate("/search", { state: { query } });
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-library-primary text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Book Collection</h1>
            <p className="text-lg max-w-3xl mx-auto mb-8">
              Browse our extensive collection of books. Find your next favorite read and borrow it today.
            </p>
            <div className="max-w-2xl mx-auto">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </section>
        
        {/* Book List */}
        <section className="py-12 bg-library-background">
          {isLoading ? (
            <div className="container mx-auto px-4 text-center py-16">
              <div className="animate-pulse">
                <div className="h-8 w-48 bg-muted rounded mb-8 mx-auto"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg h-80"></div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <BookList books={books} title="All Books" />
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Books;
