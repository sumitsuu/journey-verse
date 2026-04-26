import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PICTURE_PLACEHOLDER } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Link } from "@/src/i18n/routing";
import { getFileUrl } from "@/src/lib/utils/file-url";
import { Bookmark, Check, ChevronDown, Play, Plus, Star, Trash2, X } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useDetailedViewContext } from "./detailed-view-context-wrapper";
import { FavoriteActionButton } from "./favorite-action-button";
import { ShareActionButton } from "./share-action-button";

type HeroSectionProps = {
  selectedLibraryStatusId: number | null;
  onLibraryStatusChange: (statusId: number) => void;
  onRequestRemoveFromLibrary: () => void;
  isFavorite: boolean;
  setIsFavorite: (value: boolean) => void;
  setShowLibraryDropdown: (value: boolean) => void;
  showLibraryDropdown: boolean;
};

export const HeroSection = ({
  selectedLibraryStatusId,
  onLibraryStatusChange,
  onRequestRemoveFromLibrary,
  isFavorite,
  setIsFavorite,
  showLibraryDropdown,
  setShowLibraryDropdown,
}: HeroSectionProps) => {
  const { art, library, libraryStatuses } = useDetailedViewContext();
  const commonTranslations = useTranslations("Common");
  const artDetailsTranslations = useTranslations("ArtDetails");
  const statusIcons = [Play, Check, Bookmark, X] as const;
  const sortedLibraryStatuses = [...libraryStatuses].sort((a, b) => a.id - b.id);

  const libraryStatusOptions = sortedLibraryStatuses.map((status, index) => ({
    id: status.id,
    label: status.name,
    icon: statusIcons[index] ?? Bookmark,
  }));

  return (
    <div className="relative h-[85vh]">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={art.previewPath ? getFileUrl(art.previewPath) : PICTURE_PLACEHOLDER}
          alt=""
          fill
          sizes="100vw"
          quality={85}
          priority
          className="origin-top scale-105 object-cover object-top blur-xl"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgb(var(--background)) 0%, rgb(var(--background)) 4%, rgb(var(--background) / 0.98) 14%, rgb(var(--background) / 0.88) 28%, rgb(var(--background) / 0.68) 42%, rgb(var(--background) / 0.42) 56%, rgb(var(--background) / 0.2) 72%, rgb(var(--background) / 0.08) 86%, transparent 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/55 to-transparent" />
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
      </div>

      <div className="relative container mx-auto px-4 h-full flex items-end pb-16">
        <Link
          href="/"
          className="absolute top-8 left-4 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition-all flex items-center gap-2 group"
        >
          <span className="text-sm font-medium">{commonTranslations("back")}</span>
        </Link>

        <div className="flex flex-col md:flex-row gap-8 w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-shrink-0"
          >
            <div className="relative w-64 h-96 rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border-4 border-white/10">
              <Image
                src={art.previewPath ? getFileUrl(art.previewPath) : PICTURE_PLACEHOLDER}
                alt={art.title}
                fill
                sizes="(max-width: 768px) 100vw, 256px"
                quality={92}
                className="object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1 flex flex-col justify-end"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-1.5 rounded-full bg-primary/ border border-primary/40 text-primary font-semibold capitalize backdrop-blur-md">
                {art.type.name}
              </span>
              <span className="text-white/80 text-lg">{art.releaseDate.toLocaleDateString()}</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl">{art.title}</h1>

            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 px-4 py-2 rounded-xl bg-yellow-500/20 border border-yellow-500/40 backdrop-blur-md">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  <span className="text-2xl font-bold text-white">{Number(art.rating).toFixed(1) ?? 0}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {art.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <DropdownMenu open={showLibraryDropdown} onOpenChange={setShowLibraryDropdown}>
                <DropdownMenuTrigger asChild>
                  <Button variant="gradient" size="xl">
                    {selectedLibraryStatusId !== null ? (
                      <>
                        <Check className="size-5" />
                        {artDetailsTranslations("inLibraryButton")}
                      </>
                    ) : (
                      <>
                        <Plus className="size-5" />
                        {artDetailsTranslations("addToLibraryButton")}
                      </>
                    )}
                    <ChevronDown className="size-5" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  sideOffset={8}
                  className="z-[100] w-64 rounded-xl bg-card/95 backdrop-blur-xl border-border/40 shadow-2xl p-0"
                >
                  {libraryStatusOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <DropdownMenuItem
                        key={option.id}
                        onClick={() => onLibraryStatusChange(option.id)}
                        className={cn(
                          "px-4 py-3 rounded-none cursor-pointer font-medium",
                          selectedLibraryStatusId === option.id && "bg-primary/10 text-primary"
                        )}
                      >
                        <Icon className="size-5" />
                        <span>{option.label}</span>
                        {selectedLibraryStatusId === option.id && <Check className="w-4 h-4 ml-auto" />}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              {library ? (
                <Button
                  type="button"
                  variant="outline"
                  size="xl"
                  className="rounded-xl border-white/25 bg-black/30 text-white backdrop-blur-md hover:bg-white/10"
                  onClick={onRequestRemoveFromLibrary}
                >
                  <Trash2 className="size-5" />
                  {artDetailsTranslations("deleteFromLibrary")}
                </Button>
              ) : null}

              <FavoriteActionButton
                isFavorite={isFavorite}
                onToggle={() => setIsFavorite(!isFavorite)}
                label={artDetailsTranslations("favorite")}
              />
              <ShareActionButton label={artDetailsTranslations("share")} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
