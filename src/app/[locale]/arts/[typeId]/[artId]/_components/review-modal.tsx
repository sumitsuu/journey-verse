import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useDetailedViewContext } from "./detailed-view-context-wrapper";

type ReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const ReviewModal = ({ isOpen, onClose }: ReviewModalProps) => {
  const { art } = useDetailedViewContext();
  const commonTranslations = useTranslations("Common");
  const artDetailsTranslations = useTranslations("ArtDetails");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState("");
  const ratingOptions = Array.from({ length: 11 }, (_, index) => index);

  const handleSubmit = () => {
    if (!reviewText || reviewRating === "") {
      return;
    }
    onClose();
    setReviewText("");
    setReviewRating("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl rounded-2xl bg-card border border-border/40 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">{artDetailsTranslations("reviewTitle")}</h3>
                  <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <X className="w-5 h-5" />
                    <span className="sr-only">{artDetailsTranslations("close")}</span>
                  </button>
                </div>
                <p className="text-muted-foreground mt-2">
                  {artDetailsTranslations("reviewSubtitle", { title: art.title })}
                </p>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">{artDetailsTranslations("yourRating")}</label>
                  <Select value={reviewRating} onValueChange={setReviewRating}>
                    <SelectTrigger className="w-full rounded-xl bg-muted/50 border-border/40">
                      {reviewRating === "" ? (
                        <span className="text-muted-foreground">0 - 10</span>
                      ) : (
                        <span>{reviewRating}</span>
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {ratingOptions.map((rating) => (
                        <SelectItem key={rating} value={rating.toString()}>
                          {rating.toString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">{artDetailsTranslations("yourReview")}</label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder={artDetailsTranslations("reviewPlaceholder")}
                    className="w-full h-40 px-4 py-3 rounded-xl bg-muted/50 border border-border/40 focus:border-primary/60 focus:ring-4 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground focus:outline-none transition-all resize-none"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    {artDetailsTranslations("reviewCharCount", { count: reviewText.length, max: 500 })}
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-border/40 flex justify-end gap-3">
                <button onClick={onClose} className="px-6 py-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  {commonTranslations("cancel")}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!reviewText || reviewRating === ""}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {artDetailsTranslations("reviewSubmit")}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
