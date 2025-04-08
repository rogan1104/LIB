
import React from "react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

interface ErrorStateProps {
  type: "notFound" | "loading";
}

const ErrorState: React.FC<ErrorStateProps> = ({ type }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center">
        {type === "notFound" ? (
          <>
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-3xl font-bold mb-2">Book Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The book you are looking for doesn't exist or has been removed.
            </p>
            <Button
              onClick={() => navigate("/books")}
              className="bg-library-primary hover:bg-library-secondary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Books
            </Button>
          </>
        ) : (
          <div className="text-center">
            <div className="h-10 w-10 animate-spin mx-auto mb-4 text-library-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            </div>
            <p className="text-muted-foreground">Loading book details...</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ErrorState;
