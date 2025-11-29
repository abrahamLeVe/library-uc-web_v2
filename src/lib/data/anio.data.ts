import { sql } from "../db";

export async function fetchAnios(): Promise<number[]> {
  try {
    const result = await sql<{ anio: number }[]>`
      SELECT DISTINCT anio_publicacion AS anio
      FROM libros
      WHERE anio_publicacion IS NOT NULL
      ORDER BY anio_publicacion DESC
    `;
    return result.map((row) => row.anio);
  } catch (error) {
    console.error("Database Error (fetchAnios):", error);
    throw new Error("Failed to fetch years.");
  }
}
