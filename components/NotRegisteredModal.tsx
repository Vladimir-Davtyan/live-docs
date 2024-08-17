"use client";

import { Button } from "./ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";

const NotRegisteredModal = ({ isOpen, onClose, email }: NotRegisteredModalProps) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger />
      <DialogContent className="shad-dialog"> 
        <DialogTitle>User Not Registered</DialogTitle>
        <DialogDescription>
          The email <span className="font-bold">{email}</span> is not registered in our system.
        </DialogDescription>
        <DialogFooter>
          <Button onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotRegisteredModal;