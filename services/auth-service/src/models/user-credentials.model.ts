import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core"

export const userCredentials = pgTable("user_credentials", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    displayName: text("display_name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type UserCredentials = typeof userCredentials.$inferSelect
export type NewUserCredentials = typeof userCredentials.$inferInsert