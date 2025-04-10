
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  BookOpen,
  Search,
  Plus,
  PenSquare,
  Trash,
  Shield,
  Calendar,
  Info,
  ArrowRight
} from "lucide-react";
import { users, books, borrows, generateId } from "@/data/sampleData";
import { Book, Borrow, User as UserType } from "@/types";
import { useLibrary } from "@/context/LibraryContext";

// Form schemas for validation
const addUserSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["student", "teacher", "admin"]),
  branch: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const addBookSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  author: z.string().min(2, "Author name must be at least 2 characters"),
  isbn: z.string().min(10, "ISBN must be at least 10 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  publishYear: z.coerce.number().min(1000, "Enter a valid year"),
  genre: z.string().min(2, "Genre must be at least 2 characters"),
  copies: z.coerce.number().min(1, "Must have at least 1 copy"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  coverImage: z.string().url("Must be a valid URL"),
});

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { getBookById } = useLibrary();
  const [searchQuery, setSearchQuery] = useState("");
  const [bookSearchQuery, setBookSearchQuery] = useState("");
  const [transactionSearchQuery, setTransactionSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [filteredBooks, setFilteredBooks] = useState(books.slice(0, 10));
  const [filteredTransactions, setFilteredTransactions] = useState(borrows);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Borrow | null>(null);
  const [showBookDetails, setShowBookDetails] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addBookOpen, setAddBookOpen] = useState(false);
  
  // Forms
  const addUserForm = useForm<z.infer<typeof addUserSchema>>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "student",
      branch: "",
      password: "",
    },
  });

  const addBookForm = useForm<z.infer<typeof addBookSchema>>({
    resolver: zodResolver(addBookSchema),
    defaultValues: {
      title: "",
      author: "",
      isbn: "",
      description: "",
      publishYear: 2023,
      genre: "",
      copies: 1,
      location: "",
      coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e",
    },
  });

  // Search functionality
  const handleUserSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredUsers(users);
      return;
    }
    
    const lowercaseQuery = query.toLowerCase();
    const filtered = users.filter(user => 
      user.firstName.toLowerCase().includes(lowercaseQuery) || 
      user.lastName.toLowerCase().includes(lowercaseQuery) || 
      user.email.toLowerCase().includes(lowercaseQuery) ||
      user.role.toLowerCase().includes(lowercaseQuery)
    );
    
    setFilteredUsers(filtered);
  };

  const handleBookSearch = (query: string) => {
    setBookSearchQuery(query);
    if (!query.trim()) {
      setFilteredBooks(books.slice(0, 10));
      return;
    }
    
    const lowercaseQuery = query.toLowerCase();
    const filtered = books.filter(book => 
      book.title.toLowerCase().includes(lowercaseQuery) || 
      book.author.toLowerCase().includes(lowercaseQuery) || 
      book.genre.toLowerCase().includes(lowercaseQuery) ||
      book.isbn.includes(query)
    ).slice(0, 10);
    
    setFilteredBooks(filtered);
  };

  const handleTransactionSearch = (query: string) => {
    setTransactionSearchQuery(query);
    if (!query.trim()) {
      setFilteredTransactions(borrows);
      return;
    }
    
    const lowercaseQuery = query.toLowerCase();
    const filtered = borrows.filter(borrow => {
      const borrowUser = users.find(u => u.id === borrow.userId);
      const borrowBook = books.find(b => b.id === borrow.bookId);
      
      return (
        (borrowUser && 
          (`${borrowUser.firstName} ${borrowUser.lastName}`.toLowerCase().includes(lowercaseQuery) || 
           borrowUser.email.toLowerCase().includes(lowercaseQuery))) ||
        (borrowBook && 
          (borrowBook.title.toLowerCase().includes(lowercaseQuery) || 
           borrowBook.author.toLowerCase().includes(lowercaseQuery)))
      );
    });
    
    setFilteredTransactions(filtered);
  };

  // Add user functionality
  const onAddUser = (data: z.infer<typeof addUserSchema>) => {
    const newUser: UserType = {
      id: generateId("user"),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      branch: data.branch || undefined,
      verified: true, // Admin-created users are auto-verified
      createdAt: new Date().toISOString(),
    };
    
    // In a real app, would add to DB. For demo, just show success message
    toast({
      title: "User Added Successfully",
      description: `${newUser.firstName} ${newUser.lastName} has been added as a ${newUser.role}.`,
    });
    
    setAddUserOpen(false);
    addUserForm.reset();
  };
  
  // Add book functionality
  const onAddBook = (data: z.infer<typeof addBookSchema>) => {
    const newBook: Book = {
      id: generateId("book"),
      title: data.title,
      author: data.author,
      isbn: data.isbn,
      coverImage: data.coverImage,
      description: data.description,
      publishYear: data.publishYear,
      genre: data.genre,
      copies: data.copies,
      availableCopies: data.copies,
      location: data.location,
    };
    
    // In a real app, would add to DB. For demo, just show success message
    toast({
      title: "Book Added Successfully",
      description: `"${newBook.title}" by ${newBook.author} has been added to the library.`,
    });
    
    setAddBookOpen(false);
    addBookForm.reset();
  };

  // View details functionality
  const viewBookDetails = (book: Book) => {
    setSelectedBook(book);
    setShowBookDetails(true);
  };
  
  const viewUserDetails = (user: UserType) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const viewTransactionDetails = (transaction: Borrow) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetails(true);
  };
  
  if (!isAuthenticated || user?.role !== "admin") {
    navigate("/");
    return null;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-library-primary text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold text-center">
              Admin Dashboard
            </h1>
            <p className="text-center mt-2">
              Manage users, books, and transactions
            </p>
          </div>
        </section>
        
        {/* Dashboard */}
        <section className="py-8 bg-library-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <User className="mr-2 h-5 w-5 text-library-primary" />
                    Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{users.length}</div>
                  <p className="text-sm text-muted-foreground">Total registered users</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BookOpen className="mr-2 h-5 w-5 text-library-primary" />
                    Books
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{books.length}</div>
                  <p className="text-sm text-muted-foreground">Total books in library</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-library-primary" />
                    Borrows
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{borrows.length}</div>
                  <p className="text-sm text-muted-foreground">Total borrow records</p>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="users" className="max-w-5xl mx-auto">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="books">Books</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>
                          Manage student, teacher, and admin accounts
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <div className="relative">
                          <Search className="h-4 w-4 absolute top-3 left-3 text-muted-foreground" />
                          <Input 
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={e => handleUserSearch(e.target.value)}
                            className="pl-9 w-full md:w-64"
                          />
                        </div>
                        <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
                          <DialogTrigger asChild>
                            <Button className="bg-library-primary hover:bg-library-secondary">
                              <Plus className="h-4 w-4 mr-2" />
                              Add User
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle>Add New User</DialogTitle>
                              <DialogDescription>
                                Create a new user account for the library system.
                              </DialogDescription>
                            </DialogHeader>
                            
                            <Form {...addUserForm}>
                              <form onSubmit={addUserForm.handleSubmit(onAddUser)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <FormField
                                    control={addUserForm.control}
                                    name="firstName"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={addUserForm.control}
                                    name="lastName"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                
                                <FormField
                                  control={addUserForm.control}
                                  name="email"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Email</FormLabel>
                                      <FormControl>
                                        <Input type="email" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={addUserForm.control}
                                  name="password"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Password</FormLabel>
                                      <FormControl>
                                        <Input type="password" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <FormField
                                    control={addUserForm.control}
                                    name="role"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <Select 
                                          onValueChange={field.onChange} 
                                          defaultValue={field.value}
                                        >
                                          <FormControl>
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            <SelectItem value="student">Student</SelectItem>
                                            <SelectItem value="teacher">Teacher</SelectItem>
                                            <SelectItem value="admin">Administrator</SelectItem>
                                          </SelectContent>
                                        </Select>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={addUserForm.control}
                                    name="branch"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Branch (Optional)</FormLabel>
                                        <FormControl>
                                          <Input {...field} placeholder="Department or branch" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                
                                <DialogFooter>
                                  <Button variant="outline" type="button" onClick={() => setAddUserOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button type="submit">Add User</Button>
                                </DialogFooter>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Branch</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">
                                {user.firstName} {user.lastName}
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  {user.role === "admin" && (
                                    <Shield className="h-3 w-3 mr-1 text-red-500" />
                                  )}
                                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                </div>
                              </TableCell>
                              <TableCell>{user.branch || "N/A"}</TableCell>
                              <TableCell>
                                {user.verified ? (
                                  <span className="text-green-600 flex items-center">
                                    <span className="h-2 w-2 rounded-full bg-green-600 mr-2"></span>
                                    Verified
                                  </span>
                                ) : (
                                  <span className="text-amber-600 flex items-center">
                                    <span className="h-2 w-2 rounded-full bg-amber-600 mr-2"></span>
                                    Pending
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => viewUserDetails(user)}
                                  >
                                    <Info className="h-4 w-4" />
                                    <span className="sr-only md:not-sr-only md:ml-2">Details</span>
                                  </Button>
                                  
                                  <Button variant="ghost" size="sm">
                                    <PenSquare className="h-4 w-4" />
                                    <span className="sr-only md:not-sr-only md:ml-2">Edit</span>
                                  </Button>
                                  
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="sm" className="text-red-600">
                                        <Trash className="h-4 w-4" />
                                        <span className="sr-only md:not-sr-only md:ml-2">Delete</span>
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete this user account? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="books">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle>Book Management</CardTitle>
                        <CardDescription>
                          Add, edit, and remove books from the library
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <div className="relative">
                          <Search className="h-4 w-4 absolute top-3 left-3 text-muted-foreground" />
                          <Input 
                            placeholder="Search books..."
                            value={bookSearchQuery}
                            onChange={e => handleBookSearch(e.target.value)}
                            className="pl-9 w-full md:w-64"
                          />
                        </div>
                        <Dialog open={addBookOpen} onOpenChange={setAddBookOpen}>
                          <DialogTrigger asChild>
                            <Button className="bg-library-primary hover:bg-library-secondary">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Book
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle>Add New Book</DialogTitle>
                              <DialogDescription>
                                Add a new book to the library catalog.
                              </DialogDescription>
                            </DialogHeader>
                            
                            <Form {...addBookForm}>
                              <form onSubmit={addBookForm.handleSubmit(onAddBook)} className="space-y-4">
                                <FormField
                                  control={addBookForm.control}
                                  name="title"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Title</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <FormField
                                    control={addBookForm.control}
                                    name="author"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Author</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={addBookForm.control}
                                    name="isbn"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>ISBN</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <FormField
                                    control={addBookForm.control}
                                    name="publishYear"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Publish Year</FormLabel>
                                        <FormControl>
                                          <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={addBookForm.control}
                                    name="genre"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Genre</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <FormField
                                    control={addBookForm.control}
                                    name="copies"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Number of Copies</FormLabel>
                                        <FormControl>
                                          <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={addBookForm.control}
                                    name="location"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                          <Input {...field} placeholder="Shelf A2" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                
                                <FormField
                                  control={addBookForm.control}
                                  name="coverImage"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Cover Image URL</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={addBookForm.control}
                                  name="description"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Description</FormLabel>
                                      <FormControl>
                                        <Textarea 
                                          {...field} 
                                          rows={4}
                                          className="resize-none"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <DialogFooter>
                                  <Button variant="outline" type="button" onClick={() => setAddBookOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button type="submit">Add Book</Button>
                                </DialogFooter>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Genre</TableHead>
                            <TableHead>Available</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredBooks.map((book) => (
                            <TableRow key={book.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center">
                                  <div 
                                    className="w-10 h-14 bg-muted rounded mr-2 overflow-hidden"
                                    style={{
                                      backgroundImage: `url(${book.coverImage})`,
                                      backgroundSize: 'cover',
                                      backgroundPosition: 'center'
                                    }}
                                  />
                                  <div>{book.title}</div>
                                </div>
                              </TableCell>
                              <TableCell>{book.author}</TableCell>
                              <TableCell>{book.genre}</TableCell>
                              <TableCell>
                                {book.availableCopies}/{book.copies}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => viewBookDetails(book)}
                                  >
                                    <Info className="h-4 w-4" />
                                    <span className="sr-only md:not-sr-only md:ml-2">Details</span>
                                  </Button>
                                  
                                  <Button variant="ghost" size="sm">
                                    <PenSquare className="h-4 w-4" />
                                    <span className="sr-only md:not-sr-only md:ml-2">Edit</span>
                                  </Button>
                                  
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="sm" className="text-red-600">
                                        <Trash className="h-4 w-4" />
                                        <span className="sr-only md:not-sr-only md:ml-2">Delete</span>
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Book</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete this book? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="mt-4 text-center text-sm text-muted-foreground">
                      Showing {filteredBooks.length} of {books.length} books
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="transactions">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle>Transaction History</CardTitle>
                        <CardDescription>
                          View all borrows, returns, and payments
                        </CardDescription>
                      </div>
                      <div className="relative">
                        <Search className="h-4 w-4 absolute top-3 left-3 text-muted-foreground" />
                        <Input 
                          placeholder="Search transactions..."
                          value={transactionSearchQuery}
                          onChange={e => handleTransactionSearch(e.target.value)}
                          className="pl-9 w-full md:w-64"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Book</TableHead>
                            <TableHead>Borrow Date</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTransactions.map((borrow) => {
                            const borrowUser = users.find(u => u.id === borrow.userId);
                            const borrowBook = books.find(b => b.id === borrow.bookId);
                            const isOverdue = new Date(borrow.dueDate) < new Date() && !borrow.returned;
                            
                            return (
                              <TableRow key={borrow.id}>
                                <TableCell>
                                  {borrowUser ? `${borrowUser.firstName} ${borrowUser.lastName}` : "Unknown User"}
                                </TableCell>
                                <TableCell>{borrowBook ? borrowBook.title : "Unknown Book"}</TableCell>
                                <TableCell>
                                  {new Date(borrow.borrowDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  {new Date(borrow.dueDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  {borrow.returned ? (
                                    <span className="text-green-600 flex items-center">
                                      <span className="h-2 w-2 rounded-full bg-green-600 mr-2"></span>
                                      Returned
                                    </span>
                                  ) : isOverdue ? (
                                    <span className="text-red-600 flex items-center">
                                      <span className="h-2 w-2 rounded-full bg-red-600 mr-2"></span>
                                      Overdue
                                    </span>
                                  ) : (
                                    <span className="text-amber-600 flex items-center">
                                      <span className="h-2 w-2 rounded-full bg-amber-600 mr-2"></span>
                                      Active
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => viewTransactionDetails(borrow)}
                                  >
                                    <Info className="h-4 w-4 mr-2" />
                                    View Details
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      {/* Details Dialogs */}
      {/* Book Details Dialog */}
      <Dialog open={showBookDetails} onOpenChange={setShowBookDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Book Details</DialogTitle>
          </DialogHeader>
          {selectedBook && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="w-full aspect-[2/3] overflow-hidden rounded-md">
                  <img 
                    src={selectedBook.coverImage} 
                    alt={`Cover of ${selectedBook.title}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4 text-center">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => navigate(`/books/${selectedBook.id}`)}
                  >
                    View Public Page
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedBook.title}</h2>
                  <p className="text-muted-foreground">by {selectedBook.author}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-semibold">ISBN:</span> {selectedBook.isbn}
                  </div>
                  <div>
                    <span className="font-semibold">Year:</span> {selectedBook.publishYear}
                  </div>
                  <div>
                    <span className="font-semibold">Genre:</span> {selectedBook.genre}
                  </div>
                  <div>
                    <span className="font-semibold">Location:</span> {selectedBook.location}
                  </div>
                  <div>
                    <span className="font-semibold">Total Copies:</span> {selectedBook.copies}
                  </div>
                  <div>
                    <span className="font-semibold">Available:</span> {selectedBook.availableCopies}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Description</h3>
                  <p className="text-sm">{selectedBook.description}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBookDetails(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* User Details Dialog */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="bg-muted rounded-full p-4">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h2>
                  <p className="text-muted-foreground">
                    {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                    {selectedUser.branch ? ` • ${selectedUser.branch}` : ""}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div>
                  <span className="font-semibold">Email:</span><br />
                  {selectedUser.email}
                </div>
                <div>
                  <span className="font-semibold">Status:</span><br />
                  {selectedUser.verified ? "Verified" : "Pending Verification"}
                </div>
                <div>
                  <span className="font-semibold">Joined:</span><br />
                  {new Date(selectedUser.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <h3 className="font-semibold mb-2">Borrow History</h3>
                {borrows.filter(b => b.userId === selectedUser.id).length > 0 ? (
                  <div className="space-y-2">
                    {borrows
                      .filter(b => b.userId === selectedUser.id)
                      .slice(0, 3)
                      .map(borrow => {
                        const book = books.find(b => b.id === borrow.bookId);
                        return (
                          <div key={borrow.id} className="flex justify-between text-sm border-b pb-2">
                            <div>
                              <div className="font-medium">{book?.title}</div>
                              <div className="text-muted-foreground">
                                {new Date(borrow.borrowDate).toLocaleDateString()} - {new Date(borrow.dueDate).toLocaleDateString()}
                              </div>
                            </div>
                            <div>
                              {borrow.returned ? (
                                <span className="text-green-600">Returned</span>
                              ) : (
                                <span className="text-amber-600">Active</span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    }
                    {borrows.filter(b => b.userId === selectedUser.id).length > 3 && (
                      <div className="text-center text-sm text-muted-foreground">
                        + {borrows.filter(b => b.userId === selectedUser.id).length - 3} more items
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No borrow history found.</p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserDetails(false)}>
              Close
            </Button>
            <Button>Edit User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Transaction Details Dialog */}
      <Dialog open={showTransactionDetails} onOpenChange={setShowTransactionDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              {(() => {
                const book = books.find(b => b.id === selectedTransaction.bookId);
                const borrowUser = users.find(u => u.id === selectedTransaction.userId);
                const isOverdue = new Date(selectedTransaction.dueDate) < new Date() && !selectedTransaction.returned;
                const daysDiff = selectedTransaction.returned ? 
                  Math.ceil((new Date(selectedTransaction.returnedDate!).getTime() - new Date(selectedTransaction.borrowDate).getTime()) / (1000 * 3600 * 24)) :
                  Math.ceil((new Date().getTime() - new Date(selectedTransaction.borrowDate).getTime()) / (1000 * 3600 * 24));
                
                return (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground">Book</h3>
                        <div className="flex items-center mt-1">
                          {book && (
                            <div 
                              className="w-10 h-14 bg-muted rounded mr-2 overflow-hidden"
                              style={{
                                backgroundImage: `url(${book.coverImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}
                            />
                          )}
                          <div>
                            <div className="font-medium">{book?.title || "Unknown Book"}</div>
                            <div className="text-sm text-muted-foreground">{book?.author}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground">User</h3>
                        <div className="flex items-center mt-1">
                          <div className="bg-muted rounded-full p-1 mr-2">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {borrowUser ? `${borrowUser.firstName} ${borrowUser.lastName}` : "Unknown User"}
                            </div>
                            <div className="text-sm text-muted-foreground">{borrowUser?.email}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                      <div>
                        <span className="font-semibold">Borrow Date:</span><br />
                        {new Date(selectedTransaction.borrowDate).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-semibold">Due Date:</span><br />
                        {new Date(selectedTransaction.dueDate).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-semibold">Return Date:</span><br />
                        {selectedTransaction.returned ? 
                          new Date(selectedTransaction.returnedDate!).toLocaleDateString() : "Not returned yet"}
                      </div>
                      <div>
                        <span className="font-semibold">Duration:</span><br />
                        {daysDiff} days
                      </div>
                      <div>
                        <span className="font-semibold">Extended:</span><br />
                        {selectedTransaction.extended ? "Yes" : "No"}
                      </div>
                      <div>
                        <span className="font-semibold">Status:</span><br />
                        {selectedTransaction.returned ? (
                          <span className="text-green-600">Returned</span>
                        ) : isOverdue ? (
                          <span className="text-red-600">Overdue</span>
                        ) : (
                          <span className="text-amber-600">Active</span>
                        )}
                      </div>
                    </div>
                    
                    {(selectedTransaction.fine && selectedTransaction.fine > 0) && (
                      <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-md">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium text-red-800">Fine Due</h3>
                            <p className="text-sm text-red-700">Late return penalty</p>
                          </div>
                          <div className="text-xl font-bold text-red-800">${selectedTransaction.fine.toFixed(2)}</div>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTransactionDetails(false)}>
              Close
            </Button>
            {selectedTransaction && !selectedTransaction.returned && (
              <Button 
                onClick={() => {
                  toast({
                    title: "Book Returned",
                    description: "The book has been marked as returned in the system."
                  });
                  setShowTransactionDetails(false);
                }}
              >
                Mark as Returned
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Admin;
