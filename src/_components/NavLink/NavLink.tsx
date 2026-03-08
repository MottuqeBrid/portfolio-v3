"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LinkProps } from "next/link";
import { ReactNode } from "react";

// Define the props for your custom NavLink component
interface NavLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  activeClassName?: string;
}

const NavLink = ({
  children,
  className,
  activeClassName,
  href,
  ...props
}: NavLinkProps) => {
  const pathname = usePathname();

  // Determine if the current path matches the link's href
  // You might want a more complex match logic (e.g., exact match)
  const isActive = pathname === href;

  // Combine default, passed, and active class names
  const combinedClassName = `${className || ""} ${
    isActive ? activeClassName || "active" : ""
  }`.trim();

  return (
    <Link href={href} className={combinedClassName} {...props}>
      {children}
    </Link>
  );
};

export default NavLink;