import { sql } from "../db";
import { Especialidad } from "../definitions";

export async function fetchEspecialidades(): Promise<Especialidad[]> {
  try {
    const data = await sql<Especialidad[]>`
      SELECT 
        id,
        nombre
      FROM especialidades
      ORDER BY nombre ASC
    `;
    return data;
  } catch (error) {
    console.error("Database Error (fetchEspecialidades):", error);
    throw new Error("Failed to fetch specialities.");
  }
}
