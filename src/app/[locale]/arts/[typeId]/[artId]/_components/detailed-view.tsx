"use client";

import { toast } from "@/hooks/use-toast";
import { Link, useRouter } from "@/src/i18n/routing";
import { removeArtFromLibraryAction } from "@/src/lib/actions/library/remove-art-from-library.action";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { ConfirmationDialog } from "@/src/app/_components/confirmation-dialog";
import AddToLibraryDialog from "./add-to-library-dialog/add-to-library-dialog";
import { useDetailedViewContext } from "./detailed-view-context-wrapper";
import { DetailsContent } from "./details-content";
import { GalleryLightbox } from "./gallery-lightbox";
import { HeroSection } from "./hero-section";
import { ReviewModal } from "./review-modal";
import { StickyActionBar } from "./sticky-action-bar";

export const DetailedView = () => {
  const artDetailsTranslations = useTranslations("ArtDetails");
  const router = useRouter();
  const { art, library, libraryStatuses } = useDetailedViewContext();
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedLibraryStatusId, setSelectedLibraryStatusId] = useState<number | null>(library?.statusId ?? null);
  const [showLibraryDropdown, setShowLibraryDropdown] = useState(false);
  const [addToLibraryDialogOpen, setAddToLibraryDialogOpen] = useState(false);
  const [addToLibraryInitialStatusId, setAddToLibraryInitialStatusId] = useState<number | null>(null);
  const [removeLibraryConfirmOpen, setRemoveLibraryConfirmOpen] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { mutate: removeFromLibraryMutation } = useMutation({
    mutationFn: removeArtFromLibraryAction,
    onSuccess: () => {
      router.refresh();
      setRemoveLibraryConfirmOpen(false);
      toast({
        title: artDetailsTranslations("removedFromLibrarySuccess"),
        variant: "success",
      });
    },
    onError: () => {
      toast({
        title: artDetailsTranslations("removeFromLibraryError"),
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setSelectedLibraryStatusId(library?.statusId ?? null);
  }, [library?.statusId]);

  const handleLibraryStatusChange = (statusId: number) => {
    const userId = Number(session?.user?.id);

    if (!userId || !libraryStatuses.some((item) => item.id === statusId)) {
      return;
    }

    setAddToLibraryInitialStatusId(statusId);
    setAddToLibraryDialogOpen(true);
    setShowLibraryDropdown(false);
  };

  const handleAddToLibraryDialogOpenChange = (open: boolean) => {
    setAddToLibraryDialogOpen(open);
    if (!open) {
      setAddToLibraryInitialStatusId(null);
    }
  };

  if (!art) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">{artDetailsTranslations("notFoundTitle")}</h1>
          <Link href="/" className="text-primary hover:underline">
            {artDetailsTranslations("notFoundBack")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        selectedLibraryStatusId={selectedLibraryStatusId}
        onLibraryStatusChange={handleLibraryStatusChange}
        onRequestRemoveFromLibrary={() => setRemoveLibraryConfirmOpen(true)}
        isFavorite={isFavorite}
        setIsFavorite={setIsFavorite}
        showLibraryDropdown={showLibraryDropdown}
        setShowLibraryDropdown={setShowLibraryDropdown}
      />
      <div
        aria-hidden
        className="h-14 w-full bg-gradient-to-b from-background via-[rgb(5_5_9)]/45 to-[rgb(5_5_9)] sm:h-20"
      />
      <StickyActionBar
        isVisible={isSticky}
        isFavorite={isFavorite}
        setIsFavorite={setIsFavorite}
        onOpenReviewModal={() => setShowReviewModal(true)}
      />
      <DetailsContent
        selectedLibraryStatusId={selectedLibraryStatusId}
        onLibraryStatusChange={handleLibraryStatusChange}
        onOpenReviewModal={() => setShowReviewModal(true)}
        setSelectedImage={setSelectedImage}
      />
      <ReviewModal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} />
      <GalleryLightbox selectedImage={selectedImage} onClose={() => setSelectedImage(null)} />
      <AddToLibraryDialog
        isDialogOpen={addToLibraryDialogOpen}
        onOpenChange={handleAddToLibraryDialogOpenChange}
        initialStatusId={addToLibraryInitialStatusId}
      />
      <ConfirmationDialog
        isOpen={removeLibraryConfirmOpen}
        onOpenChange={setRemoveLibraryConfirmOpen}
        title={artDetailsTranslations("deleteFromLibrary")}
        description={artDetailsTranslations("deleteFromLibraryDescription")}
        onConfirm={() => {
          const userId = Number(session?.user?.id);
          const libraryId = library ? Number(library.id) : NaN;
          if (library && Number.isFinite(userId) && userId > 0 && Number.isFinite(libraryId) && libraryId > 0) {
            removeFromLibraryMutation({ libraryId, userId });
          }
        }}
      />
    </div>
  );
};
