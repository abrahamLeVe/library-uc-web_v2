import { sql } from "../db";
import { Carrera } from "../definitions";

export async function fetchCarreras(): Promise<Carrera[]> {
  try {
    const data = await sql<Carrera[]>`
      SELECT id, nombre, facultad_id
      FROM carreras
      ORDER BY nombre ASC
    `;
    return data;
  } catch (error) {
    console.error("Database Error (fetchCarreras):", error);
    throw new Error("Failed to fetch careers.");
  }
}
