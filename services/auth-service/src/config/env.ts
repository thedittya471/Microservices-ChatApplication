import { fileURLToPath } from "node:url"
import path from "node:path"
import dotenv from "dotenv"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") })

import { createEnv, z } from "@chatapp/common"

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    AUTH_SERVICE_PORT: z.coerce.number().int().min(0).max(65_535).default(4003),
    AUTH_DB_URL: z.string().url(),
    JWT_SECRET: z.string().min(1),
    JWT_REFRESH_TOKEN_SECRET: z.string().min(1),
    JWT_EXPIRES_IN: z.string().min(1).default("15m"),
    JWT_REFRESH_EXPIRES_IN: z.string().min(1).default("7d"),
})

type EnvType = z.infer<typeof envSchema>

export const env: EnvType = createEnv(envSchema, { serviceName: "auth-service" })

export type Env = typeof env