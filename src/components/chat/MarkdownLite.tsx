"use client";
import Link from "next/link";
import { ReactNode } from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownLiteProps {
  text: string;
}

interface MarkdownLinkProps {
  href?: string;
  children?: ReactNode;
}

interface MarkdownImgProps {
  src?: string | Blob;
  alt?: string;
}

const MarkdownLink = ({ href, children }: MarkdownLinkProps) => {
  if (!href) return <>{children}</>;

  return (
    <Link
      href={href}
      passHref
      className="underline text-blue-600 hover:text-blue-800 break-all"
    >
      {children}
    </Link>
  );
};

const MarkdownImage = ({ src, alt }: MarkdownImgProps) => {
  // Aseguramos que 'src' sea un string no vacío antes de renderizar
  if (!src || typeof src !== "string" || src.trim() === "") {
    return null; // No renderiza nada si la fuente no es válida
  }

  return (
    <img
      src={src.trim()} // Usamos el src validado
      alt={alt || "Carátula de libro"}
      className="aspect-auto rounded-lg overflow-hidden border bg-slate-200"
      loading="eager"
    />
  );
};

export default function MarkdownLite({ text }: MarkdownLiteProps) {
  return (
    <ReactMarkdown
      components={{
        a: ({ ...props }) => <MarkdownLink {...props} />,
        img: MarkdownImage,
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
