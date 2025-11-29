import TableEntity from "@/components/common/table-entity";
import { KeywordBadgesAdvanced } from "@/components/keywords/keywords-badges";
import {
  fetchEntityConLibrosAll,
  fetchLibrosPorAnioAll,
} from "@/lib/data/entity.data";
import { fetchPalabrasClaveFullData } from "@/lib/data/Keywords.data";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estadísticas Académicas",
};

export const revalidate = 60;

export default async function StatisticsPage() {
  const [carrerasData, especialidadesData, autoresData, aniosData] =
    await Promise.all([
      fetchEntityConLibrosAll({
        table: "carreras",
        joinTable: "libros",
        joinColumn: "carrera_id",
      }),
      fetchEntityConLibrosAll({
        table: "especialidades",
        joinTable: "libros",
        joinColumn: "especialidad_id",
      }),
      fetchEntityConLibrosAll({
        table: "autores",
        joinTable: "libros_autores",
        joinColumn: "autor_id",
      }),
      fetchLibrosPorAnioAll(),
    ]);

  const palabrasClaveData = await fetchPalabrasClaveFullData();

  return (
    <>
      <h2 className="text-xl md:text-2xl pb-4">Estadísticas de Biblioteca</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <TableEntity
          titleCol="Carrera"
          basePath="/search"
          data={carrerasData}
          filterKey="carreraId"
        />

        <TableEntity
          titleCol="Especialidad"
          basePath="/search"
          data={especialidadesData}
          filterKey="especialidadId"
        />

        <TableEntity
          titleCol="Autor"
          basePath="/search"
          data={autoresData}
          filterKey="autorId"
        />

        <TableEntity
          titleCol="Año"
          basePath="/search"
          data={aniosData}
          isYearTable={true}
        />
      </div>

      <KeywordBadgesAdvanced data={palabrasClaveData} />
    </>
  );
}
