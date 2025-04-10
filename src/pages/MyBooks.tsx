
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const { userBorrows, getBookById, returnBook, extendBorrow, calculateFine, makePayment, payments } = useLibrary();
  
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [paymentSimulation, setPaymentSimulation] = useState(false);
  const [selectedBorrow, setSelectedBorrow] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  
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
  
  const handlePayFine = (borrowId: string, amount: number) => {
    const borrow = userBorrows.find(b => b.id === borrowId);
    if (!borrow) return;
    
    setSelectedBorrow(borrow);
    setPaymentAmount(amount);
    setPaymentSimulation(true);
  };
  
  const processPayment = async () => {
    if (!selectedBorrow || !paymentAmount || !paymentMethod) return;
    
    setActionLoading(selectedBorrow.id);
    try {
      await makePayment(selectedBorrow.id, paymentAmount);
      
      // Close the payment dialog
      setPaymentSimulation(false);
      setSelectedBorrow(null);
      setPaymentMethod(null);
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  const selectPaymentMethod = (method: string) => {
    setPaymentMethod(method);
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
                                        <Button 
                                          variant="destructive" 
                                          size="sm" 
                                          disabled={actionLoading === borrow.id}
                                          onClick={() => handlePayFine(borrow.id, fine)}
                                        >
                                          {actionLoading === borrow.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                          ) : (
                                            <CreditCard className="h-4 w-4" />
                                          )}
                                          <span className="sr-only md:not-sr-only md:ml-2">Pay Fine</span>
                                        </Button>
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
      
      {/* Payment Dialog */}
      <Dialog open={paymentSimulation} onOpenChange={setPaymentSimulation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pay Fine</DialogTitle>
            <DialogDescription>
              Select a payment method to pay your fine.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              variant={paymentMethod === "credit" ? "default" : "outline"}
              className="flex flex-col items-center justify-center h-24"
              onClick={() => selectPaymentMethod("credit")}
            >
              <CreditCard className="h-8 w-8 mb-2" />
              <span>Credit Card</span>
            </Button>
            
            <Button
              variant={paymentMethod === "paypal" ? "default" : "outline"}
              className="flex flex-col items-center justify-center h-24"
              onClick={() => selectPaymentMethod("paypal")}
            >
              <svg className="h-8 w-8 mb-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.146-.043.299-.066.451-.934 6.323-6.273 7.073-9.511 7.073H8.672c-.398 0-.736.29-.798.686L7.076 21.337zm2.96-17.747a.641.641 0 0 0-.633.74l1.235 7.827a.64.64 0 0 0 .632.54h1.69c2.87 0 6.144-.9 6.761-5.115.035-.96.051-.18.065-.267.212-1.296-.076-2.086-.63-2.653-.576-.589-1.623-1.072-3.21-1.072h-5.91zm7.878 15.764c-.013-.432-.284-.788-.671-.9-1.933-.56-3.677.397-4.621 1.039a.397.397 0 0 0-.106.1.325.325 0 0 0-.073.412c.245.391.867.56 1.533.56 1.097 0 2.068-.398 2.72-.882.645-.477 1.158-1.15 1.218-1.616v-.713z"/>
              </svg>
              <span>PayPal</span>
            </Button>
          </div>
          
          <DialogFooter className="flex-col sm:justify-between sm:space-x-0">
            <div className="flex flex-col w-full space-y-2">
              <div className="flex justify-between items-center px-2 py-1 bg-gray-50 rounded">
                <span className="text-sm">Fine amount:</span>
                <span className="font-medium">${paymentAmount?.toFixed(2)}</span>
              </div>
              
              <Button 
                type="button" 
                disabled={!paymentMethod || actionLoading === selectedBorrow?.id}
                onClick={processPayment}
                className="w-full"
              >
                {actionLoading === selectedBorrow?.id ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CreditCard className="h-4 w-4 mr-2" />
                )}
                Pay Fine
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default MyBooks;
