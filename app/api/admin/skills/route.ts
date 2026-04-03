import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getSession } from "@/lib/auth"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
import { skillSchema, skillLevelSchema } from "@/lib/validations"
import type { Skill, SkillLevel } from "@/lib/types"

// Get all skills
export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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

// Create new skill
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, ...data } = body

    const db = await getDatabase()

    if (type === "skill") {
      const result = skillSchema.safeParse(data)
      if (!result.success) {
        return NextResponse.json(
          { error: "Validation failed", details: result.error.flatten() },
          { status: 400 }
        )
      }

      const newSkill: Omit<Skill, "_id"> = {
        ...result.data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const insertResult = await db.collection(COLLECTIONS.SKILLS).insertOne(newSkill)
      return NextResponse.json({ ...newSkill, _id: insertResult.insertedId.toString() })
    } else if (type === "skillLevel") {
      const result = skillLevelSchema.safeParse(data)
      if (!result.success) {
        return NextResponse.json(
          { error: "Validation failed", details: result.error.flatten() },
          { status: 400 }
        )
      }

      const newSkillLevel: Omit<SkillLevel, "_id"> = {
        ...result.data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const insertResult = await db.collection(COLLECTIONS.SKILL_LEVELS).insertOne(newSkillLevel)
      return NextResponse.json({ ...newSkillLevel, _id: insertResult.insertedId.toString() })
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  } catch (error) {
    console.error("[Skills POST Error]", error)
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 })
  }
}

// Update skill
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, _id, ...data } = body

    if (!_id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const db = await getDatabase()

    if (type === "skill") {
      const result = skillSchema.safeParse(data)
      if (!result.success) {
        return NextResponse.json(
          { error: "Validation failed", details: result.error.flatten() },
          { status: 400 }
        )
      }

      await db.collection(COLLECTIONS.SKILLS).updateOne(
        { _id: new ObjectId(_id) },
        { $set: { ...result.data, updatedAt: new Date() } }
      )
    } else if (type === "skillLevel") {
      const result = skillLevelSchema.safeParse(data)
      if (!result.success) {
        return NextResponse.json(
          { error: "Validation failed", details: result.error.flatten() },
          { status: 400 }
        )
      }

      await db.collection(COLLECTIONS.SKILL_LEVELS).updateOne(
        { _id: new ObjectId(_id) },
        { $set: { ...result.data, updatedAt: new Date() } }
      )
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Skills PUT Error]", error)
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 })
  }
}

// Delete skill
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const type = searchParams.get("type")

    if (!id || !type) {
      return NextResponse.json({ error: "ID and type are required" }, { status: 400 })
    }

    const db = await getDatabase()
    const collection = type === "skill" ? COLLECTIONS.SKILLS : COLLECTIONS.SKILL_LEVELS

    await db.collection(collection).deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Skills DELETE Error]", error)
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 })
  }
}
