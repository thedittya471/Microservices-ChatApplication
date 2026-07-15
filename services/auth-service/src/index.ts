import { createApp } from "@/app"
import { createServer } from "node:http"
import { env } from "./config/env"
import { logger } from "./utils/logger"
import { initModels } from "@/models"
import { pool } from "@/db"

const main = async () => {
    try {
        await initModels()

        const app = createApp()
        const server = createServer(app)

        const port = env.AUTH_SERVICE_PORT

        const shutdown = () => {
            logger.info("Shutting down auth service...")

            Promise.all([pool.end()])
                .catch((error: unknown) => {
                    logger.error({ error }, "Error during shutdown tasks")
                })
                .finally(() => {
                    server.close(() => process.exit(0))
                })
        }

        process.on("SIGINT", shutdown)
        process.on("SIGTERM", shutdown)

        server.listen(port, () => {
            logger.info({ port }, "Auth service is running")
        })
    } catch (error) {
        logger.error({ error }, "Failed to start auth service")
        process.exit(1)
    }
}

void main()