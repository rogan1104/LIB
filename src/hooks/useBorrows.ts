
import { useState, useEffect } from "react";
import { Borrow } from "../types";
import { borrows, generateId } from "../data/sampleData";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "../context/AuthContext";

export const useBorrows = (getBookById: (id: string) => any, updateBookAvailability: (bookId: string, increment: boolean) => void) => {
  const { user } = useAuth();
  const [userBorrows, setUserBorrows] = useState<Borrow[]>([]);

  // Update user borrows when user changes
  useEffect(() => {
    if (user) {
      const userBorrowList = borrows.filter(b => b.userId === user.id);
      setUserBorrows(userBorrowList);
    } else {
      setUserBorrows([]);
    }
  }, [user]);

  const getBorrowById = (id: string): Borrow | undefined => {
    return userBorrows.find(b => b.id === id);
  };

  const calculateFine = (borrowId: string): number => {
    const borrow = getBorrowById(borrowId);
    if (!borrow || borrow.returned) return 0;

    const dueDate = new Date(borrow.dueDate);
    const today = new Date();
    
    if (today <= dueDate) return 0;
    
    // Calculate days overdue
    const daysLate = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Fine rate: $0.50 per day
    return daysLate * 0.5;
  };

  const borrowBook = async (bookId: string): Promise<void> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to borrow books.",
        variant: "destructive",
      });
      throw new Error("User not authenticated");
    }

    const book = getBookById(bookId);
    if (!book) {
      toast({
        title: "Error",
        description: "Book not found.",
        variant: "destructive",
      });
      throw new Error("Book not found");
    }

    if (book.availableCopies <= 0) {
      toast({
        title: "Not Available",
        description: "Sorry, there are no available copies of this book.",
        variant: "destructive",
      });
      throw new Error("No available copies");
    }

    // In a real app, this would be an API call
    // For demo, we'll update our local state
    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks loan

    const newBorrow: Borrow = {
      id: generateId("borrow"),
      bookId,
      userId: user.id,
      borrowDate: borrowDate.toISOString(),
      dueDate: dueDate.toISOString(),
      returned: false,
      extended: false,
    };

    // Update books (decrement available copies)
    updateBookAvailability(bookId, false);

    // Add to user borrows
    setUserBorrows(prev => [...prev, newBorrow]);

    toast({
      title: "Book Borrowed",
      description: `You have successfully borrowed '${book.title}'. Due date: ${new Date(dueDate).toLocaleDateString()}.`,
    });
    
    return Promise.resolve();
  };

  const returnBook = async (borrowId: string): Promise<void> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    const borrow = getBorrowById(borrowId);
    if (!borrow) {
      throw new Error("Borrow record not found");
    }

    if (borrow.returned) {
      throw new Error("Book already returned");
    }

    const book = getBookById(borrow.bookId);
    if (!book) {
      throw new Error("Book not found");
    }

    // Calculate fine (if any)
    const fine = calculateFine(borrowId);

    // Update borrow record
    const now = new Date().toISOString();
    const updatedBorrow: Borrow = {
      ...borrow,
      returned: true,
      returnedDate: now,
      fine: fine > 0 ? fine : undefined,
    };

    // Update books (increment available copies)
    updateBookAvailability(borrow.bookId, true);

    // Update user borrows
    setUserBorrows(prev =>
      prev.map(b => (b.id === borrowId ? updatedBorrow : b))
    );

    toast({
      title: "Book Returned",
      description: `You have successfully returned '${book.title}'.${
        fine > 0
          ? ` A fine of $${fine.toFixed(2)} has been applied to your account.`
          : ""
      }`,
    });

    if (fine > 0) {
      // In a real app, this would trigger payment flow
      // For demo, we'll just show a toast
      toast({
        title: "Payment Required",
        description: `Please pay the fine of $${fine.toFixed(2)} for late return.`,
        variant: "destructive",
      });
    }
    
    return Promise.resolve();
  };

  const extendBorrow = async (borrowId: string): Promise<void> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    const borrow = getBorrowById(borrowId);
    if (!borrow) {
      throw new Error("Borrow record not found");
    }

    if (borrow.returned) {
      throw new Error("Cannot extend a returned book");
    }

    if (borrow.extended) {
      throw new Error("This loan has already been extended once");
    }

    const book = getBookById(borrow.bookId);
    if (!book) {
      throw new Error("Book not found");
    }

    // Extension fee
    const extensionFee = 2.50;

    // Calculate new due date (additional 7 days)
    const currentDueDate = new Date(borrow.dueDate);
    const newDueDate = new Date(currentDueDate);
    newDueDate.setDate(currentDueDate.getDate() + 7);

    // Update borrow
    const updatedBorrow: Borrow = {
      ...borrow,
      dueDate: newDueDate.toISOString(),
      extended: true,
      originalDueDate: borrow.dueDate,
    };

    // Update user borrows
    setUserBorrows(prev =>
      prev.map(b => (b.id === borrowId ? updatedBorrow : b))
    );

    toast({
      title: "Loan Extended",
      description: `Your loan has been extended until ${new Date(
        newDueDate
      ).toLocaleDateString()}. An extension fee of $${extensionFee.toFixed(
        2
      )} has been applied.`,
    });
    
    return Promise.resolve();
  };

  const updateBorrowFine = (borrowId: string) => {
    setUserBorrows(prev =>
      prev.map(b => (b.id === borrowId ? { ...b, fine: undefined } : b))
    );
  };

  return {
    userBorrows,
    getBorrowById,
    borrowBook,
    returnBook,
    extendBorrow,
    calculateFine,
    updateBorrowFine
  };
};
