import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

dotenv.config({
  path: ["../../apps/app/.env.local", "../../apps/app/.env"],
});

export default defineConfig({
  schema: "prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
