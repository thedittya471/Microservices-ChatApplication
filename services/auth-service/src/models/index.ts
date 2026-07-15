import { db } from "@/db"
import { sql } from "drizzle-orm"

export const initModels = async () => {
    await db.execute(sql`SELECT 1`)
}

export * from "./user-credentials.model"
export * from "./refresh-token.model"