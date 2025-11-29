// =============================
// DEFINICIONES DE ENTIDADES
// =============================
export interface Entity {
  id: number | string;
  nombre: string;
  total_libros: number;
}

export interface FetchEntityOptions {
  table: string;
  joinTable: string;
  joinColumn: string;
}

// Para agrupar libros por año
export interface LibroPorAnio {
  anio: string;
  total_libros: number;
}

export interface Facultad {
  id: number;
  nombre: string;
  total_libros?: number;
}

export interface Carrera {
  id: number;
  nombre: string;
  facultad_id: number;
}

export interface Especialidad {
  id: number;
  nombre: string;
  // carrera_id: number;
}

export interface Autor {
  id: number;
  nombre: string;
  nacionalidad: string;
}

export interface Libros {
  id: number;
  titulo: string;
  descripcion: string;
  isbn: string;
  anio_publicacion: number;
  editorial: string;
  idioma: string;
  paginas: number;
  pdf_url: string;
  examen_pdf_url: string;
  imagen: string | null;
  facultad_id: number;
  carrera_id: number;
  especialidad_id: number;
  created_at: string;
  video_urls: string[];
  palabra_clave_name?: string[]; // ✅ ahora opcional y se obtiene de la tabla relación

  // Campos adicionales para mostrar en la tabla
  vista_previa?: string;
  autores?: string;
  facultad?: string;
  carrera?: string;
  especialidad?: string;
}

// ✅ NUEVO: Palabras clave
export interface PalabraClave {
  id: number;
  nombre: string;
}

// ✅ NUEVO: Relación libros ↔ palabras clave
export interface LibroPalabraClave {
  libro_id: number;
  palabra_id: number;
}

export interface PalabraClaveFull {
  id: number;
  nombre: string;
  total_libros: number;
  facultades: string[]; // e.g. ["Ingeniería", "Ciencias"]
  carreras: string[]; // e.g. ["Civil", "Sistemas"]
  especialidades: string[]; // e.g. ["Estructuras"]
}

export interface CarreraEspecialidad {
  carrera_id: number;
  especialidad_id: number;
}

export interface FilterParams {
  query: string;
  currentPage?: number;
  facultadId?: number | null;
  carreraId?: number | null;
  especialidadId?: number | null;
  palabraId?: number | null;
  yearMin?: number | null;
  yearMax?: number | null;
  sortBy?: "az" | "za" | "popular";
  page?: string;
  autorId?: number | null;
}

export interface SidebarFiltersProps {
  // Datos (provistos por el servidor)
  facultades: Facultad[];
  carreras: Carrera[];
  especialidades: Especialidad[];
  carrerasEspecialidades: CarreraEspecialidad[];

  // Filtros iniciales (opcional)
  initialFilters?: FilterParams;

  // Callback cuando cambian los filtros
  onChange?: (filters: FilterParams) => void;

  // (opcional) Mostrar selector de años
  showYearRange?: boolean;
}

export interface TableEntityProps {
  titleCol: string;
  basePath: string;
  data: { id: string | number; nombre: string; total_libros: number }[];
  showFilters?: boolean;
  isYearTable?: boolean; // ✅ nueva prop para mostrar filtro por año
  filterKey?: string; // 2️⃣ Valor por defecto
}
