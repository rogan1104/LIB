
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  User,
  LogOut,
  Bell,
  Search,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import NotificationDropdown from "./NotificationDropdown";

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-library-primary text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-7 w-7" />
          <span 
            className="text-xl font-bold cursor-pointer"
            onClick={() => navigate("/")}
          >
            LibiBBookworm Haven
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")} 
            className="text-white hover:bg-library-secondary"
          >
            Home
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/books")} 
            className="text-white hover:bg-library-secondary"
          >
            Books
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/search")} 
            className="text-white hover:bg-library-secondary"
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
          {user?.role === "admin" && (
            <Button 
              variant="ghost" 
              onClick={() => navigate("/admin")} 
              className="text-white hover:bg-library-secondary"
            >
              Admin
            </Button>
          )}
        </nav>
        
        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              <NotificationDropdown>
                <Button variant="ghost" className="text-white relative hover:bg-library-secondary">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </NotificationDropdown>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-library-secondary">
                    <User className="mr-2 h-4 w-4" />
                    {user?.firstName}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                    <div className="text-xs text-muted-foreground">{user?.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/my-books")}>
                    My Books
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/login")}
                className="text-white hover:bg-library-secondary"
              >
                Login
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/signup")}
                className="bg-library-accent text-library-primary hover:bg-library-highlight"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Button variant="ghost" onClick={toggleMobileMenu} className="text-white">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden bg-library-primary absolute w-full transition-all duration-300 ease-in-out z-40",
        mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 invisible"
      )}>
        <div className="container mx-auto px-4 py-3 flex flex-col">
          <Button 
            variant="ghost" 
            onClick={() => {
              navigate("/");
              toggleMobileMenu();
            }} 
            className="text-white hover:bg-library-secondary text-left justify-start"
          >
            Home
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => {
              navigate("/books");
              toggleMobileMenu();
            }} 
            className="text-white hover:bg-library-secondary text-left justify-start"
          >
            Books
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => {
              navigate("/search");
              toggleMobileMenu();
            }} 
            className="text-white hover:bg-library-secondary text-left justify-start"
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
          
          {user?.role === "admin" && (
            <Button 
              variant="ghost" 
              onClick={() => {
                navigate("/admin");
                toggleMobileMenu();
              }} 
              className="text-white hover:bg-library-secondary text-left justify-start"
            >
              Admin
            </Button>
          )}
          
          <div className="border-t border-library-secondary my-2 pt-2">
            {isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    navigate("/profile");
                    toggleMobileMenu();
                  }}
                  className="text-white hover:bg-library-secondary text-left justify-start w-full"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    navigate("/my-books");
                    toggleMobileMenu();
                  }}
                  className="text-white hover:bg-library-secondary text-left justify-start w-full"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  My Books
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    navigate("/notifications");
                    toggleMobileMenu();
                  }}
                  className="text-white hover:bg-library-secondary text-left justify-start w-full"
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className="text-white hover:bg-library-secondary text-left justify-start w-full"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    navigate("/login");
                    toggleMobileMenu();
                  }}
                  className="text-white hover:bg-library-secondary text-left justify-start w-full"
                >
                  Login
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    navigate("/signup");
                    toggleMobileMenu();
                  }}
                  className="text-white hover:bg-library-secondary text-left justify-start w-full"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
