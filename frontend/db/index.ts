import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@db/schema";

// Add better error handling and logging for database connection
const databaseUrl = process.env.DATABASE_URL;
console.log("Attempting database connection...");

if (!databaseUrl) {
  console.error("Database URL is not set in environment variables");
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

console.log("Initializing database connection...");
const db = drizzle({
  connection: databaseUrl,
  schema,
  ws: ws,
});
console.log("Database connection initialized successfully");

export { db };