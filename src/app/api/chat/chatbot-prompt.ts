import { client_url } from "@/lib/urls";
import type { BookSearchResult } from "@/lib/data/book.data";

export function generateChatbotPrompt(libros: BookSearchResult[]): string {
  let bookContext: string;

  // Define la URL base vacía que quieres excluir
  const URL_BASE_VACIA = "https://s3-bicket-alv.s3.amazonaws.com/";

  if (libros.length > 0) {
    bookContext =
      "He encontrado estos libros que coinciden con la búsqueda del usuario:\n\n" +
      libros
        .map((libro) => {
          const imagenLimpia = libro.imagen?.trim() || "";

          // 1. Validar la URL: Se considera válida si existe y es diferente de la URL base vacía.
          const imagenValida =
            imagenLimpia !== "" && imagenLimpia !== URL_BASE_VACIA;

          let encodedUrl = "";

          if (imagenValida) {
            try {
              // 💡 PASO CLAVE: Codificar la URL completa para manejar caracteres especiales.
              // Esto asegura que espacios y otros símbolos se conviertan a %20, %26, etc.
              // Usamos encodeURI para evitar doble codificación si ya estuviera parcialmente codificada.
              encodedUrl = encodeURI(imagenLimpia);
            } catch (e) {
              // En caso de error de codificación, usamos la URL original
              encodedUrl = imagenLimpia;
              console.error("Fallo al codificar URL para Chatbot:", e);
            }
          }

          // 2. Crear el string de Markdown de imagen CONDICIONALMENTE.
          const imagenMarkdown = imagenValida
            ? ` Imagen: ![Carátula del libro](${encodedUrl})\n` // <-- USAMOS LA URL CODIFICADA
            : ""; // Si no es válida, la cadena está vacía

          return (
            `--- Libro ${libro.id} ---\n` + // Delimitador de libro
            `Título: ${libro.titulo}\n` +
            `Autores: ${libro.autores}\n` +
            `Facultad: ${libro.facultad}\n` +
            `Carrera: ${libro.carrera}\n` +
            `Especialidad: ${libro.especialidad}\n` +
            `Enlace: [Ver detalles del libro](${client_url}/book/${libro.id})\n` +
            imagenMarkdown // La imagen ya incluye un salto de línea
          );
        })
        .join("\n");
  } else {
    bookContext =
      "No he encontrado libros que coincidan con la búsqueda del usuario en la base de datos de la biblioteca.";
  }

  const additionalInfo = `
**Contexto de Búsqueda:**
${bookContext}
`;

  return `
Eres un asistente virtual de biblioteca llamado **BiblioBot**, integrado en el sitio web ${client_url}.
Tu función principal es ayudar a los estudiantes a **encontrar libros y materiales académicos** usando **únicamente** el "Contexto de Búsqueda" que te proporciono.

${additionalInfo}

---
**REGLAS ESTRICTAS:**
✅ Responde basándote *exclusivamente* en la información del "Contexto de Búsqueda".

// 🧠 CAMBIO 2: Actualizamos la regla para que el ejemplo sea en Markdown.
✅ Si encuentras libros en el contexto, muéstralos amablemente. Incluye el título, autores, **la imagen si está disponible**, y el enlace directo usando el formato Markdown: [texto descriptivo](enlace) y ![texto alternativo](enlace_imagen).

✅ Si el contexto dice "No he encontrado libros", informa al usuario amablemente que no encontraste resultados para su consulta.
⚠️ No inventes títulos, autores, enlaces ni ninguna otra información. Si no está en el contexto, no lo sabes.
❌ No respondas preguntas fuera del ámbito académico o bibliotecario (temas personales, salud, etc.).
`;
}
