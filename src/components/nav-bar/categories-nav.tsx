"use client";

import { Facultad } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { buttonVariants } from "../ui/button";
import { Badge } from "../ui/badge";

interface FacultadesNavProps {
  facultades: Facultad[];
  pathname: string;
}

export function FacultadesNav({ facultades, pathname }: FacultadesNavProps) {
  const searchParams = useSearchParams();
  const currentFacultadId = searchParams.get("facultadId");

  return (
    <div className="container flex flex-col lg:h-52 m-auto gap-2 p-2">
      <div className="flex items-end justify-between md:h-20">
        <h1 className="text-2xl md:text-4xl font-semibold border-b pb-1">
          Biblioteca
        </h1>
      </div>

      {/* Facultades */}
      <div className="flex flex-wrap items-center lg:h-28 gap-2">
        {facultades.map((fac) => {
          const href = `/search?facultadId=${fac.id}`;

          const isActive = currentFacultadId === fac.id.toString();

          return (
            <Link
              key={fac.id}
              href={href}
              className={cn(
                buttonVariants({ variant: isActive ? "default" : "outline" }),
                isActive && "pointer-events-none"
              )}
            >
              {fac.nombre}
              <Badge variant="secondary" className="ml-2">
                {fac.total_libros && fac.total_libros}
              </Badge>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
