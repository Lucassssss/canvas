import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config();

const runMigration = async () => {
  console.log("⏳ Running migrations...");
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set.");
  }

  // 这里的 max: 1 表示只使用1个连接来执行迁移，执行完就可以关闭
  const migrationClient = postgres(connectionString, { max: 1 });
  const db = drizzle(migrationClient);

  try {
    await migrate(db, { migrationsFolder: "./src/db/migrations" });
    console.log("✅ Migrations complete!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }
};

runMigration();
