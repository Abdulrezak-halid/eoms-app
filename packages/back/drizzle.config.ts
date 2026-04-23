import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: process.env.DB_MIG_DIR || "./migrations.dev",
  schema: "./src/modules/*/orm/",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DB_HOST || "",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "",
    ssl: false,
  },
});
