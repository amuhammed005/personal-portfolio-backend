import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
import { personalInfoSchema } from "@/lib/validations"
// import type { PersonalInfo } from "@/lib/types"

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const result = personalInfoSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    // Upsert personal info (there should only be one document)
    await db.collection(COLLECTIONS.PERSONAL_INFO).updateOne(
      {},
      {
        $set: {
          ...result.data,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Personal Info PUT Error]", error)
    return NextResponse.json({ error: "Failed to update personal info" }, { status: 500 })
  }
}
