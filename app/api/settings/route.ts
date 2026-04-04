import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getSession, hashPassword, verifyPassword } from "@/lib/auth"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
import { passwordChangeSchema } from "@/lib/validations"
import type { Admin } from "@/lib/types"

// Get current admin info
export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const admin = await db
      .collection<Admin>(COLLECTIONS.ADMINS)
      .findOne({ _id: new ObjectId(session.adminId) })

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    return NextResponse.json({
      _id: admin._id?.toString(),
      username: admin.username,
      email: admin.email,
      createdAt: admin.createdAt,
    })
  } catch (error) {
    console.error("[Settings GET Error]", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

// Update password
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const result = passwordChangeSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const admin = await db
      .collection<Admin>(COLLECTIONS.ADMINS)
      .findOne({ _id: new ObjectId(session.adminId) })

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    // Verify current password
    const isValidPassword = await verifyPassword(
      result.data.currentPassword,
      admin.password
    )

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await hashPassword(result.data.newPassword)

    // Update password
    await db.collection(COLLECTIONS.ADMINS).updateOne(
      { _id: new ObjectId(session.adminId) },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Settings PUT Error]", error)
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
  }
}
