import { NextResponse } from "next/server"
import { createGuestSession, setSessionCookie } from "@/lib/auth"

export async function POST() {
  const token = await createGuestSession()
  await setSessionCookie(token, 60 * 60 * 24)

  return NextResponse.json({ success: true })
}
