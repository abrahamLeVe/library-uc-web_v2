import TableEntity from "@/components/common/table-entity";
import { fetchEntityConLibrosAll } from "@/lib/data/entity.data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Libros por carrera",
};

export const revalidate = 60;

export default async function Page() {
  const carrerasData = await fetchEntityConLibrosAll({
    table: "carreras",
    joinTable: "libros",
    joinColumn: "carrera_id",
  });

  return (
    <>
      <h2 className="text-xl md:text-2xl pb-2">Buscar por Carrera</h2>
      <div className="flex justify-center">
        <TableEntity
          titleCol="Carrera"
          basePath="/search"
          data={carrerasData}
          showFilters
          filterKey="carreraId"
        />
      </div>
    </>
  );
}
