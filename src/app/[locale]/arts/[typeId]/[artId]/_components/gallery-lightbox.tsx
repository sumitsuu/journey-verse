import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";

type GalleryLightboxProps = {
  selectedImage: string | null;
  onClose: () => void;
};

export const GalleryLightbox = ({ selectedImage, onClose }: GalleryLightboxProps) => {
  const artDetailsTranslations = useTranslations("ArtDetails");

  return (
    <AnimatePresence>
      {selectedImage && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative max-w-6xl w-full"
            >
              <button
                onClick={onClose}
                className="absolute -top-12 right-0 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
                <span className="sr-only">{artDetailsTranslations("close")}</span>
              </button>
              <Image
                src={selectedImage}
                alt={artDetailsTranslations("galleryAlt")}
                width={1400}
                height={2100}
                sizes="(max-width: 1280px) 90vw, 1152px"
                quality={92}
                className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
