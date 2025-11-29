import { sql } from "../db";
import { Libros } from "../definitions";
import { openai } from "@ai-sdk/openai";
import { embed } from "ai";

const BUCKET_BASE_URL =
  process.env.NEXT_PUBLIC_BUCKET_URL || "https://tu-bucket.s3.amazonaws.com/";

export type BookSearchResult = {
  id: number;
  titulo: string;
  facultad: string;
  carrera: string;
  especialidad: string;
  autores: string;
  imagen?: string | null;
  similarity?: number;
};

export async function findSimilarBooks(
  userQuery: string,
  limit: number = 5,
  threshold: number = 0.35
): Promise<BookSearchResult[]> {
  try {
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: userQuery,
    });
    const queryVector = JSON.stringify(embedding);
    const textQuery = `%${userQuery}%`;

    const libros: BookSearchResult[] = await sql`
      SELECT
        l.id,
        l.titulo,
        
        -- ⚡ OPTIMIZACIÓN: Imagen en resultados de búsqueda
        CASE 
            WHEN l.imagen IS NOT NULL THEN ${BUCKET_BASE_URL} || l.imagen
            ELSE NULL 
        END AS imagen,

        COALESCE(f.nombre, '-') AS facultad,
        COALESCE(c.nombre, '-') AS carrera,
        COALESCE(e.nombre, '-') AS especialidad,
        COALESCE(STRING_AGG(DISTINCT a.nombre, ', '), 'Sin autores') AS autores,
        (1 - (l.embedding <=> ${queryVector})) as similarity
      FROM libros l
      LEFT JOIN facultades f ON l.facultad_id = f.id
      LEFT JOIN carreras c ON l.carrera_id = c.id
      LEFT JOIN especialidades e ON l.especialidad_id = e.id
      LEFT JOIN libros_autores la ON l.id = la.libro_id
      LEFT JOIN autores a ON la.autor_id = a.id
      
      WHERE l.embedding IS NOT NULL
      
      -- Importante: Agregamos l.imagen al GROUP BY
      GROUP BY l.id, f.nombre, c.nombre, e.nombre, l.imagen

      HAVING 
        (1 - (l.embedding <=> ${queryVector})) > ${threshold}
        OR l.titulo ILIKE ${textQuery}
        OR STRING_AGG(a.nombre, ' ') ILIKE ${textQuery}
      
      ORDER BY similarity DESC
      LIMIT ${limit}
    `;

    console.log(`Libros encontrados (Híbrido):`, libros);
    return libros;
  } catch (error) {
    console.error("Database Error (findSimilarBooks):", error);
    throw new Error("Failed to find similar books.");
  }
}

export async function fetchAllLibros(): Promise<Pick<Libros, "id">[]> {
  try {
    const libros = await sql<Pick<Libros, "id">[]>`
      SELECT id FROM libros ORDER BY id ASC
    `;
    return libros;
  } catch (error) {
    console.error("Database Error (fetchAllLibros):", error);
    throw new Error("Failed to fetch all books.");
  }
}

export async function fetchLibroPorId(id: number): Promise<Libros | null> {
  try {
    const [libro] = await sql<Libros[]>`
      SELECT
        l.id,
        l.titulo,
        l.descripcion,
        l.isbn,
        l.anio_publicacion,
        l.editorial,
        l.idioma,
        l.paginas,

        -- ⚡ Construimos URLs completas para los PDFs también
        CASE 
            WHEN l.pdf_url IS NOT NULL THEN ${BUCKET_BASE_URL} || l.pdf_url
            ELSE NULL 
        END AS pdf_url,

        CASE 
            WHEN l.examen_pdf_url IS NOT NULL THEN ${BUCKET_BASE_URL} || l.examen_pdf_url
            ELSE NULL 
        END AS examen_pdf_url,

        -- ⚡ URL completa para la imagen
        CASE 
            WHEN l.imagen IS NOT NULL THEN ${BUCKET_BASE_URL} || l.imagen
            ELSE NULL 
        END AS imagen,

        l.video_urls,
        COALESCE(f.nombre, '-') AS facultad,
        COALESCE(c.nombre, '-') AS carrera,
        COALESCE(e.nombre, '-') AS especialidad,
        COALESCE(STRING_AGG(DISTINCT a.nombre, ', '), 'Sin autores') AS autores
      FROM libros l
      LEFT JOIN facultades f ON l.facultad_id = f.id
      LEFT JOIN carreras c ON l.carrera_id = c.id
      LEFT JOIN especialidades e ON l.especialidad_id = e.id
      LEFT JOIN libros_autores la ON l.id = la.libro_id
      LEFT JOIN autores a ON la.autor_id = a.id
      WHERE l.id = ${id}
      -- Agregamos las columnas modificadas al GROUP BY por seguridad estricta de SQL
      GROUP BY l.id, f.nombre, c.nombre, e.nombre, l.pdf_url, l.examen_pdf_url, l.imagen
      LIMIT 1
    `;
    return libro || null;
  } catch (error) {
    console.error("Database Error (fetchLibroPorId):", error);
    throw new Error("Failed to fetch book by ID.");
  }
}
