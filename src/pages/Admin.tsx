
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  User,
  BookOpen,
  Search,
  AlertCircle,
  Plus,
  PenSquare,
  Trash,
  Shield,
  Calendar
} from "lucide-react";
import { users, books, borrows } from "@/data/sampleData";

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
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
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-9 w-full md:w-64"
                          />
                        </div>
                        <Button className="bg-library-primary hover:bg-library-secondary">
                          <Plus className="h-4 w-4 mr-2" />
                          Add User
                        </Button>
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
                          {users.map((user) => (
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
                            className="pl-9 w-full md:w-64"
                          />
                        </div>
                        <Button className="bg-library-primary hover:bg-library-secondary">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Book
                        </Button>
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
                          {books.slice(0, 10).map((book) => (
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
                      Showing 10 of {books.length} books
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
                          {borrows.map((borrow) => {
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
                                  <Button variant="ghost" size="sm">
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
      
      <Footer />
    </div>
  );
};

export default Admin;
