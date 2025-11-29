import TableEntity from "@/components/common/table-entity";
import { fetchEntityConLibrosAll } from "@/lib/data/entity.data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Libros por especialidades",
};

export const revalidate = 60;

export default async function Page() {
  const especialidadesData = await fetchEntityConLibrosAll({
    table: "especialidades",
    joinTable: "libros",
    joinColumn: "especialidad_id",
  });

  return (
    <>
      <h2 className="text-xl md:text-2xl pb-2">Buscar por especialidades</h2>
      <div className="flex justify-center">
        <TableEntity
          titleCol="Especialidad"
          basePath="/search"
          data={especialidadesData}
          showFilters
          filterKey="especialidadId"
        />
      </div>
    </>
  );
}
