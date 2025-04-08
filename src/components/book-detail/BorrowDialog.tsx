
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { format, addDays } from "date-fns";
import { useNotifications } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";

interface BorrowDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  bookTitle: string;
  bookId: string;
}

const BorrowDialog: React.FC<BorrowDialogProps> = ({ open, setOpen, bookTitle, bookId }) => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  
  // Calculate due date (14 days from today)
  const dueDate = addDays(new Date(), 14);
  const formattedDueDate = format(dueDate, "MMMM d, yyyy");
  
  React.useEffect(() => {
    if (open && user) {
      addNotification({
        userId: user.id,
        message: `You have borrowed "${bookTitle}". Due date: ${formattedDueDate}.`,
        type: "borrow",
        relatedId: bookId
      });
    }
  }, [open, user, bookTitle, formattedDueDate, bookId, addNotification]);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book Borrowed Successfully!</DialogTitle>
          <DialogDescription>
            You have successfully borrowed "{bookTitle}". The due date is {formattedDueDate}.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => {
              setOpen(false);
              navigate("/my-books");
            }}
            className="bg-library-primary hover:bg-library-secondary"
          >
            View My Books
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BorrowDialog;
