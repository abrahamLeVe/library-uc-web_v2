import { ReactNode } from "react";

import SidebarFilters from "@/components/search/sidebar-filters";
import { fetchCarreras } from "@/lib/data/career.data";
import { fetchCarrerasEspecialidades } from "@/lib/data/careerfaculty.data";
import { fetchFacultades } from "@/lib/data/faculty.data";
import { fetchEspecialidades } from "@/lib/data/speciality.data";

export default async function SearchLayout({
  children,
}: {
  children: ReactNode;
}) {
  const facultades = await fetchFacultades();
  const carreras = await fetchCarreras();
  const especialidades = await fetchEspecialidades();
  const carrerasEspecialidades = await fetchCarrerasEspecialidades();

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <SidebarFilters
        facultades={facultades}
        carreras={carreras}
        especialidades={especialidades}
        carrerasEspecialidades={carrerasEspecialidades}
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
