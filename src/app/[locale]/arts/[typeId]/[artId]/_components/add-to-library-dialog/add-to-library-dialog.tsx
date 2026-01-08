"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import AddToLibraryForm from "./add-to-library-form";

type AddToLibraryDialogProps = {
  onOpenChange: () => void;
  isDialogOpen: boolean;
};

const AddToLibraryDialog = ({ onOpenChange, isDialogOpen }: AddToLibraryDialogProps) => {
  const addToLibraryTranslations = useTranslations("AddToLibrary");

  return (
    <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>{addToLibraryTranslations("title")}</DialogTitle>
        <AddToLibraryForm onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
};
export default AddToLibraryDialog;
