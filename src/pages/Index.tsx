
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Search, User, BookCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookList from "@/components/BookList";
import BookCard from "@/components/BookCard";
import SearchBar from "@/components/SearchBar";
import { useLibrary } from "@/context/LibraryContext";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { books, searchBooks } = useLibrary();
  const { isAuthenticated } = useAuth();
  
  const handleSearch = (query: string) => {
    searchBooks(query);
    navigate("/search", { state: { query } });
  };
  
  const featuredBooks = books.filter(book => book.availableCopies > 0).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-library-primary to-library-secondary text-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Discover, Borrow, and Learn
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Access thousands of books from our vast collection at LibiBBookworm Haven - your digital library gateway.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4">
              <Button 
                onClick={() => navigate("/books")}
                className="text-lg px-6 py-6 bg-white text-library-primary hover:bg-library-light"
                size="lg"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Browse Books
              </Button>
              {!isAuthenticated && (
                <Button 
                  onClick={() => navigate("/signup")}
                  variant="outline"
                  className="text-lg px-6 py-6 border-white text-white hover:bg-white hover:text-library-primary"
                  size="lg"
                >
                  <User className="mr-2 h-5 w-5" />
                  Sign Up Now
                </Button>
              )}
            </div>
          </div>
        </section>
        
        {/* Search Section */}
        <section className="py-12 bg-library-light">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 -mt-16 relative">
              <h2 className="text-2xl font-bold mb-6 text-center">Find Your Next Great Read</h2>
              <div className="flex justify-center">
                <SearchBar onSearch={handleSearch} />
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Books */}
        <section className="py-12 md:py-16 bg-library-background">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Featured Books</h2>
              <Button
                onClick={() => navigate("/books")}
                variant="outline"
                className="border-library-primary text-library-primary hover:bg-library-primary hover:text-white"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg hover:shadow-lg transition-all">
                <div className="bg-library-accent h-16 w-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Search className="h-8 w-8 text-library-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Search & Discover</h3>
                <p className="text-muted-foreground">
                  Browse our extensive collection of books or search for specific titles, authors, or genres.
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg hover:shadow-lg transition-all">
                <div className="bg-library-accent h-16 w-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <BookOpen className="h-8 w-8 text-library-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Borrow Books</h3>
                <p className="text-muted-foreground">
                  Once you find a book you like, simply borrow it and pick it up at your convenience.
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg hover:shadow-lg transition-all">
                <div className="bg-library-accent h-16 w-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <BookCheck className="h-8 w-8 text-library-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Return or Extend</h3>
                <p className="text-muted-foreground">
                  Return your borrowed books on time or extend your loan if you need more time to finish.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-library-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Reading?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Create your free account today and get access to thousands of books in our library.
            </p>
            {!isAuthenticated ? (
              <Button
                onClick={() => navigate("/signup")}
                size="lg"
                className="bg-white text-library-primary hover:bg-library-light"
              >
                Sign Up Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/books")}
                size="lg"
                className="bg-white text-library-primary hover:bg-library-light"
              >
                Browse Books
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
