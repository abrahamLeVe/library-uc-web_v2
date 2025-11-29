"use client";

import { Entity, TableEntityProps } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ClientPagination } from "./client-pagination";
import { TableNoResults } from "./table-no-results";

export default function TableEntity({
  titleCol,
  basePath,
  data,
  showFilters = false,
  isYearTable = false,
  filterKey = "id", // 2️⃣ Valor por defecto
}: TableEntityProps) {
  const ITEMS_PER_PAGE = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"az" | "za" | "popular">("popular");
  const [minBooks, setMinBooks] = useState<number | null>(null);
  const [letter, setLetter] = useState<string | null>(null);
  const [yearRange, setYearRange] = useState<[number, number]>([0, 2050]); // rango inicial

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const filteredData = useMemo(() => {
    return data
      .filter((item) => {
        if (search && !item.nombre.toLowerCase().includes(search.toLowerCase()))
          return false;
        if (
          letter &&
          !item.nombre.charAt(0).toLowerCase().startsWith(letter.toLowerCase())
        )
          return false;
        if (minBooks !== null && item.total_libros < minBooks) return false;

        if (isYearTable) {
          const year = Number(item.nombre);
          if (year < yearRange[0] || year > yearRange[1]) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "az") return a.nombre.localeCompare(b.nombre);
        if (sortBy === "za") return b.nombre.localeCompare(a.nombre);
        if (sortBy === "popular") return b.total_libros - a.total_libros;
        return 0;
      });
  }, [data, search, letter, minBooks, sortBy, yearRange, isYearTable]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, filteredData]);

  const clearFilters = () => {
    setSortBy("popular");
    setMinBooks(null);
    setLetter(null);
    setYearRange([0, 2050]);
    setCurrentPage(1);
  };

  const generateLink = (item: Entity) => {
    if (isYearTable) {
      return `${basePath}?yearMin=${item.nombre}&yearMax=${item.nombre}`;
    }

    return `${basePath}?${filterKey}=${item.id}`;
  };

  return (
    <div
      className={cn("flex flex-col gap-4 w-full", showFilters && "md:flex-row")}
    >
      {showFilters && (
        <Card className="w-full md:w-64 p-4 flex flex-col gap-4">
          <h4 className="font-semibold text-lg">Filtros</h4>

          {/* Orden */}
          <Label className="flex flex-col gap-1">
            Orden
            <Select
              name="orden"
              value={sortBy}
              onValueChange={(value) =>
                setSortBy(value as "az" | "za" | "popular")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Ordenar por..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">
                  Cantidad libros (mayor a menor)
                </SelectItem>
                <SelectItem value="az">A - Z</SelectItem>
                <SelectItem value="za">Z - A</SelectItem>
              </SelectContent>
            </Select>
          </Label>

          {/* Mínimo libros */}
          <Label className="flex flex-col gap-1">
            Mínimo libros
            <Input
              name="min libros"
              type="number"
              placeholder="0"
              value={minBooks ?? ""}
              onChange={(e) =>
                setMinBooks(e.target.value ? parseInt(e.target.value) : null)
              }
            />
          </Label>

          {/* Filtrado por letra */}
          <div className="flex flex-wrap gap-1">
            <Button
              variant={!letter ? "default" : "outline"}
              size="sm"
              onClick={() => setLetter(null)}
            >
              Todos
            </Button>
            {alphabet.map((ch) => (
              <Button
                key={ch}
                variant={letter === ch ? "default" : "outline"}
                size="sm"
                onClick={() => setLetter(ch)}
              >
                {ch}
              </Button>
            ))}
          </div>

          {/* Slider de año solo si es tabla de años */}
          {isYearTable && (
            <div className="flex flex-col gap-1">
              <Label>Año</Label>
              <Slider
                value={yearRange}
                onValueChange={(val: [number, number]) => setYearRange(val)}
                min={0}
                max={2050}
                step={1}
              />
              <p>
                {yearRange[0]} - {yearRange[1]}
              </p>
            </div>
          )}

          <Button variant="outline" onClick={clearFilters}>
            Limpiar filtros
          </Button>
        </Card>
      )}

      {/* Tabla */}
      <div className="flex-1 border rounded-md">
        <div className="p-3 border-b">
          <Label htmlFor={`search-${titleCol}`} className="sr-only">
            Buscar
          </Label>
          <Input
            id={`search-${titleCol}`}
            type="search"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <Table className="w-full border-collapse text-sm">
          <TableHeader>
            <TableRow>
              <TableHead>Libros</TableHead>
              <TableHead>{titleCol}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {/* 4️⃣ AQUI USAMOS LA NUEVA LÓGICA DE LINK */}
                    <Link
                      href={generateLink(item)}
                      className={cn(buttonVariants({ variant: "default" }))}
                    >
                      {item.total_libros}
                    </Link>
                  </TableCell>
                  <TableCell
                    title={item.nombre}
                    className="font-medium truncate"
                  >
                    {/* 4️⃣ AQUI TAMBIÉN */}
                    <Link
                      href={generateLink(item)}
                      className={cn(buttonVariants({ variant: "link" }))}
                    >
                      {item.nombre}
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableNoResults />
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex justify-center p-3 border-t">
            <ClientPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
