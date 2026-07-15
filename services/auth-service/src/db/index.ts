import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { env } from "../config/env"
import * as schema from "./schema"

export const pool = new Pool({
    connectionString: env.AUTH_DB_URL,
})

export const db = drizzle(pool, { schema })
