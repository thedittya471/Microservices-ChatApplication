import { db } from "@/db"
import { refreshTokens, userCredentials } from "@/models"
import { AuthResponse, RegisterInput } from "@/types/auth"
import { hashPassword, signAccessToken, signRefreshToken } from "@/utils/token"
import { HttpError } from "@chatapp/common/src"
import { eq } from "drizzle-orm"
import crypto from "node:crypto"

const REFRESH_TOKEN_TTL_DAYS = 30

export const register = async (input: RegisterInput): Promise<AuthResponse> => {
    const [existing] = await db
        .select()
        .from(userCredentials)
        .where(eq(userCredentials.email, input.email))
        .limit(1)

    if (existing) {
        throw new HttpError(409, "User with this email already exists")
    }

    const passwordHash = await hashPassword(input.password)

    return await db.transaction(async (tx) => {
        const [user] = await tx
            .insert(userCredentials)
            .values({
                email: input.email,
                displayName: input.displayName,
                passwordHash,
            })
            .returning()

        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_TTL_DAYS)

        const tokenId = crypto.randomUUID()
        const accessToken = signAccessToken({ sub: user.id, email: user.email })
        const refreshToken = signRefreshToken({ sub: user.id, tokenId })

        await tx.insert(refreshTokens).values({
            id: tokenId,
            userId: user.id,
            token: refreshToken,
            expiresAt,
        })

        const userData = {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            createdAt: user.createdAt.toISOString(),
        }

        // TODO: publish event UserRegistered

        return {
            accessToken,
            refreshToken,
            user: userData,
        }
    })
}