import { Star } from "@/components/icons/star";
import { PICTURE_PLACEHOLDER } from "@/lib/constants";
import { Link } from "@/src/i18n/routing";
import { FindArtsOutput } from "@/src/lib/services/art/find-arts.service";
import { getFileUrl } from "@/src/lib/utils/file-url";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

type CarouselProps = {
  trendingItems: FindArtsOutput[];
};

export const Carousel = ({ trendingItems }: CarouselProps) => {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" });
  const carouselTranslations = useTranslations("Carousel");

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">{carouselTranslations("trendingNow")}</h2>
      </div>

      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex gap-6">
          {trendingItems.map((item: FindArtsOutput, index: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
            >
              <Link href={`/arts/${item.type.id}/${item.id}`}>
                <div className="group relative rounded-2xl overflow-hidden bg-card border border-border/40 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <img
                      src={item.previewPath ? getFileUrl(item.previewPath) : PICTURE_PLACEHOLDER}
                      alt={item.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-semibold">{Number(item.rating).toFixed(1)}</span>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-gray-300">{new Date(item.releaseDate).getFullYear()}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-300 capitalize">{item.type.name || item.type.catalogName}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-300">
                          {item.rating?.toLocaleString()} {carouselTranslations("ratings")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
