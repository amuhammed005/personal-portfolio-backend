import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
)

const PROTECTED_PATHS = ["/damstech-admin-portal"]
const PUBLIC_PATHS = ["/damstech-admin-portal/login"]
const API_PROTECTED_PATHS = ["/api/admin"]
const API_PUBLIC_PATHS = ["/api/admin/auth/login", "/api/admin/auth/logout"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if path needs protection
  const isProtectedPath = PROTECTED_PATHS.some((path) => pathname.startsWith(path))
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname === path)
  const isApiProtected = API_PROTECTED_PATHS.some((path) => pathname.startsWith(path))
  const isApiPublic = API_PUBLIC_PATHS.some((path) => pathname.startsWith(path))

  // Skip public paths
  if (isPublicPath || isApiPublic) {
    return NextResponse.next()
  }

  // Check authentication for protected paths
  if (isProtectedPath || isApiProtected) {
    const token = request.cookies.get("admin_session")?.value

    if (!token) {
      if (isApiProtected) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      return NextResponse.redirect(new URL("/damstech-admin-portal/login", request.url))
    }

    try {
      await jwtVerify(token, JWT_SECRET)
      return NextResponse.next()
    } catch {
      // Invalid token
      if (isApiProtected) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      return NextResponse.redirect(new URL("/damstech-admin-portal/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/damstech-admin-portal/:path*",
    "/api/admin/:path*",
  ],
}
