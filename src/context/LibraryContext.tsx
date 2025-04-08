
import React, { createContext, useContext } from "react";
import { Book, Borrow, Payment } from "../types";
import { useAuth } from "./AuthContext";
import { useNotifications } from "./NotificationContext";
import { useBooks } from "../hooks/useBooks";
import { useBorrows } from "../hooks/useBorrows";
import { usePayments } from "../hooks/usePayments";

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
  
  // Use our custom hooks to manage state for different entities
  const { 
    books, 
    filteredBooks,
    isLoading, 
    searchBooks, 
    getBookById,
    updateBookAvailability 
  } = useBooks();

  const {
    userBorrows,
    getBorrowById,
    borrowBook: borrowBookBase,
    returnBook: returnBookBase,
    extendBorrow: extendBorrowBase,
    calculateFine,
    updateBorrowFine
  } = useBorrows(getBookById, updateBookAvailability);

  const {
    payments,
    makePayment: makePaymentBase,
    addExtensionPayment
  } = usePayments(updateBorrowFine);

  // Wrapper functions to add notifications
  const borrowBook = async (bookId: string): Promise<void> => {
    if (!user) throw new Error("User not authenticated");
    
    await borrowBookBase(bookId);
    
    const book = getBookById(bookId);
    if (!book) return;
    
    // Create notification
    addNotification({
      userId: user.id,
      message: `You have borrowed '${book.title}'.`,
      type: "borrow",
      relatedId: bookId,
    });
  };

  const returnBook = async (borrowId: string): Promise<void> => {
    if (!user) throw new Error("User not authenticated");
    
    const borrow = getBorrowById(borrowId);
    if (!borrow) throw new Error("Borrow record not found");
    
    const book = getBookById(borrow.bookId);
    if (!book) throw new Error("Book not found");
    
    const fine = calculateFine(borrowId);
    
    await returnBookBase(borrowId);
    
    // Create notification
    addNotification({
      userId: user.id,
      message: `You have returned '${book.title}'.${
        fine > 0 ? ` A fine of $${fine.toFixed(2)} has been applied.` : ""
      }`,
      type: "return",
      relatedId: borrowId,
    });
  };

  const extendBorrow = async (borrowId: string): Promise<void> => {
    if (!user) throw new Error("User not authenticated");
    
    const borrow = getBorrowById(borrowId);
    if (!borrow) throw new Error("Borrow record not found");
    
    const book = getBookById(borrow.bookId);
    if (!book) throw new Error("Book not found");
    
    // Extension fee
    const extensionFee = 2.50;
    
    await extendBorrowBase(borrowId);
    
    // Add extension payment
    addExtensionPayment(user.id, borrowId, extensionFee);
    
    // Calculate new due date (for notification)
    const currentDueDate = new Date(borrow.dueDate);
    const newDueDate = new Date(currentDueDate);
    newDueDate.setDate(currentDueDate.getDate() + 7);
    
    // Create notification
    addNotification({
      userId: user.id,
      message: `Your loan for '${book.title}' has been extended until ${new Date(
        newDueDate
      ).toLocaleDateString()}.`,
      type: "system",
      relatedId: borrowId,
    });
  };

  const makePayment = async (borrowId: string, amount: number): Promise<void> => {
    if (!user) throw new Error("User not authenticated");
    
    await makePaymentBase(borrowId, amount);
    
    // Create notification
    addNotification({
      userId: user.id,
      message: `You have paid a fine of $${amount.toFixed(2)}.`,
      type: "payment",
      relatedId: borrowId,
    });
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        filteredBooks,
        userBorrows,
        payments,
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
