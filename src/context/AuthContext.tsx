import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "../types";
import { users } from "../data/sampleData";
import { toast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, firstName: string, lastName: string, password: string, role: UserRole, branch?: string) => Promise<void>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check for saved user in localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("libib_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // For demo, we're just using the sample data
      const foundUser = users.find(u => u.email === email);
      if (!foundUser) {
        throw new Error("Invalid email or password");
      }

      // Password would be checked here, but for demo we'll skip that
      
      if (!foundUser.verified) {
        throw new Error("Please verify your email before logging in");
      }

      // Save to localStorage for persistence
      localStorage.setItem("libib_user", JSON.stringify(foundUser));
      
      setUser(foundUser);
      setIsAuthenticated(true);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${foundUser.firstName}!`,
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    role: UserRole,
    branch?: string
  ): Promise<void> => {
    setIsLoading(true);
    try {
      // Check if user already exists
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        throw new Error("Email already in use");
      }

      // In a real app, this would create a user in the database
      // and send a verification email
      
      toast({
        title: "Registration Successful",
        description: "A verification email has been sent to your email address.",
      });
      
      // For demo purposes, we'll just show a success message
      // In a real app, the user wouldn't be logged in until they verify their email
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("libib_user");
    setUser(null);
    setIsAuthenticated(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    // In a real app, this would verify the token with an API
    // For demo, we'll just return true
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        verifyEmail,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
