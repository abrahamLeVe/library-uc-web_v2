import { TableBooksSkeleton } from "@/components/common/skeleton-entity";
import Pagination from "@/components/search/pagination";
import SearchTable from "@/components/search/table";
import { fetchBooksGlobalPages } from "@/lib/data/search.data";
import { FilterParams } from "@/lib/definitions";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Todos los libros",
};

export default async function Page(props: {
  searchParams?: Promise<FilterParams>;
}) {
  const searchParams = await props.searchParams;

  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const sortBy = searchParams?.sortBy || "az";

  const facultadId = Number(searchParams?.facultadId) || null;
  const carreraId = Number(searchParams?.carreraId) || null;
  const especialidadId = Number(searchParams?.especialidadId) || null;
  const autorId = Number(searchParams?.autorId) || null;
  const palabraId = Number(searchParams?.palabraId) || null;
  const yearMin = Number(searchParams?.yearMin) || null;
  const yearMax = Number(searchParams?.yearMax) || null;

  const totalPages = await fetchBooksGlobalPages({
    query,
    facultadId,
    carreraId,
    especialidadId,
    autorId,
    palabraId,
    yearMin,
    yearMax,
  });

  const suspenseKey = JSON.stringify({
    query,
    currentPage,
    facultadId,
    carreraId,
    especialidadId,
    autorId,
    palabraId,
    yearMin,
    yearMax,
    sortBy,
  });

  return (
    <>
      <h2 className="text-xl md:text-2xl pb-1">Todos los libros</h2>

      <Suspense key={suspenseKey} fallback={<TableBooksSkeleton />}>
        <SearchTable
          query={query}
          currentPage={currentPage}
          facultadId={facultadId}
          carreraId={carreraId}
          especialidadId={especialidadId}
          autorId={autorId}
          palabraId={palabraId}
          yearMin={yearMin}
          yearMax={yearMax}
          sortBy={sortBy}
        />
      </Suspense>

      <div className="flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}
