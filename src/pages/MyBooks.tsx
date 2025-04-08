
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLibrary } from "@/context/LibraryContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Calendar,
  Check,
  Clock,
  Loader2,
  BookOpen,
  BookX,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  CreditCard
} from "lucide-react";

const MyBooks = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { userBorrows, getBookById, returnBook, extendBorrow, calculateFine, makePayment } = useLibrary();
  
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }
  
  const currentBorrows = userBorrows.filter(borrow => !borrow.returned);
  const historyBorrows = userBorrows.filter(borrow => borrow.returned);
  
  const handleReturn = async (borrowId: string) => {
    setActionLoading(borrowId);
    try {
      await returnBook(borrowId);
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };
  
  const handleExtend = async (borrowId: string) => {
    setActionLoading(borrowId);
    try {
      await extendBorrow(borrowId);
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };
  
  const handlePayFine = async (borrowId: string, amount: number) => {
    setActionLoading(borrowId);
    try {
      await makePayment(borrowId, amount);
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };
  
  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-library-primary text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold text-center">My Books</h1>
          </div>
        </section>
        
        {/* Content Section */}
        <section className="py-8 bg-library-background">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="current" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="current">
                  Currently Borrowed
                  {currentBorrows.length > 0 && (
                    <Badge className="ml-2 bg-library-accent text-library-primary">{currentBorrows.length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="history">
                  Borrowing History
                  {historyBorrows.length > 0 && (
                    <Badge className="ml-2 bg-muted text-muted-foreground">{historyBorrows.length}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="current">
                <Card>
                  <CardHeader>
                    <CardTitle>Currently Borrowed Books</CardTitle>
                    <CardDescription>
                      Books you currently have checked out from the library.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {currentBorrows.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Book</TableHead>
                              <TableHead>Borrow Date</TableHead>
                              <TableHead>Due Date</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {currentBorrows.map((borrow) => {
                              const book = getBookById(borrow.bookId);
                              const fine = calculateFine(borrow.id);
                              const isBookOverdue = isOverdue(borrow.dueDate);
                              
                              return (
                                <TableRow key={borrow.id}>
                                  <TableCell className="font-medium">
                                    <div className="flex items-center">
                                      <div 
                                        className="w-10 h-14 bg-muted rounded mr-2 overflow-hidden"
                                        style={{
                                          backgroundImage: book ? `url(${book.coverImage})` : undefined,
                                          backgroundSize: 'cover',
                                          backgroundPosition: 'center'
                                        }}
                                      />
                                      <div>
                                        <p className="font-medium">{book?.title || "Unknown Book"}</p>
                                        <p className="text-xs text-muted-foreground">{book?.author}</p>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {formatDate(borrow.borrowDate)}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center">
                                      {isBookOverdue ? 
                                        <Badge variant="destructive" className="mr-2">Overdue</Badge> : 
                                        borrow.extended ? 
                                          <Badge variant="secondary" className="mr-2">Extended</Badge> : 
                                          null
                                      }
                                      {formatDate(borrow.dueDate)}
                                    </div>
                                    {borrow.extended && (
                                      <div className="text-xs text-muted-foreground mt-1">
                                        Original due: {formatDate(borrow.originalDueDate || '')}
                                      </div>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {isBookOverdue ? (
                                      <div className="flex items-center text-destructive">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        <span>
                                          <span className="font-medium">${fine.toFixed(2)}</span> fine
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center text-green-600">
                                        <Check className="h-4 w-4 mr-1" />
                                        <span>On time</span>
                                      </div>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      {/* Return Book */}
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button 
                                            variant="outline" 
                                            size="sm" 
                                            disabled={actionLoading === borrow.id}
                                            className="border-library-primary text-library-primary hover:bg-library-primary hover:text-white"
                                          >
                                            {actionLoading === borrow.id ? (
                                              <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                              <BookX className="h-4 w-4" />
                                            )}
                                            <span className="sr-only md:not-sr-only md:ml-2">Return</span>
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Return Book</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to return "{book?.title}"?
                                              {fine > 0 && (
                                                <div className="mt-2 bg-red-50 text-red-600 p-2 rounded">
                                                  <AlertCircle className="h-4 w-4 inline mr-1" />
                                                  This book is overdue. You will be charged a fine of ${fine.toFixed(2)}.
                                                </div>
                                              )}
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() => handleReturn(borrow.id)}
                                              className="bg-library-primary hover:bg-library-secondary"
                                            >
                                              Return Book
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                      
                                      {/* Extend Loan */}
                                      {!borrow.extended && !isBookOverdue && (
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <Button 
                                              variant="outline" 
                                              size="sm" 
                                              disabled={actionLoading === borrow.id}
                                              className="border-library-primary text-library-primary hover:bg-library-primary hover:text-white"
                                            >
                                              {actionLoading === borrow.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                              ) : (
                                                <RefreshCw className="h-4 w-4" />
                                              )}
                                              <span className="sr-only md:not-sr-only md:ml-2">Extend</span>
                                            </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>Extend Loan</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                Extend your loan for "{book?.title}" by 7 days?
                                                <div className="mt-2 bg-amber-50 text-amber-600 p-2 rounded">
                                                  <AlertCircle className="h-4 w-4 inline mr-1" />
                                                  An extension fee of $2.50 will be applied.
                                                </div>
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                                              <AlertDialogAction
                                                onClick={() => handleExtend(borrow.id)}
                                                className="bg-library-primary hover:bg-library-secondary"
                                              >
                                                Extend Loan
                                              </AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                      )}
                                      
                                      {/* Pay Fine */}
                                      {fine > 0 && (
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <Button 
                                              variant="destructive" 
                                              size="sm" 
                                              disabled={actionLoading === borrow.id}
                                            >
                                              {actionLoading === borrow.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                              ) : (
                                                <CreditCard className="h-4 w-4" />
                                              )}
                                              <span className="sr-only md:not-sr-only md:ml-2">Pay Fine</span>
                                            </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>Pay Fine</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                Pay the overdue fine of ${fine.toFixed(2)} for "{book?.title}"?
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                                              <AlertDialogAction
                                                onClick={() => handlePayFine(borrow.id, fine)}
                                                className="bg-library-primary hover:bg-library-secondary"
                                              >
                                                Pay Fine
                                              </AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                      )}
                                      
                                      {/* View Book Details */}
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-muted-foreground"
                                        onClick={() => navigate(`/books/${borrow.bookId}`)}
                                      >
                                        <ArrowRight className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h3 className="text-lg font-medium mb-2">No Borrowed Books</h3>
                        <p className="text-muted-foreground mb-6">
                          You don't have any books currently checked out.
                        </p>
                        <Button 
                          onClick={() => navigate("/books")}
                          className="bg-library-primary hover:bg-library-secondary"
                        >
                          Browse Books
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Borrowing History</CardTitle>
                    <CardDescription>
                      Books you have borrowed and returned in the past.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {historyBorrows.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Book</TableHead>
                              <TableHead>Borrow Date</TableHead>
                              <TableHead>Return Date</TableHead>
                              <TableHead>Details</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {historyBorrows.map((borrow) => {
                              const book = getBookById(borrow.bookId);
                              
                              return (
                                <TableRow key={borrow.id}>
                                  <TableCell className="font-medium">
                                    <div className="flex items-center">
                                      <div 
                                        className="w-10 h-14 bg-muted rounded mr-2 overflow-hidden"
                                        style={{
                                          backgroundImage: book ? `url(${book.coverImage})` : undefined,
                                          backgroundSize: 'cover',
                                          backgroundPosition: 'center'
                                        }}
                                      />
                                      <div>
                                        <p className="font-medium">{book?.title || "Unknown Book"}</p>
                                        <p className="text-xs text-muted-foreground">{book?.author}</p>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {formatDate(borrow.borrowDate)}
                                  </TableCell>
                                  <TableCell>
                                    {borrow.returnedDate ? formatDate(borrow.returnedDate) : "N/A"}
                                  </TableCell>
                                  <TableCell>
                                    {borrow.extended && (
                                      <Badge className="mr-2">Extended</Badge>
                                    )}
                                    {borrow.fine && borrow.fine > 0 && (
                                      <div className="text-destructive text-sm">
                                        <CreditCard className="h-3 w-3 inline mr-1" />
                                        ${borrow.fine.toFixed(2)} fine paid
                                      </div>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-muted-foreground"
                                      onClick={() => navigate(`/books/${borrow.bookId}`)}
                                    >
                                      <ArrowRight className="h-4 w-4" />
                                      <span className="sr-only md:not-sr-only md:ml-2">View</span>
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h3 className="text-lg font-medium mb-2">No Borrowing History</h3>
                        <p className="text-muted-foreground mb-6">
                          You haven't borrowed any books in the past.
                        </p>
                        <Button 
                          onClick={() => navigate("/books")}
                          className="bg-library-primary hover:bg-library-secondary"
                        >
                          Browse Books
                        </Button>
                      </div>
                    )}
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

export default MyBooks;
