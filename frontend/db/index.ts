import 'dotenv/config';

console.log('Current DATABASE_URL:', process.env.DATABASE_URL);

import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;
console.log("Attempting database connection...");

if (!databaseUrl) {
  console.error("Database URL is not set in environment variables");
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

console.log("Initializing database connection...");
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

const db = drizzle(pool, { schema });
console.log("Database connection initialized successfully");

export { db };
