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
import { Bookmark } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Nav = () => {
  const { data: session } = useSession();
  const sessionUser = session?.user;

  return (
    <div className={"flex items-center w-max md:gap-3 gap-3"}>
      {!sessionUser && (
        <Button asChild>
          <Link href={"/sign-in"}>Sign In</Link>
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
                <DropdownMenuLabel>You have no saved bookmarks yet.</DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent>Bookmarks</TooltipContent>
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
                <DropdownMenuLabel>You have no notifications yet.</DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>

          <Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TooltipTrigger>
                  {sessionUser?.path ? (
                    <img
                      className={"size-[40px] object-cover rounded-[20px]"}
                      src={`${process.env.NEXT_PUBLIC_USERS_FILES_URL}/${sessionUser.path}`}
                      alt=""
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
                  <Link href={`/users/${sessionUser?.id}`}>My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className={"cursor-pointer"} asChild>
                  <Link href={`/users/${sessionUser?.id}/settings`}>Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuGroup className={"md:hidden"}>
                  <DropdownMenuItem className={"cursor-pointer"} asChild>
                    <Link href={`/users/${sessionUser?.id}/notifications`}>Notifications</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className={"cursor-pointer"} asChild>
                    <Link href={`/users/${sessionUser?.id}/bookmarks`}>Bookmarks</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuItem className={"cursor-pointer"} onClick={() => signOut()}>
                      Sign Out
                    </DropdownMenuItem>
                  </TooltipTrigger>
                  <TooltipContent side={"bottom"}>Maybe we will meet again</TooltipContent>
                </Tooltip>
              </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent>More...</TooltipContent>
          </Tooltip>
        </>
      )}
    </div>
  );
};

export default Nav;
