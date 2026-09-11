import { createClient } from "redis";

export const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("error", (error) => {
  console.error("Erro na conexão com Redis:", error);
});

export async function conectarRedis(): Promise<void> {
  if (!redis.isOpen) {
    await redis.connect();
  }
}