import { DiscordIcon } from "@/components/icons/discord";
import { Chrome } from "lucide-react";
import { motion } from "motion/react";

type SignProvidersProps = {
  handleSocialLogin: (provider: string) => void;
};
export const SignProviders = ({ handleSocialLogin }: SignProvidersProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleSocialLogin("google")}
        className="py-3 rounded-xl bg-muted/50 border border-border/40 hover:border-primary/40 hover:bg-muted transition-all flex items-center justify-center group"
      >
        <Chrome className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </motion.button>
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleSocialLogin("discord")}
        className="py-3 rounded-xl bg-muted/50 border border-border/40 hover:border-primary/40 hover:bg-muted transition-all flex items-center justify-center group"
      >
        <DiscordIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </motion.button>
    </div>
  );
};
