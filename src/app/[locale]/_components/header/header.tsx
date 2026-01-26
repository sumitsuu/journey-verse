"use client";

import { Link } from "@/src/i18n/routing";

import { Logo } from "@/components/icons/logo";
import Nav from "./nav";

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 backdrop-blur-xl bg-background/80">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className={"md:block text-xl text-white !flex items-center gap-2"}>
              <span className={"md:inline hidden"}>
                <Logo />
              </span>
              <span className={"md:hidden inline font-bold text-[15px]"}>JourneyVerse</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Nav />
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
