import { sql } from "../db";
import { Entity, PalabraClaveFull } from "../definitions";

export async function fetchPalabrasClaveWithCount(): Promise<Entity[]> {
  try {
    const data = await sql<Entity[]>`
      SELECT
        k.id,
        k.nombre,
        COUNT(lk.libro_id) AS total_libros
      FROM palabras_clave k
      LEFT JOIN libros_palabras_clave lk
        ON k.id = lk.palabra_id
      GROUP BY k.id, k.nombre
      ORDER BY total_libros DESC, k.nombre ASC;
    `;
    return data;
  } catch (error) {
    console.error("❌ Error fetching palabras_clave:", error);
    return [];
  }
}

export async function fetchPalabrasClaveFullData(): Promise<
  PalabraClaveFull[]
> {
  try {
    const data = await sql<PalabraClaveFull[]>`
      SELECT
        k.id,
        k.nombre,
        COUNT(DISTINCT l.id) AS total_libros,
        ARRAY_REMOVE(ARRAY_AGG(DISTINCT f.nombre), NULL) AS facultades,
        ARRAY_REMOVE(ARRAY_AGG(DISTINCT c.nombre), NULL) AS carreras,
        ARRAY_REMOVE(ARRAY_AGG(DISTINCT e.nombre), NULL) AS especialidades
      FROM palabras_clave k
      LEFT JOIN libros_palabras_clave lk ON k.id = lk.palabra_id
      LEFT JOIN libros l ON lk.libro_id = l.id
      LEFT JOIN facultades f ON l.facultad_id = f.id
      LEFT JOIN carreras c ON l.carrera_id = c.id
      LEFT JOIN especialidades e ON l.especialidad_id = e.id
      GROUP BY k.id, k.nombre
      ORDER BY k.nombre ASC;
    `;
    return data;
  } catch (error) {
    console.error("❌ Error fetching palabras clave full data:", error);
    return [];
  }
}
