import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
import type { Stat } from "@/lib/types"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const stats = await db
      .collection<Stat>(COLLECTIONS.STATS)
      .find()
      .sort({ order: 1 })
      .toArray()

    return NextResponse.json(
      stats.map((s) => ({ ...s, _id: s._id?.toString() }))
    )
  } catch (error) {
    console.error("[Stats GET Error]", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
