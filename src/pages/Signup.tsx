import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/types";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [branch, setBranch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      if (!firstName || firstName.trim().length < 2) {
        setError("First name must be at least 2 characters");
        return;
      }
      
      if (!lastName || lastName.trim().length < 2) {
        setError("Last name must be at least 2 characters");
        return;
      }
      
      if (!emailRegex.test(email)) {
        setError("Invalid email format");
        return;
      }
      
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      
      if ((role === "student" || role === "teacher") && !branch) {
        setError("Branch is required for students and teachers");
        return;
      }
      
      await signup(email, firstName, lastName, password, role, branch);
      setSuccess(true);
      
      // In a real app, the user would receive a verification email
      // For the demo, we'll just show a success message and navigate to loginq
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };
  
  const showBranchField = role === "student" || role === "teacher";
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex items-center justify-center bg-library-background py-12">
        <div className="container px-4 max-w-lg">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <BookOpen className="h-12 w-12 text-library-primary" />
              </div>
              <CardTitle className="text-2xl">Create an Account</CardTitle>
              <CardDescription>
                Join LibiBBookworm Haven to access our library services
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="bg-green-50 text-green-600 p-4 rounded-md text-center">
                  <h3 className="font-semibold text-lg mb-2">Registration Successful!</h3>
                  <p className="mb-4">A verification email has been sent to {email}.</p>
                  <p className="text-sm">Redirecting to login page...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={role}
                        onValueChange={(value) => setRole(value as UserRole)}
                        disabled={isLoading}
                      >
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {showBranchField && (
                      <div className="space-y-2">
                        <Label htmlFor="branch">Branch/Department</Label>
                        <Input
                          id="branch"
                          type="text"
                          placeholder={role === "student" ? "e.g. Computer Science" : "e.g. Physics"}
                          value={branch}
                          onChange={(e) => setBranch(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    )}
                  </div>
                  
                  {error && (
                    <div className="bg-red-50 text-red-600 px-3 py-2 rounded-md text-sm">
                      {error}
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-library-primary hover:bg-library-secondary" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    By signing up, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-library-primary hover:underline">
                  Log in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Signup;
