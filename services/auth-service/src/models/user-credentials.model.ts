import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { refreshTokens } from "./refresh-token.model"

export const userCredentials = pgTable("user_credentials", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    displayName: text("display_name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const userCredentialsRelations = relations(userCredentials, ({ many }) => ({
    refreshTokens: many(refreshTokens),
}))

export type UserCredentials = typeof userCredentials.$inferSelect
export type NewUserCredentials = typeof userCredentials.$inferInsert