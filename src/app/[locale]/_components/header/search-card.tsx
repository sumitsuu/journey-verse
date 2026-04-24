import { Star } from "@/components/icons/star";
import { PICTURE_PLACEHOLDER } from "@/lib/constants";
import { Link } from "@/src/i18n/routing";
import type { FindArtsOutput } from "@/src/lib/services/art/find-arts.service";
import { getFileUrl } from "@/src/lib/utils/file-url";
import { Calendar, Film } from "lucide-react";

type SearchCardProps = {
  item: FindArtsOutput;
  onSelect?: () => void;
};

const SearchCard = ({ item, onSelect }: SearchCardProps) => {
  const releaseYear = new Date(item.releaseDate).getFullYear();
  const previewSrc = item.previewPath ? getFileUrl(item.previewPath) : PICTURE_PLACEHOLDER;

  return (
    <Link
      href={`/arts/${item.type.id}/${item.id}`}
      onClick={onSelect}
      className="group flex items-center gap-4 rounded-xl border border-transparent p-3 transition-all hover:border-primary/30 hover:bg-primary/10 focus-visible:border-primary/40 focus-visible:bg-primary/10"
    >
      <div className="relative h-[96px] w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
        <img
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={previewSrc}
          alt={item.title}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-1 font-semibold text-foreground transition-colors group-hover:text-primary">
              {item.title}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Film className="size-3.5" />
                {item.type.name}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-3.5" />
                {releaseYear}
              </span>
            </div>
          </div>

          {item.rating && (
            <div className="inline-flex flex-shrink-0 items-center gap-1 rounded-lg bg-black/40 px-2 py-1 text-xs font-semibold text-white">
              <Star className="size-3.5" />
              {Number(item.rating).toFixed(1)}
            </div>
          )}
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {item.genres.slice(0, 3).map((genre) => (
            <span key={genre.id} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {genre.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default SearchCard;
