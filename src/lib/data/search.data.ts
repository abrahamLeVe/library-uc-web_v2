import { sql } from "../db";
import { FilterParams, Libros } from "../definitions";

const ITEMS_PER_PAGE = 8;

// 1️⃣ Definimos la URL base (Asegúrate de que coincida con tu .env)
const BUCKET_BASE_URL =
  process.env.NEXT_PUBLIC_BUCKET_URL || "https://tu-bucket.s3.amazonaws.com/";

export async function fetchFilteredBooksGlobal({
  query = "",
  currentPage = 1,
  sortBy = "az",
  facultadId = null,
  carreraId = null,
  especialidadId = null,
  autorId = null,
  palabraId = null, // 🆕 Nuevo parámetro
  yearMin = null,
  yearMax = null,
}: FilterParams): Promise<Libros[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  let whereClauses = sql``;

  // 🔍 Búsqueda por texto
  if (query) {
    whereClauses = sql`${whereClauses} AND (
      l.titulo ILIKE ${`%${query}%`} OR
      l.descripcion ILIKE ${`%${query}%`} OR
      l.isbn ILIKE ${`%${query}%`} OR
      f.nombre ILIKE ${`%${query}%`} OR
      c.nombre ILIKE ${`%${query}%`} OR
      e.nombre ILIKE ${`%${query}%`} OR
      a.nombre ILIKE ${`%${query}%`}
    )`;
  }

  // 🏫 Filtros exactos
  if (facultadId)
    whereClauses = sql`${whereClauses} AND l.facultad_id = ${facultadId}`;
  if (carreraId)
    whereClauses = sql`${whereClauses} AND l.carrera_id = ${carreraId}`;
  if (especialidadId)
    whereClauses = sql`${whereClauses} AND l.especialidad_id = ${especialidadId}`;
  if (autorId) whereClauses = sql`${whereClauses} AND la.autor_id = ${autorId}`;

  // 🏷️ FILTRO POR PALABRA CLAVE (Nuevo)
  // Usamos el alias 'lk' que definiremos en el JOIN abajo
  if (palabraId)
    whereClauses = sql`${whereClauses} AND lk.palabra_id = ${palabraId}`;

  // 📅 Rango de años
  if (yearMin)
    whereClauses = sql`${whereClauses} AND l.anio_publicacion >= ${yearMin}`;
  if (yearMax)
    whereClauses = sql`${whereClauses} AND l.anio_publicacion <= ${yearMax}`;

  // 🔤 Orden
  let orderClause = sql`ORDER BY l.id ASC`;
  if (sortBy === "az") orderClause = sql`ORDER BY l.titulo ASC`;
  if (sortBy === "za") orderClause = sql`ORDER BY l.titulo DESC`;
  if (sortBy === "popular") orderClause = sql`ORDER BY l.created_at DESC`;

  try {
    const results = await sql<Libros[]>`
      SELECT
        l.id,
        l.titulo,
        l.descripcion,
        l.isbn,
        l.anio_publicacion,
        l.editorial,
        l.idioma,
        l.paginas,
        
        -- ⚡ URLs OPTIMIZADAS
        CASE 
            WHEN l.pdf_url IS NOT NULL THEN ${BUCKET_BASE_URL} || l.pdf_url
            ELSE NULL 
        END AS pdf_url,

        CASE 
            WHEN l.examen_pdf_url IS NOT NULL THEN ${BUCKET_BASE_URL} || l.examen_pdf_url
            ELSE NULL 
        END AS examen_pdf_url,

        CASE 
            WHEN l.imagen IS NOT NULL THEN ${BUCKET_BASE_URL} || l.imagen
            ELSE NULL 
        END AS imagen,

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
      
      -- 🆕 JOIN necesario para filtrar por Palabra Clave
      -- Usamos LEFT JOIN para no perder libros que no tengan palabras clave (si no se filtra)
      -- El alias es 'lk' (libros_keywords)
      LEFT JOIN libros_palabras_clave lk ON l.id = lk.libro_id

      WHERE 1=1
      ${whereClauses}
      
      GROUP BY l.id, f.nombre, c.nombre, e.nombre, l.pdf_url, l.examen_pdf_url, l.imagen
      ${orderClause}
      LIMIT ${ITEMS_PER_PAGE}
      OFFSET ${offset};
    `;

    return results;
  } catch (error) {
    console.error("Database Error (fetchFilteredBooksGlobal):", error);
    throw new Error("Failed to fetch filtered books globally.");
  }
}

// Asegúrate de que FilterParams incluya palabraId, o defínelo en los props
export async function fetchBooksGlobalPages({
  query = "",
  facultadId = null,
  carreraId = null,
  especialidadId = null,
  autorId = null,
  palabraId = null, // 🆕 AGREGADO AQUÍ
  yearMin = null,
  yearMax = null,
}: FilterParams): Promise<number> {
  let whereClauses = sql``;

  if (query) {
    whereClauses = sql`${whereClauses} AND (
      l.titulo ILIKE ${`%${query}%`} OR
      l.descripcion ILIKE ${`%${query}%`} OR
      l.isbn ILIKE ${`%${query}%`} OR
      f.nombre ILIKE ${`%${query}%`} OR
      c.nombre ILIKE ${`%${query}%`} OR
      e.nombre ILIKE ${`%${query}%`} OR
      a.nombre ILIKE ${`%${query}%`}
    )`;
  }

  if (facultadId)
    whereClauses = sql`${whereClauses} AND l.facultad_id = ${facultadId}`;
  if (carreraId)
    whereClauses = sql`${whereClauses} AND l.carrera_id = ${carreraId}`;
  if (especialidadId)
    whereClauses = sql`${whereClauses} AND l.especialidad_id = ${especialidadId}`;
  if (yearMin)
    whereClauses = sql`${whereClauses} AND l.anio_publicacion >= ${yearMin}`;
  if (yearMax)
    whereClauses = sql`${whereClauses} AND l.anio_publicacion <= ${yearMax}`;
  if (autorId) whereClauses = sql`${whereClauses} AND la.autor_id = ${autorId}`;

  // 🆕 FILTRO AGREGADO
  if (palabraId)
    whereClauses = sql`${whereClauses} AND lk.palabra_id = ${palabraId}`;

  try {
    const countResult = await sql<{ total: number }[]>`
      SELECT COUNT(DISTINCT l.id) AS total
      FROM libros l
      LEFT JOIN facultades f ON l.facultad_id = f.id
      LEFT JOIN carreras c ON l.carrera_id = c.id
      LEFT JOIN especialidades e ON l.especialidad_id = e.id
      LEFT JOIN libros_autores la ON l.id = la.libro_id
      LEFT JOIN autores a ON la.autor_id = a.id
      
      -- 🆕 JOIN AGREGADO (Necesario para filtrar por palabra clave)
      LEFT JOIN libros_palabras_clave lk ON l.id = lk.libro_id
      
      WHERE 1=1
      ${whereClauses};
    `;

    const total = Number(countResult[0]?.total || 0);
    return Math.ceil(total / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error (fetchBooksGlobalPages):", error);
    throw new Error("Failed to count global books pages.");
  }
}
