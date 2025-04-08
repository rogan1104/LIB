
import React, { createContext, useContext, useState, useEffect } from "react";
import { Book, Borrow, Payment } from "../types";
import { books, borrows, payments, generateId } from "../data/sampleData";
import { useAuth } from "./AuthContext";
import { useNotifications } from "./NotificationContext";
import { toast } from "@/components/ui/use-toast";

interface LibraryContextType {
  books: Book[];
  filteredBooks: Book[];
  userBorrows: Borrow[];
  payments: Payment[];
  searchBooks: (query: string) => void;
  borrowBook: (bookId: string) => Promise<void>;
  returnBook: (borrowId: string) => Promise<void>;
  extendBorrow: (borrowId: string) => Promise<void>;
  makePayment: (borrowId: string, amount: number) => Promise<void>;
  getBookById: (id: string) => Book | undefined;
  getBorrowById: (id: string) => Borrow | undefined;
  calculateFine: (borrowId: string) => number;
  isLoading: boolean;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  const [libraryBooks, setLibraryBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [userBorrows, setUserBorrows] = useState<Borrow[]>([]);
  const [userPayments, setUserPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with sample data
  useEffect(() => {
    setLibraryBooks(books);
    setFilteredBooks(books);
    setIsLoading(false);
  }, []);

  // Update user borrows when user changes
  useEffect(() => {
    if (user) {
      const userBorrowList = borrows.filter(b => b.userId === user.id);
      setUserBorrows(userBorrowList);
      
      const userPaymentList = payments.filter(p => p.userId === user.id);
      setUserPayments(userPaymentList);
    } else {
      setUserBorrows([]);
      setUserPayments([]);
    }
  }, [user]);

  const searchBooks = (query: string) => {
    if (!query.trim()) {
      setFilteredBooks(libraryBooks);
      return;
    }
    
    const lowercaseQuery = query.toLowerCase();
    const filtered = libraryBooks.filter(book => 
      book.title.toLowerCase().includes(lowercaseQuery) || 
      book.author.toLowerCase().includes(lowercaseQuery) ||
      book.genre.toLowerCase().includes(lowercaseQuery) ||
      book.isbn.includes(query)
    );
    
    setFilteredBooks(filtered);
  };

  const getBookById = (id: string): Book | undefined => {
    return libraryBooks.find(b => b.id === id);
  };

  const getBorrowById = (id: string): Borrow | undefined => {
    return userBorrows.find(b => b.id === id);
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
    setLibraryBooks(prev =>
      prev.map(b =>
        b.id === bookId
          ? { ...b, availableCopies: b.availableCopies - 1 }
          : b
      )
    );
    
    setFilteredBooks(prev =>
      prev.map(b =>
        b.id === bookId
          ? { ...b, availableCopies: b.availableCopies - 1 }
          : b
      )
    );

    // Add to user borrows
    setUserBorrows(prev => [...prev, newBorrow]);

    // Create notification
    addNotification({
      userId: user.id,
      message: `You have borrowed '${book.title}'.`,
      type: "borrow",
      relatedId: newBorrow.id,
    });

    toast({
      title: "Book Borrowed",
      description: `You have successfully borrowed '${book.title}'. Due date: ${new Date(dueDate).toLocaleDateString()}.`,
    });
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
    setLibraryBooks(prev =>
      prev.map(b =>
        b.id === borrow.bookId
          ? { ...b, availableCopies: b.availableCopies + 1 }
          : b
      )
    );
    
    setFilteredBooks(prev =>
      prev.map(b =>
        b.id === borrow.bookId
          ? { ...b, availableCopies: b.availableCopies + 1 }
          : b
      )
    );

    // Update user borrows
    setUserBorrows(prev =>
      prev.map(b => (b.id === borrowId ? updatedBorrow : b))
    );

    // Create notification
    addNotification({
      userId: user.id,
      message: `You have returned '${book.title}'.${
        fine > 0 ? ` A fine of $${fine.toFixed(2)} has been applied.` : ""
      }`,
      type: "return",
      relatedId: borrowId,
    });

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

    // Create payment record
    const payment: Payment = {
      id: generateId("payment"),
      userId: user.id,
      borrowId,
      amount: extensionFee,
      status: "completed", // In a real app, this would be "pending" until payment is processed
      paymentDate: new Date().toISOString(),
      reason: "Loan extension fee",
    };

    setUserPayments(prev => [...prev, payment]);

    // Create notification
    addNotification({
      userId: user.id,
      message: `Your loan for '${book.title}' has been extended until ${new Date(
        newDueDate
      ).toLocaleDateString()}.`,
      type: "system",
      relatedId: borrowId,
    });

    toast({
      title: "Loan Extended",
      description: `Your loan has been extended until ${new Date(
        newDueDate
      ).toLocaleDateString()}. An extension fee of $${extensionFee.toFixed(
        2
      )} has been applied.`,
    });
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
    setUserBorrows(prev =>
      prev.map(b => (b.id === borrowId ? { ...b, fine: undefined } : b))
    );

    // Create notification
    addNotification({
      userId: user.id,
      message: `You have paid a fine of $${amount.toFixed(2)}.`,
      type: "payment",
      relatedId: borrowId,
    });

    toast({
      title: "Payment Successful",
      description: `You have successfully paid $${amount.toFixed(2)}.`,
    });
  };

  return (
    <LibraryContext.Provider
      value={{
        books: libraryBooks,
        filteredBooks,
        userBorrows,
        payments: userPayments,
        searchBooks,
        borrowBook,
        returnBook,
        extendBorrow,
        makePayment,
        getBookById,
        getBorrowById,
        calculateFine,
        isLoading
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return context;
};
