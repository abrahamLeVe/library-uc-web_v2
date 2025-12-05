import { openai } from "@ai-sdk/openai";
import { CoreMessage, streamText } from "ai";
import { generateChatbotPrompt } from "./chatbot-prompt";

import { findSimilarBooks, type BookSearchResult } from "@/lib/data/book.data";

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const userQuery = messages[messages.length - 1].content as string;
  // console.log("Consulta del usuario:", userQuery);

  let relevantBooks: BookSearchResult[] = [];

  try {
    relevantBooks = await findSimilarBooks(userQuery, 5);
  } catch (error) {
    console.error("Error al buscar libros similares (RAG):", error);
  }
  const chatbotPrompt = generateChatbotPrompt(relevantBooks);
  const result = streamText({
    model: openai("gpt-4.1-nano"),
    system: chatbotPrompt,
    messages,
    temperature: 0.3,
  });

  return result.toDataStreamResponse();
}
