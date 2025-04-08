
import { BookOpen, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-library-primary text-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span className="text-lg font-bold">LibiBBookworm Haven</span>
            </div>
            <p className="text-sm opacity-80">
              Your gateway to knowledge and imagination. Explore our vast collection of books and resources.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Button 
                  variant="link" 
                  onClick={() => navigate("/")}
                  className="text-white hover:text-library-accent p-0 h-auto"
                >
                  Home
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  onClick={() => navigate("/books")}
                  className="text-white hover:text-library-accent p-0 h-auto"
                >
                  Books
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  onClick={() => navigate("/search")}
                  className="text-white hover:text-library-accent p-0 h-auto"
                >
                  Search
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  onClick={() => navigate("/login")}
                  className="text-white hover:text-library-accent p-0 h-auto"
                >
                  Login
                </Button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Button 
                  variant="link" 
                  className="text-white hover:text-library-accent p-0 h-auto"
                >
                  Fiction
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="text-white hover:text-library-accent p-0 h-auto"
                >
                  Fantasy
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="text-white hover:text-library-accent p-0 h-auto"
                >
                  Science Fiction
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="text-white hover:text-library-accent p-0 h-auto"
                >
                  Mystery
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="text-white hover:text-library-accent p-0 h-auto"
                >
                  Non-Fiction
                </Button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5" />
                <span>123 Library Street, Booktown, BT 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <span>info@libibbookworm.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-library-secondary mt-8 pt-6 text-center text-sm opacity-80">
          <p>© {currentYear} LibiBBookworm Haven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
