import { NextResponse } from "next/server"
// import { ObjectId } from "mongodb"
// import { getSession } from "@/lib/auth"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
// import { experienceSchema } from "@/lib/validations"
import type { Experience } from "@/lib/types"

export async function GET() {
  try {
    const db = await getDatabase()
    const experience = await db
      .collection<Experience>(COLLECTIONS.EXPERIENCE)
      .find()
      .sort({ order: 1, createdAt: -1 })
      .toArray()

    return NextResponse.json(
      experience.map((e) => ({ ...e, _id: e._id?.toString() }))
    )
  } catch (error) {
    console.error("[Experience GET Error]", error)
    return NextResponse.json({ error: "Failed to fetch experience" }, { status: 500 })
  }
}
