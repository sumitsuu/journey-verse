"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useDetailedViewContext } from "../detailed-view-context-wrapper";
import AddToLibraryForm from "./add-to-library-form";

type AddToLibraryDialogProps = {
  onOpenChange: (open: boolean) => void;
  isDialogOpen: boolean;
  initialStatusId: number | null;
};

const AddToLibraryDialog = ({ onOpenChange, isDialogOpen, initialStatusId }: AddToLibraryDialogProps) => {
  const addToLibraryTranslations = useTranslations("AddToLibrary");
  const { library } = useDetailedViewContext();

  return (
    <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
      <DialogContent className="text-foreground">
        <DialogTitle className="text-foreground">{addToLibraryTranslations(library ? "editTitle" : "title")}</DialogTitle>
        <AddToLibraryForm isOpen={isDialogOpen} initialStatusId={initialStatusId} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
};
export default AddToLibraryDialog;
