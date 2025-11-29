import TableEntity from "@/components/common/table-entity";
import { fetchLibrosPorAnioAll } from "@/lib/data/entity.data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Libros por fecha de publicación",
};

export const revalidate = 60;

export default async function Page() {
  const aniosData = await fetchLibrosPorAnioAll();

  return (
    <>
      <h2 className="text-xl md:text-2xl pb-2">
        Buscar por fecha de publicación
      </h2>
      <div className="flex justify-center">
        <TableEntity
          titleCol="Año"
          basePath="/search"
          data={aniosData}
          showFilters
          isYearTable
        />
      </div>
    </>
  );
}
