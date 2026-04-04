import { NextResponse } from "next/server"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
import type { SkillLevel } from "@/lib/types"

export async function GET() {
  try {

    const db = await getDatabase()
    
    const skillLevels = await db
      .collection<SkillLevel>(COLLECTIONS.SKILL_LEVELS)
      .find()
      .sort({ order: 1 })
      .toArray()
    
    console.log("Skill levels count from DB:", skillLevels.length) // Log raw data for debugging
    console.log("Fetched skill levels:", skillLevels[0]) // Log the first skill level for debugging

    return NextResponse.json(
      skillLevels.map((s) => ({ ...s, _id: s._id?.toString()}))
    )
  } catch (error) {
    console.error("[Skill Levels GET Error]", error)
    return NextResponse.json({ error: "Failed to fetch skill levels" }, { status: 500 })
  }
}
