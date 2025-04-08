
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch,
  placeholder = "Search books by title, author, or ISBN..." 
}) => {
  const [query, setQuery] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-2xl">
      <div className="relative flex-grow">
        <Input 
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-10 w-full"
        />
      </div>
      <Button 
        type="submit"
        className="ml-2 bg-library-primary hover:bg-library-secondary"
      >
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
