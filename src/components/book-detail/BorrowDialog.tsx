
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

interface BorrowDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  bookTitle: string;
}

const BorrowDialog: React.FC<BorrowDialogProps> = ({ open, setOpen, bookTitle }) => {
  const navigate = useNavigate();
  
  // Calculate due date (14 days from today)
  const dueDate = addDays(new Date(), 14);
  const formattedDueDate = format(dueDate, "MMMM d, yyyy");
  
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
