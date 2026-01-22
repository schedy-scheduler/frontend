import type { ReactNode } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface IModalProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  cancelButtonText?: string;
  confirmButtonText?: string;
  onConfirmButtonClick?: () => void;
  deleteButtonText?: string;
  onDeleteButtonClick?: () => void;
  children: ReactNode;
}

export const Modal: React.FC<IModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  cancelButtonText = "Cancelar",
  confirmButtonText,
  onConfirmButtonClick,
  deleteButtonText,
  onDeleteButtonClick,
  children,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-sm">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-xs">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {children}
        <DialogFooter className="flex justify-between">
          <div>
            {deleteButtonText && (
              <Button variant="destructive" onClick={onDeleteButtonClick}>
                {deleteButtonText}
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline">{cancelButtonText}</Button>
            </DialogClose>
            {confirmButtonText && (
              <Button onClick={onConfirmButtonClick}>
                {confirmButtonText}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
