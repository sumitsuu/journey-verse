"use client";

import Link from "next/link";

import { Logo } from "@/components/icons/logo";
import Nav from "./nav";
import SearchComponent from "./search";

function Header() {
  return (
    <div
      className={"py-3 flex justify-center w-full bg-black-1 md:px-10 px-2 h-[65px] border-b-[1px] border-[#E5E8EB]/50"}
    >
      <div className={"w-full md:px-0 flex items-center md:justify-between justify-center md:gap-0 gap-2"}>
        <Link href="/" className={"md:block text-xl text-white !flex items-center gap-2"}>
          <span className={"md:inline hidden"}>
            <Logo />
          </span>
          <span className={"md:hidden inline font-bold text-[15px]"}>JourneyVerse</span>
        </Link>
        <div className={"flex md:gap-3 gap-2 items-end justify-center w-full max-w-max"}>
          <SearchComponent />
          <Nav />
        </div>
      </div>
    </div>
  );
}

export default Header;
