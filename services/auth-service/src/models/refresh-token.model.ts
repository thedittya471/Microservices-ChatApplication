import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { userCredentials } from "./user-credentials.model"

export const refreshTokens = pgTable("refresh_tokens", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => userCredentials.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
    user: one(userCredentials, {
        fields: [refreshTokens.userId],
        references: [userCredentials.id],
    }),
}))

export type RefreshToken = typeof refreshTokens.$inferSelect
export type NewRefreshToken = typeof refreshTokens.$inferInsert

