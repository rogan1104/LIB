
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, CheckCircle } from "lucide-react";
import { useLibrary } from "@/context/LibraryContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";

const Payments = () => {
  const { user } = useAuth();
  const { payments, userBorrows, makePayment } = useLibrary();
  const navigate = useNavigate();
  
  const [paymentSimulation, setPaymentSimulation] = useState(false);
  const [selectedBorrow, setSelectedBorrow] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);

  // Get all fines that need to be paid
  const finesPending = userBorrows
    .filter(borrow => borrow.fine && borrow.fine > 0)
    .map(borrow => ({
      borrowId: borrow.id,
      amount: borrow.fine || 0,
      bookId: borrow.bookId
    }));

  // Handle payment
  const handlePayFine = (borrowId: string, amount: number) => {
    const borrow = userBorrows.find(b => b.id === borrowId);
    if (!borrow) return;
    
    setSelectedBorrow(borrow);
    setPaymentAmount(amount);
    setPaymentSimulation(true);
  };

  // Process payment after method selection
  const processPayment = async () => {
    if (!selectedBorrow || !paymentAmount || !paymentMethod) return;
    
    try {
      await makePayment(selectedBorrow.id, paymentAmount);
      
      toast({
        title: "Payment Successful",
        description: `Your payment of $${paymentAmount.toFixed(2)} was successful.`,
      });
      
      setPaymentSimulation(false);
      setSelectedBorrow(null);
      setPaymentMethod(null);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment.",
        variant: "destructive",
      });
    }
  };

  // Select payment method
  const selectPaymentMethod = (method: string) => {
    setPaymentMethod(method);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Payments</h1>
        
        <Tabs defaultValue="fines">
          <TabsList className="mb-6">
            <TabsTrigger value="fines">Pending Fines</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
          </TabsList>
          
          {/* Pending Fines Tab */}
          <TabsContent value="fines">
            <Card>
              <CardHeader>
                <CardTitle>Pending Fines</CardTitle>
                <CardDescription>
                  Fines for late returns that need to be paid.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {finesPending.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Book</TableHead>
                        <TableHead>Fine Amount</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {finesPending.map(fine => {
                        const book = userBorrows.find(b => b.id === fine.borrowId)?.bookId;
                        const bookDetails = book ? { title: "Book Title" } : { title: "Unknown Book" };
                        
                        return (
                          <TableRow key={fine.borrowId}>
                            <TableCell>{bookDetails.title}</TableCell>
                            <TableCell>${fine.amount.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                onClick={() => handlePayFine(fine.borrowId, fine.amount)}
                                variant="default"
                                size="sm"
                              >
                                Pay Fine
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-lg font-medium">No Pending Fines</h3>
                    <p className="text-gray-500 mt-2">You don't have any fines to pay at the moment.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Payment History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  Your payment history for fines and extension fees.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {payments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map(payment => (
                        <TableRow key={payment.id}>
                          <TableCell>{format(new Date(payment.paymentDate), "MMM dd, yyyy")}</TableCell>
                          <TableCell>${payment.amount.toFixed(2)}</TableCell>
                          <TableCell>{payment.reason}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              payment.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {payment.status === "completed" ? "Completed" : "Pending"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium">No Payment History</h3>
                    <p className="text-gray-500 mt-2">You haven't made any payments yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Payment Simulation Dialog */}
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
              <Button 
                type="button" 
                disabled={!paymentMethod}
                onClick={processPayment}
                className="w-full sm:w-auto"
              >
                Pay ${paymentAmount?.toFixed(2)}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
      
      <Footer />
    </div>
  );
};

export default Payments;
