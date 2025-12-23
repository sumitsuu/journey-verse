import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { resolve } from "path";
import { Pool } from "pg";

import * as schema from "../src/lib/db/schema";

config({ path: resolve(process.cwd(), ".env") });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Make sure .env file exists and contains DATABASE_URL");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function dropDatabase() {
  try {
    console.log("Dropping all tables...");

    const tables = await db.execute(sql`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `);

    for (const table of tables.rows) {
      const tableName = (table as { tablename: string }).tablename;
      console.log(`Dropping table: ${tableName}`);
      await db.execute(sql.raw(`DROP TABLE IF EXISTS "${tableName}" CASCADE`));
    }

    await db.execute(sql`
      DO $$ 
      DECLARE 
        r RECORD;
      BEGIN
        FOR r IN (SELECT typname FROM pg_type WHERE typtype = 'e') 
        LOOP
          EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
        END LOOP;
      END $$;
    `);

    console.log("Database dropped successfully!");
  } catch (error) {
    console.error("Error dropping database:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

dropDatabase();
