import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in the environment variables.");
}

// connect_timeout: 等待连接建立最多 30s
// idle_timeout: 空闲连接最多保持 60s
// max_lifetime: 连接最长存活时间 300s（启动 IP 查询最长 ~10s，留有余量）
const client = postgres(connectionString, {
  prepare: false,
  connect_timeout: 30,
  idle_timeout: 60,
  max_lifetime: 300,
});

export const db = drizzle(client, { schema });
