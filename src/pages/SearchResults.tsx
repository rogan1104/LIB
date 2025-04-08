
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import BookList from "@/components/BookList";
import { useLibrary } from "@/context/LibraryContext";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, ArrowLeft } from "lucide-react";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchBooks, filteredBooks } = useLibrary();
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Get search query from location state or URL params
  useEffect(() => {
    const query = location.state?.query || new URLSearchParams(location.search).get("q") || "";
    setSearchQuery(query);
    searchBooks(query);
  }, [location, searchBooks]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchBooks(query);
    navigate("/search", { state: { query } });
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Search Header */}
        <section className="bg-library-primary text-white py-8">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="text-white hover:bg-library-secondary"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Search Books</h1>
            <div className="max-w-2xl mx-auto">
              <SearchBar onSearch={handleSearch} placeholder="Search by title, author, ISBN, or genre..." />
            </div>
          </div>
        </section>
        
        {/* Search Results */}
        <section className="py-12 bg-library-background">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              {searchQuery ? (
                <h2 className="text-2xl font-semibold">
                  Search Results for "{searchQuery}"
                </h2>
              ) : (
                <h2 className="text-2xl font-semibold">Browse All Books</h2>
              )}
              <p className="text-muted-foreground mt-2">
                {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"} found
              </p>
            </div>
            
            {filteredBooks.length > 0 ? (
              <BookList books={filteredBooks} />
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <Search className="h-16 w-16 mx-auto text-muted-foreground" />
                <h3 className="text-xl font-semibold mt-4">No Results Found</h3>
                <p className="text-muted-foreground mt-2 mb-6">
                  We couldn't find any books matching your search criteria.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => {
                      searchBooks("");
                      setSearchQuery("");
                      navigate("/search");
                    }}
                    variant="outline"
                    className="border-library-primary text-library-primary hover:bg-library-primary hover:text-white"
                  >
                    Clear Search
                  </Button>
                  <Button
                    onClick={() => navigate("/books")}
                    className="bg-library-primary hover:bg-library-secondary"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse All Books
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchResults;
