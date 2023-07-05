import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { type MainNavItem } from "types";
import { siteConfig } from "config/site";
import { cn } from "@/lib/utils";
import { MobileNav } from "@/components/mobile-nav";
import { Icons } from "./icons";

interface MainNavProps {
  items?: MainNavItem[];
  children?: React.ReactNode;
}

export function MainNav({ items, children }: MainNavProps) {
  const router = useRouter();
  const segment = router.pathname.split("/")[1] || "";
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <img src="/favicon.ico" alt="logo" />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map((item, index) => {
            const isActive = item.href.startsWith(`/${segment}`);
            const classNames = cn(
              "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm cursor-pointer",
              isActive ? "text-foreground" : "text-foreground/60",
              item.disabled && "cursor-not-allowed opacity-80"
            );

            return (
              <Link
                key={index}
                href={item.disabled ? "#" : item.href}
                className={classNames}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>
      ) : null}
      <button
        className="flex items-center space-x-2 md:hidden"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? (
          <Icons.close />
        ) : (
          <img src="/favicon.ico" alt="logo" className="h-6 w-6" />
        )}
        <span className="font-bold">Menu</span>
      </button>
      {showMobileMenu && items && (
        <MobileNav items={items}>{children}</MobileNav>
      )}
    </div>
  );
}
