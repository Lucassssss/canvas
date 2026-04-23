import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config();

async function reset() {
  console.log("Dropping public schema...");
  const sql = postgres(process.env.DATABASE_URL!);
  await sql`DROP SCHEMA IF EXISTS public CASCADE;`;
  await sql`CREATE SCHEMA public;`;
  await sql`DROP SCHEMA IF EXISTS drizzle CASCADE;`;
  console.log("Database reset complete.");
  process.exit(0);
}

reset();
