import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

type FavoriteActionButtonProps = {
  isFavorite: boolean;
  onToggle: () => void;
  label: string;
};

export const FavoriteActionButton = ({ isFavorite, onToggle, label }: FavoriteActionButtonProps) => {
  return (
    <Button
      type="button"
      onClick={onToggle}
      size="xl"
      className={cn(
        "px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2",
        isFavorite
          ? "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30"
          : "bg-black/55 backdrop-blur-md border border-white/35 text-white hover:bg-black/70"
      )}
    >
      <Heart className={cn("size-5", isFavorite && "fill-current")} />
      {label}
    </Button>
  );
};
