import { openai } from "@ai-sdk/openai";
import { CoreMessage, streamText } from "ai";
import { generateChatbotPrompt } from "./chatbot-prompt";

// 🧠 1. Importamos la función Y el nuevo tipo
import { findSimilarBooks, type BookSearchResult } from "@/lib/data/book.data";

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const userQuery = messages[messages.length - 1].content as string;
  console.log("Consulta del usuario:", userQuery);
  // 🧠 2. Declaramos la variable CON el tipo importado
  let relevantBooks: BookSearchResult[] = [];

  try {
    relevantBooks = await findSimilarBooks(userQuery, 5);
  } catch (error) {
    console.error("Error al buscar libros similares (RAG):", error);
    // No pasa nada, relevantBooks sigue siendo un array vacío
  }

  // 🧠 3. (AUMENTAR) Esto ahora funciona sin errores de tipo

  const chatbotPrompt = generateChatbotPrompt(relevantBooks);
  const result = streamText({
    model: openai("gpt-5-nano"),
    system: chatbotPrompt,
    messages,
    temperature: 0.3,
  });

  return result.toDataStreamResponse();
}
