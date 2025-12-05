"use client";

import Link, { LinkProps } from "next/link";
import React, { useCallback } from "react";

interface ScrollLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

const handleScrollToTop = () => {
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, 0);
};

export default function ScrollLink({
  children,
  className,
  ...props
}: ScrollLinkProps) {
  const handleClick = useCallback(() => {
    if (typeof props.href === "string" && props.href.startsWith("http")) return;

    handleScrollToTop();
  }, [props.href]);

  return (
    <Link {...props} className={className} onClick={handleClick} scroll={false}>
      {children}
    </Link>
  );
}
