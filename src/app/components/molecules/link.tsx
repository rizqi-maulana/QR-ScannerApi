"use client"
import Link from "next/link";

interface Props {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export const Links = ({ href, children, className }: Props) => {
  return (
    <Link href={href} className={`hover:underline ${className}`}>
      {children}
    </Link>
  );
}