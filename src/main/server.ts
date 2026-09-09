import { buildApp } from "./app.js";

const { app, prisma } = await buildApp();

try {
  await app.listen({
    port: 3000,
    host: "0.0.0.0",
  });
} catch (error) {
  app.log.error(error);

  await prisma.$disconnect();

  process.exit(1);
}