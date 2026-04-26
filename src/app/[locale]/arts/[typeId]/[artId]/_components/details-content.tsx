import { cn } from "@/lib/utils";
import { Calendar, Check, ChevronDown, Clock, Film, Play, Star, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useDetailedViewContext } from "./detailed-view-context-wrapper";

import type { SortOption } from "./detailed-view.types";

type DetailsContentProps = {
  selectedLibraryStatusId: number | null;
  onLibraryStatusChange: (statusId: number) => void;
  onOpenReviewModal: () => void;
  setSelectedImage: (value: string | null) => void;
};

const galleryImages = [
  "https://images.unsplash.com/photo-1688678004647-945d5aaf91c1?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1621276336795-925346853745?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1628089700970-0012c5718efc?w=600&h=400&fit=crop",
];

const ratingBreakdown = [
  { stars: 10, percentage: 10, count: 1000 },
  { stars: 9, percentage: 10, count: 1000 },
  { stars: 8, percentage: 10, count: 1000 },
  { stars: 7, percentage: 10, count: 1000 },
  { stars: 6, percentage: 10, count: 1000 },
  { stars: 5, percentage: 10, count: 1000 },
  { stars: 4, percentage: 10, count: 1000 },
  { stars: 3, percentage: 10, count: 1000 },
  { stars: 2, percentage: 10, count: 1000 },
  { stars: 1, percentage: 10, count: 1000 },
];

export const DetailsContent = ({
  selectedLibraryStatusId,
  onLibraryStatusChange,
  onOpenReviewModal,
  setSelectedImage,
}: DetailsContentProps) => {
  const { art, library, libraryStatuses } = useDetailedViewContext();
  const artDetailsTranslations = useTranslations("ArtDetails");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const sortOptions = [
    { value: "newest" as SortOption, label: artDetailsTranslations("sortNewest") },
    { value: "popular" as SortOption, label: artDetailsTranslations("sortPopular") },
    { value: "highest" as SortOption, label: artDetailsTranslations("sortHighest") },
    { value: "lowest" as SortOption, label: artDetailsTranslations("sortLowest") },
  ];

  const statusIcons = [Play, Check, Star, Star] as const;
  const sortedLibraryStatuses = [...libraryStatuses].sort((a, b) => a.id - b.id);
  const libraryStatusOptions = sortedLibraryStatuses.map((status, index) => ({
    id: status.id,
    label: status.name,
    icon: statusIcons[index] ?? Star,
  }));

  const inLibrary = Boolean(library) || selectedLibraryStatusId !== null;
  const personalRatingRaw = library?.rating;
  const personalRating =
    personalRatingRaw !== null && personalRatingRaw !== undefined && String(personalRatingRaw).length > 0
      ? Number(personalRatingRaw)
      : null;
  const personalRatingDisplay =
    personalRating !== null && !Number.isNaN(personalRating) ? personalRating.toFixed(1) : null;

  return (
    <div className="relative w-full bg-[rgb(5_5_9)]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl bg-card/50 backdrop-blur-sm border border-border/40 p-8 shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-4">{artDetailsTranslations("synopsis")}</h2>
            <p className="text-foreground/90 leading-relaxed text-lg">{art.description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl bg-card/50 backdrop-blur-sm border border-border/40 p-8 shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-6">{artDetailsTranslations("information")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Film className="w-4 h-4" />
                  <span className="text-sm">{artDetailsTranslations("type")}</span>
                </div>
                <p className="font-semibold">{art.type.name}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{artDetailsTranslations("country")}</span>
                </div>
                <p className="font-semibold">{art.country.name}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{artDetailsTranslations("episodes")}</span>
                </div>
                <p className="font-semibold">{artDetailsTranslations("episodesCount", { count: art.episodes })}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{artDetailsTranslations("releaseDate")}</span>
                </div>
                <p className="font-semibold">{art.releaseDate.toLocaleDateString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl bg-card/50 backdrop-blur-sm border border-border/40 p-8 shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-6">{artDetailsTranslations("gallery")}</h2>
            <div className="grid grid-cols-3 gap-4">
              {galleryImages.map((img, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img}
                    alt={artDetailsTranslations("galleryItemAlt", { index: index + 1 })}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-2xl bg-card/50 backdrop-blur-sm border border-border/40 p-8 shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-6">{artDetailsTranslations("trailer")}</h2>
            <div className="relative aspect-video rounded-xl bg-muted/30 flex items-center justify-center group cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary/20 border-4 border-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 text-primary fill-primary ml-1" />
                </div>
                <p className="text-lg font-semibold">{artDetailsTranslations("watchTrailer")}</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                {artDetailsTranslations("userReviews")}
                <span className="text-lg text-muted-foreground font-normal">(0)</span>
              </h2>
              <div className="flex gap-3">
                <div className="relative">
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="px-4 py-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors flex items-center gap-2 text-sm"
                  >
                    <span>{sortOptions.find((opt) => opt.value === sortBy)?.label}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {showSortDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-card/95 backdrop-blur-xl border border-border/40 shadow-2xl overflow-hidden z-50"
                      >
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value);
                              setShowSortDropdown(false);
                            }}
                            className={cn(
                              "w-full px-4 py-2 text-left hover:bg-muted/50 transition-colors text-sm",
                              sortBy === option.value && "bg-primary/10 text-primary"
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={onOpenReviewModal}
                  className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  {artDetailsTranslations("writeReview")}
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-card/50 backdrop-blur-sm border border-border/40 p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Film className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{artDetailsTranslations("noReviewsTitle")}</h3>
              <p className="text-muted-foreground mb-6">{artDetailsTranslations("noReviewsDescription")}</p>
              <button
                onClick={onOpenReviewModal}
                className="px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                {artDetailsTranslations("writeReview")}
              </button>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl bg-card/50 backdrop-blur-sm border border-border/40 p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold mb-4 text-center">{artDetailsTranslations("yourRating")}</h3>
              {!inLibrary ? (
                <p className="text-center text-sm text-muted-foreground leading-relaxed">
                  {artDetailsTranslations("yourRatingNeedLibrary")}
                </p>
              ) : personalRatingDisplay === null ? (
                <p className="text-center text-sm text-muted-foreground leading-relaxed">
                  {artDetailsTranslations("yourRatingUnset")}
                </p>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-1 px-4 py-2 rounded-xl bg-yellow-500/20 border border-yellow-500/40 backdrop-blur-md">
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    <span className="text-2xl font-bold text-white">{personalRatingDisplay}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {artDetailsTranslations("youRated", { rating: personalRatingDisplay })}
                  </p>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl bg-card/50 backdrop-blur-sm border border-border/40 p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold mb-6">{artDetailsTranslations("ratingDistribution")}</h3>
              <div className="space-y-4">
                {ratingBreakdown.map((item) => (
                  <div key={item.stars}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1 w-14">
                        <span className="text-sm font-semibold">{item.stars}</span>
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      </div>
                      <div className="flex-1 h-3 rounded-full bg-muted/50 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{
                            delay: 0.6 + item.stars * 0.1,
                            duration: 0.6,
                          }}
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="rounded-2xl bg-card/50 backdrop-blur-sm border border-border/40 p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold mb-4">{artDetailsTranslations("libraryStatus")}</h3>
              <div className="space-y-2">
                {libraryStatusOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => onLibraryStatusChange(option.id)}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all",
                        selectedLibraryStatusId === option.id
                          ? "bg-primary text-white shadow-lg shadow-primary/20"
                          : "bg-muted/30 hover:bg-muted/50"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{option.label}</span>
                      {selectedLibraryStatusId === option.id && <Check className="w-5 h-5 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
