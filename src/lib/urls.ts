import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_URL: z
    .string()
    .url("Debe ser una URL válida.")
    .default("http://localhost:3001"),
});

const { success, data, error } = envSchema.safeParse(process.env);

if (!success) {
  console.error("X Error en las variables de entorno:", error.format());
  process.exit(1);
}

export const { NEXT_PUBLIC_URL: client_url } = data;
