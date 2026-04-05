import { NextRequest, NextResponse } from "next/server"
// import { ObjectId } from "mongodb"
import { getSession } from "@/lib/auth"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
// import { skillSchema, skillLevelSchema } from "@/lib/validations"
import type { Skill, SkillLevel } from "@/lib/types"

// Get all skills
export async function GET() {
  try {
    // const session = await getSession()
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const db = await getDatabase()
    
    const [skills, skillLevels] = await Promise.all([
      db.collection<Skill>(COLLECTIONS.SKILLS).find().sort({ order: 1 }).toArray(),
      db.collection<SkillLevel>(COLLECTIONS.SKILL_LEVELS).find().sort({ order: 1 }).toArray(),
    ])

    return NextResponse.json({
      skills: skills.map((s) => ({ ...s, _id: s._id?.toString() })),
      skillLevels: skillLevels.map((s) => ({ ...s, _id: s._id?.toString() })),
    })
  } catch (error) {
    console.error("[Skills GET Error]", error)
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 })
  }
}
