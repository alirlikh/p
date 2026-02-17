"use client";

import Link, { LinkProps } from "next/link";
import { FC, HTMLAttributes } from "react";
import { usePathname } from "next/navigation";

const NavLink: FC<LinkProps & HTMLAttributes<HTMLAnchorElement>> = ({
  href,
  children,
  className,
  ...props
}) => {
  
  const pathname = usePathname()    
  const activeNav = href === pathname;

  return (
    <Link
      href={href}
      className={`${activeNav ? "text-purple-300" : ""} ${className}  text-gray-300`}
      {...props}
    >
      {children}
    </Link>
  );
};
export default NavLink;
