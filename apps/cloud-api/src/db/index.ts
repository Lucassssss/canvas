import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in the environment variables.");
}

// 禁用 postgres 的预取机制 (在无服务环境或者需要防止某些连接泄露的情况下有帮助)
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
