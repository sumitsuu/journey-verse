import { PICTURE_PLACEHOLDER } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { getFileUrl } from "@/src/lib/utils/file-url";
import { Heart, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useDetailedViewContext } from "./detailed-view-context-wrapper";

type StickyActionBarProps = {
  isVisible: boolean;
  isFavorite: boolean;
  setIsFavorite: (value: boolean) => void;
  onOpenReviewModal: () => void;
};

export const StickyActionBar = ({ isVisible, isFavorite, setIsFavorite, onOpenReviewModal }: StickyActionBarProps) => {
  const { art } = useDetailedViewContext();
  const artDetailsTranslations = useTranslations("ArtDetails");

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          className="fixed top-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-b border-border/40 shadow-lg"
        >
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={art.previewPath ? getFileUrl(art.previewPath) : PICTURE_PLACEHOLDER}
                alt={art.title}
                width={100}
                height={100}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-bold">{art.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>{Number(art.rating).toFixed(1) ?? 0}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onOpenReviewModal}
                className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                {artDetailsTranslations("rate")}
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isFavorite ? "bg-red-500 text-white" : "bg-muted hover:bg-muted/80"
                )}
              >
                <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
