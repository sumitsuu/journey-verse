import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Art } from "@/src/lib/types/art";
import { Dispatch, SetStateAction } from "react";
import AddToLibraryForm from "./add-to-library-form";

type AddToLibraryModalProps = {
  type: number;
  artId: number;
  maxEpisodes: number;
  handleModal: () => void;
  isDialogOpen: boolean;
  item: Art;
  setIsInLib: Dispatch<SetStateAction<boolean>>;
};

const AddToLibraryModal = ({ handleModal, isDialogOpen, maxEpisodes, item, setIsInLib }: AddToLibraryModalProps) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={handleModal}>
      <DialogContent className={`flex flex-col ${maxEpisodes > 1 ? "h-[375px]" : "h-[250px]"} w-full`}>
        <DialogTitle>Add to Library</DialogTitle>
        <AddToLibraryForm setIsInLib={setIsInLib} handleModal={handleModal} maxEpisodes={maxEpisodes} item={item} />
      </DialogContent>
    </Dialog>
  );
};
export default AddToLibraryModal;
