"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

type ConfirmationDialogProps = {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
  onOpenChange: () => void;
};

export const ConfirmationDialog = ({
  title,
  description,
  onConfirm,
  onCancel,
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
          <Button type="button" onClick={onCancel}>
            {confirmationTranslations("cancel")}
          </Button>
          <Button type="submit" onClick={onConfirm}>
            {confirmationTranslations("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
