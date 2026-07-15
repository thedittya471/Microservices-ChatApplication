import { env } from "@/config/env"
import bcrypt from "bcrypt"
import jwt, { type Secret, type SignOptions } from "jsonwebtoken"

const ACCESS_TOKEN_SECRET: Secret = env.JWT_SECRET
const REFRESH_TOKEN_SECRET: Secret = env.JWT_REFRESH_TOKEN_SECRET

const ACCESS_OPTIONS: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
}
const REFRESH_OPTIONS: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
}

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 12
    return bcrypt.hash(password, saltRounds)
}

export const verifyPassword = async (
    password: string,
    hash: string
): Promise<boolean> => {
    return bcrypt.compare(password, hash)
}

export interface AccessTokenPayload {
    sub: string
    email: string
}

export interface RefreshTokenPayload {
    sub: string
    tokenId: string
}

export const signAccessToken = (payload: AccessTokenPayload): string => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, ACCESS_OPTIONS)
}

export const signRefreshToken = (payload: RefreshTokenPayload): string => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, REFRESH_OPTIONS)
}

export const verifyAccessToken = (token: string): AccessTokenPayload => {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as AccessTokenPayload
}

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as RefreshTokenPayload
}