
import { useState, useEffect } from "react";
import { Payment } from "../types";
import { payments, generateId } from "../data/sampleData";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "../context/AuthContext";

export const usePayments = (updateBorrowFine: (borrowId: string) => void) => {
  const { user } = useAuth();
  const [userPayments, setUserPayments] = useState<Payment[]>([]);

  // Update user payments when user changes
  useEffect(() => {
    if (user) {
      const userPaymentList = payments.filter(p => p.userId === user.id);
      setUserPayments(userPaymentList);
    } else {
      setUserPayments([]);
    }
  }, [user]);

  const makePayment = async (borrowId: string, amount: number): Promise<void> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    // In a real app, this would process payment through a payment gateway
    // For demo, we'll just create a payment record
    
    const newPayment: Payment = {
      id: generateId("payment"),
      userId: user.id,
      borrowId,
      amount,
      status: "completed",
      paymentDate: new Date().toISOString(),
      reason: "Late return fine",
    };

    setUserPayments(prev => [...prev, newPayment]);

    // Update borrow record to clear fine
    updateBorrowFine(borrowId);

    toast({
      title: "Payment Successful",
      description: `You have successfully paid $${amount.toFixed(2)}.`,
    });
    
    return Promise.resolve();
  };

  const addExtensionPayment = (userId: string, borrowId: string, amount: number) => {
    const payment: Payment = {
      id: generateId("payment"),
      userId,
      borrowId,
      amount,
      status: "completed",
      paymentDate: new Date().toISOString(),
      reason: "Loan extension fee",
    };

    setUserPayments(prev => [...prev, payment]);
  };

  return {
    payments: userPayments,
    makePayment,
    addExtensionPayment
  };
};
