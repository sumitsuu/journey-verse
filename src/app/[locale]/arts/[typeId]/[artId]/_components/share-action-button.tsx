import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

type ShareActionButtonProps = {
  label: string;
};

export const ShareActionButton = ({ label }: ShareActionButtonProps) => {
  return (
    <Button
      type="button"
      size="xl"
      className="px-6 py-3 rounded-xl bg-black/55 backdrop-blur-md border border-white/35 text-white hover:bg-black/70 transition-colors flex items-center gap-2"
    >
      <Share2 className="size-5" />
      {label}
    </Button>
  );
};
