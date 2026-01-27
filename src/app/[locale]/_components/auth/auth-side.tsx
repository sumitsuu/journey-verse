import { motion } from "motion/react";

type AuthSideProps = {
  title: string;
  description: string;
};

const backgroundImages = [
  "https://images.unsplash.com/photo-1563202221-f4eae97e4828?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1549394325-200e58997f69?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1567027757540-7b572280fa22?w=800&h=1000&fit=crop",
];

export function AuthSide({ title, description }: AuthSideProps) {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-2 gap-2 p-4">
        {backgroundImages.map((img, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            className={`relative rounded-2xl overflow-hidden ${index === 0 ? "col-span-2 row-span-2" : ""}`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 mix-blend-overlay" />
          </motion.div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      <div className="relative z-10 flex flex-col justify-center px-12">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              JourneyVerse
            </h1>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-white">{title}</h2>
          <p className="text-lg text-gray-300 max-w-md">{description}</p>
        </motion.div>
      </div>

      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
    </div>
  );
}
