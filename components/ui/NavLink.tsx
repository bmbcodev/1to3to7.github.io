"use client";

import { useCallback } from "react";
import NextLink from "next/link";
import type { LinkProps as NextLinkProps } from "next/link";
import { useNavLoading } from "./NavLoadingContext";

interface LinkProps extends NextLinkProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function Link({ href, children, className, onClick, ...props }: LinkProps) {
  const { startLoading } = useNavLoading();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      startLoading();
      if (onClick) onClick(e);
    },
    [startLoading, onClick]
  );

  return (
    <NextLink href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </NextLink>
  );
}
