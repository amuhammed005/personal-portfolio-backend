import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { getDatabase, COLLECTIONS } from "./mongodb"
import bcrypt from "bcryptjs"
import type { Admin, AdminSession } from "./types"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
)

const COOKIE_NAME = "admin_session"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createSession(admin: Admin): Promise<string> {
  const token = await new SignJWT({
    adminId: admin._id!.toString(),
    username: admin.username,
    email: admin.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(JWT_SECRET)

  return token
}

export async function verifySession(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as AdminSession
  } catch {
    return null
  }
}

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  return verifySession(token)
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function authenticateAdmin(
  username: string,
  password: string
): Promise<Admin | null> {
  const db = await getDatabase()
  const admin = await db.collection<Admin>(COLLECTIONS.ADMINS).findOne({ username })

  if (!admin) {
    return null
  }

  const isValid = await verifyPassword(password, admin.password)
  if (!isValid) {
    return null
  }

  return admin
}

// Initialize admin account if none exists
export async function ensureAdminExists(): Promise<void> {
  const db = await getDatabase()
  const adminCount = await db.collection(COLLECTIONS.ADMINS).countDocuments()

  if (adminCount === 0) {
    const hashedPassword = await hashPassword(
      process.env.ADMIN_INITIAL_PASSWORD || "admin123"
    )
    await db.collection<Admin>(COLLECTIONS.ADMINS).insertOne({
      username: process.env.ADMIN_USERNAME || "admin",
      email: process.env.ADMIN_EMAIL || "admin@example.com",
      password: hashedPassword,
      createdAt: new Date(),
    })
  }
}
