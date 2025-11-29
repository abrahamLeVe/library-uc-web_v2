import { ReactNode, Suspense } from "react"; // 👈 1. Importar Suspense

import SidebarFilters from "@/components/search/sidebar-filters";
import { fetchCarreras } from "@/lib/data/career.data";
import { fetchCarrerasEspecialidades } from "@/lib/data/careerfaculty.data";
import { fetchFacultades } from "@/lib/data/faculty.data";
import { fetchEspecialidades } from "@/lib/data/speciality.data";

// Componente de carga para el sidebar (Skeleton visual simple)
function SidebarLoading() {
  return (
    <div className="w-full md:w-64 h-screen bg-gray-100/50 animate-pulse rounded-md hidden md:block" />
  );
}

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
      {/* 2️⃣ ENVUELVE EL SIDEBAR EN SUSPENSE */}
      <Suspense fallback={<SidebarLoading />}>
        <SidebarFilters
          facultades={facultades}
          carreras={carreras}
          especialidades={especialidades}
          carrerasEspecialidades={carrerasEspecialidades}
        />
      </Suspense>

      {/* El contenido principal (page.tsx) ya tiene su propio Suspense, así que esto está bien */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
