
export type UserRole = "student" | "teacher" | "admin";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  branch?: string;
  verified: boolean;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  coverImage: string;
  description: string;
  publishYear: number;
  genre: string;
  copies: number;
  availableCopies: number;
  location: string;
}

export interface Borrow {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: string;
  dueDate: string;
  returned: boolean;
  returnedDate?: string;
  extended: boolean;
  originalDueDate?: string;
  fine?: number;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: "borrow" | "return" | "due" | "payment" | "system";
  read: boolean;
  createdAt: string;
  relatedId?: string; // could be bookId, borrowId, etc.
}

export interface Payment {
  id: string;
  userId: string;
  borrowId?: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  paymentDate: string;
  reason: string;
}
