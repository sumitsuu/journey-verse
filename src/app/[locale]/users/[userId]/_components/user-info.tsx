import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "@/src/i18n/routing";
import { getFileUrl } from "@/src/lib/utils/file-url";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { useParams } from "next/navigation";

const StatContainer = ({ title, subtitle, className }: { title: string; subtitle: string; className?: string }) => {
  return (
    <div
      className={`bg-card rounded-lg flex flex-col justify-center items-center w-full h-24 text-center ${className}`}
    >
      <div className="text-white text-lg font-bold">{title}</div>
      <div className="text-sm text-gray-400">{subtitle}</div>
    </div>
  );
};

export default function UserInfo() {
  const { data: session } = useSession();
  const { userId } = useParams();
  const isSameUser = Number(session?.user?.id) === Number(userId);
  const profileTranslations = useTranslations("UserProfile");

  return (
    <div className={"h-[90vh] flex items-center justify-center lg:pb-8"}>
      <div
        className={
          "lg:min-w-[400px] md:min-w-[70%] min-h-[95%] flex flex-col items-center justify-center gap-8 border border-white/10 shadow-2xl rounded-[15px] md:py-8 py-4 lg:py-8"
        }
      >
        <Avatar className="size-[100px]">
          <AvatarImage src={session?.user.image ? getFileUrl(session.user.image) : ""} />
          <AvatarFallback className="bg-card">
            {session?.user.displayName.split("")[0].toUpperCase()}
            {session?.user.displayName.split("")[1].toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className={"flex flex-col items-center gap-2"}>
          <p className={"text-4xl"}>{session?.user.displayName}</p>
          <p className={"text-lg"}>{session?.user.email}</p>
        </div>
        {isSameUser && (
          <div className={"w-full max-w-[75%]"}>
            <Button className={"w-full"} asChild>
              <Link href={`/users/${userId}/settings`}>{profileTranslations("editProfile")}</Link>
            </Button>
          </div>
        )}

        <div className={"grid grid-cols-2 gap-4 w-full max-w-[75%]"}>
          <StatContainer title={"3.9"} subtitle={profileTranslations("averageRating")} />
          <StatContainer title={"123"} subtitle={profileTranslations("ratingsCount")} />
          <StatContainer title={"31"} subtitle={profileTranslations("following")} />
          <StatContainer title={"95"} subtitle={profileTranslations("followers")} />
          <StatContainer title={"12"} subtitle={profileTranslations("lists")} className={"col-span-2"} />
        </div>
      </div>
    </div>
  );
}
