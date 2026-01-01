"use client";

import { Notification } from "@/components/icons/notification";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";

import { Link, routing, usePathname } from "@/src/i18n/routing";
import { Locale } from "@/src/lib/i18n/locales";
import { getFileUrl } from "@/src/lib/utils/file-url";
import { Bookmark, Languages } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Image from "next/image";

const Nav = () => {
  const { data: session } = useSession();
  const sessionUser = session?.user;
  const navTranslations = useTranslations("Navigation");
  const pathname = usePathname();

  return (
    <div className={"flex items-center w-max md:gap-3 gap-3"}>
      <Tooltip>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <TooltipTrigger asChild>
              <Button className={"max-w-[40px] hidden md:flex"}>
                <Languages />
              </Button>
            </TooltipTrigger>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {routing.locales.map((locale: Locale) => (
              <DropdownMenuItem key={locale} asChild>
                <Link href={`/${pathname}`} locale={locale}>
                  {locale.toUpperCase()}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipContent>{navTranslations("switchLanguage")}</TooltipContent>
      </Tooltip>

      {!sessionUser && (
        <Button asChild>
          <Link href={"/sign-in"}>{navTranslations("signIn")}</Link>
        </Button>
      )}

      {sessionUser && (
        <>
          <Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TooltipTrigger asChild>
                  <Button className={"max-w-[40px] hidden md:flex"}>
                    <Bookmark />
                  </Button>
                </TooltipTrigger>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{navTranslations("noBookmarks")}</DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent>{navTranslations("bookmarksTooltip")}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TooltipTrigger asChild>
                  <Button className={"max-w-[40px] hidden md:flex"}>
                    <Notification />
                  </Button>
                </TooltipTrigger>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{navTranslations("noNotifications")}</DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent>{navTranslations("notificationsTooltip")}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TooltipTrigger>
                  {sessionUser?.image ? (
                    <Image
                      className={"object-cover rounded-[20px]"}
                      src={getFileUrl(sessionUser.image)}
                      alt=""
                      width={40}
                      height={40}
                      quality={90}
                    />
                  ) : (
                    <div
                      className={
                        "select-none size-[40px] rounded-[20px] text-light-purple-1 bg-black-2 flex items-center justify-center uppercase hover:bg-black-3 duration-300"
                      }
                    >
                      {sessionUser.displayName.split("")[0]}
                      {sessionUser.displayName.split("")[1]}
                    </div>
                  )}
                </TooltipTrigger>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{sessionUser?.displayName}</DropdownMenuLabel>
                  <DropdownMenuLabel>{sessionUser?.email}</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className={"cursor-pointer"} asChild>
                  <Link href={`/users/${sessionUser?.id}`}>{navTranslations("myProfile")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className={"cursor-pointer"} asChild>
                  <Link href={`/users/${sessionUser?.id}/settings`}>{navTranslations("settings")}</Link>
                </DropdownMenuItem>
                <DropdownMenuGroup className={"md:hidden"}>
                  <DropdownMenuItem className={"cursor-pointer"} asChild>
                    <Link href={`/users/${sessionUser?.id}/notifications`}>{navTranslations("notifications")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className={"cursor-pointer"} asChild>
                    <Link href={`/users/${sessionUser?.id}/bookmarks`}>{navTranslations("bookmarks")}</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuItem className={"cursor-pointer"} onClick={() => signOut()}>
                      {navTranslations("signOut")}
                    </DropdownMenuItem>
                  </TooltipTrigger>
                  <TooltipContent side={"bottom"}>{navTranslations("signOutTooltip")}</TooltipContent>
                </Tooltip>
              </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent>{navTranslations("more")}</TooltipContent>
          </Tooltip>
        </>
      )}
    </div>
  );
};

export default Nav;
