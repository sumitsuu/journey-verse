"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

type ConfirmationDialogProps = {
  title: string;
  description: string;
  onConfirm: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ConfirmationDialog = ({
  title,
  description,
  onConfirm,
  isOpen,
  onOpenChange,
}: ConfirmationDialogProps) => {
  const confirmationTranslations = useTranslations("ConfirmationDialog");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {confirmationTranslations("cancel")}
          </Button>
          <Button type="button" onClick={onConfirm}>
            {confirmationTranslations("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
