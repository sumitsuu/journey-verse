import { Star } from "@/components/icons/star";
import { PICTURE_PLACEHOLDER } from "@/lib/constants";
import { Link } from "@/src/i18n/routing";
import { FindArtsOutput } from "@/src/lib/services/art/find-arts.service";
import { getFileUrl } from "@/src/lib/utils/file-url";
import { Book, BookOpen, Film, Gamepad2, Tv } from "lucide-react";
import { motion } from "motion/react";

const mediaTypeIcons = {
  movie: Film,
  anime: Tv,
  tv: Tv,
  game: Gamepad2,
  book: Book,
  manga: BookOpen,
};

type MediaCardProps = {
  item: FindArtsOutput;
  index: number;
};

export function MediaCard({ item, index }: MediaCardProps) {
  const typeKey = item.type.catalogName.toLowerCase() as keyof typeof mediaTypeIcons;
  const Icon = mediaTypeIcons[typeKey] || Film;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <Link href={`/arts/${item.type.id}/${item.id}`}>
        <div className="group relative rounded-xl overflow-hidden bg-card border border-border/40 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
          {/* Cover Image */}
          <div className="aspect-[2/3] relative overflow-hidden bg-muted">
            <img
              src={item.previewPath ? getFileUrl(item.previewPath) : PICTURE_PLACEHOLDER}
              alt={item.title}
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Type Badge */}
            <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1">
              <Icon className="w-3 h-3 text-white" />
              <span className="text-xs text-white capitalize">{item.type.name || item.type.catalogName}</span>
            </div>

            {/* Rating */}
            {item.rating && (
              <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-white font-semibold">{Number(item.rating).toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4">
            <h3 className="font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{new Date(item.releaseDate).getFullYear()}</span>
              <span>•</span>
              <span>{item.genres[0]?.name || item.country.name}</span>
            </div>
            {item.rating && (
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <span>{Number(item.rating).toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
