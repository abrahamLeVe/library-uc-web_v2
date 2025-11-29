import { sql } from "../db";
import { Autor } from "../definitions";

export async function fetchAutores(): Promise<Autor[]> {
  try {
    const data = await sql<Autor[]>`
      SELECT 
        id,
        nombre,
        nacionalidad
      FROM autores
      ORDER BY nombre ASC
    `;
    return data;
  } catch (error) {
    console.error("Database Error (fetchAutores):", error);
    throw new Error("Failed to fetch authors.");
  }
}
