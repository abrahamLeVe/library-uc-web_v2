import Link from "next/link";
import { fetchFilteredBooksGlobal } from "@/lib/data/search.data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { TableNoResults } from "../common/table-no-results";
import { FilterParams, Libros } from "@/lib/definitions";

export default async function SearchTable({
  query,
  currentPage,
  facultadId,
  carreraId,
  especialidadId,
  palabraId,
  yearMin,
  yearMax,
  sortBy,
  autorId,
}: FilterParams) {
  const libros = await fetchFilteredBooksGlobal({
    query,
    currentPage,
    facultadId,
    carreraId,
    especialidadId,
    palabraId,
    yearMin,
    yearMax,
    sortBy,
    autorId,
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vista previa</TableHead>
          <TableHead>Año</TableHead>
          <TableHead>Título</TableHead>
          <TableHead>Autores</TableHead>
          <TableHead>Facultad</TableHead>
          <TableHead>Carrera</TableHead>
          <TableHead>Especialidad</TableHead>
          <TableHead>Detalles</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {libros.length === 0 ? (
          <TableNoResults />
        ) : (
          /* ✅ Usamos 'libros' directamente */
          libros.map((libro: Libros) => (
            <TableRow key={libro.id}>
              <TableCell>
                {libro.imagen ? (
                  /* Ahora libro.imagen es la URL completa */
                  <img
                    src={libro.imagen}
                    alt={libro.titulo}
                    className="w-16 h-20 object-cover rounded bg-gray-200"
                    loading="lazy" // Buena práctica para listas largas
                  />
                ) : (
                  <div className="w-16 h-20 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                    Sin imagen
                  </div>
                )}
              </TableCell>
              <TableCell>{libro.anio_publicacion ?? "-"}</TableCell>
              <TableCell>
                <Link
                  href={`/book/${libro.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {libro.titulo}
                </Link>
              </TableCell>
              <TableCell>{libro.autores ?? "-"}</TableCell>
              <TableCell>{libro.facultad ?? "-"}</TableCell>
              <TableCell>{libro.carrera ?? "-"}</TableCell>
              <TableCell>{libro.especialidad ?? "-"}</TableCell>
              <TableCell>
                <Link
                  href={`/book/${libro.id}`}
                  className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                >
                  Ver detalle
                </Link>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
