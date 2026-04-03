import { NextRequest, NextResponse } from "next/server"
import { authenticateAdmin, createSession, setSessionCookie, ensureAdminExists } from "@/lib/auth"
import { loginSchema } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    // Ensure admin exists on first login attempt
    await ensureAdminExists()

    const body = await request.json()
    
    // Validate input
    const result = loginSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid credentials format" },
        { status: 400 }
      )
    }

    const { username, password } = result.data

    // Authenticate admin
    const admin = await authenticateAdmin(username, password)
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      )
    }

    // Create session
    const token = await createSession(admin)
    await setSessionCookie(token)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Login Error]", error)
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    )
  }
}
