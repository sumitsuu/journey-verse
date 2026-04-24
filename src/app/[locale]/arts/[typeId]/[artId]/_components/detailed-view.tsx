"use client";

import { Link } from "@/src/i18n/routing";
import { upsertLibraryStatusAction } from "@/src/lib/actions/library/upsert-library-status.action";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useDetailedViewContext } from "./detailed-view-context-wrapper";
import { DetailsContent } from "./details-content";
import { GalleryLightbox } from "./gallery-lightbox";
import { HeroSection } from "./hero-section";
import { ReviewModal } from "./review-modal";
import { StickyActionBar } from "./sticky-action-bar";

export const DetailedView = () => {
  const artDetailsTranslations = useTranslations("ArtDetails");
  const { art, library, libraryStatuses } = useDetailedViewContext();
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedLibraryStatusId, setSelectedLibraryStatusId] = useState<number | null>(library?.statusId ?? null);
  const [showLibraryDropdown, setShowLibraryDropdown] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { mutate: upsertLibraryStatusMutation } = useMutation({
    mutationFn: upsertLibraryStatusAction,
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
    setSelectedLibraryStatusId(statusId);
    const userId = Number(session?.user?.id);

    if (!userId || !libraryStatuses.some((item) => item.id === statusId)) {
      return;
    }

    upsertLibraryStatusMutation({
      artId: art.id,
      userId,
      statusId,
    });
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
        isFavorite={isFavorite}
        setIsFavorite={setIsFavorite}
        showLibraryDropdown={showLibraryDropdown}
        setShowLibraryDropdown={setShowLibraryDropdown}
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
    </div>
  );
};
