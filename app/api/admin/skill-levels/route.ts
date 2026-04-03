import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getSession } from "@/lib/auth"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
import { skillLevelSchema } from "@/lib/validations"
import type { SkillLevel } from "@/lib/types"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const skillLevels = await db
      .collection<SkillLevel>(COLLECTIONS.SKILL_LEVELS)
      .find()
      .sort({ order: 1 })
      .toArray()

    return NextResponse.json(
      skillLevels.map((s) => ({ ...s, _id: s._id?.toString() }))
    )
  } catch (error) {
    console.error("[Skill Levels GET Error]", error)
    return NextResponse.json({ error: "Failed to fetch skill levels" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const result = skillLevelSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    // Get max order
    const maxOrderLevel = await db
      .collection<SkillLevel>(COLLECTIONS.SKILL_LEVELS)
      .findOne({}, { sort: { order: -1 } })

    const newSkillLevel: Omit<SkillLevel, "_id"> = {
      ...result.data,
      order: (maxOrderLevel?.order || 0) + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const insertResult = await db.collection(COLLECTIONS.SKILL_LEVELS).insertOne(newSkillLevel)

    return NextResponse.json({
      ...newSkillLevel,
      _id: insertResult.insertedId.toString(),
    })
  } catch (error) {
    console.error("[Skill Levels POST Error]", error)
    return NextResponse.json({ error: "Failed to create skill level" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { _id, ...skillLevelData } = body

    if (!_id) {
      return NextResponse.json({ error: "Skill level ID is required" }, { status: 400 })
    }

    const result = skillLevelSchema.safeParse(skillLevelData)
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    const updateResult = await db.collection(COLLECTIONS.SKILL_LEVELS).updateOne(
      { _id: new ObjectId(_id) },
      { $set: { ...result.data, updatedAt: new Date() } }
    )

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: "Skill level not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Skill Levels PUT Error]", error)
    return NextResponse.json({ error: "Failed to update skill level" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Skill level ID is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const deleteResult = await db
      .collection(COLLECTIONS.SKILL_LEVELS)
      .deleteOne({ _id: new ObjectId(id) })

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ error: "Skill level not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Skill Levels DELETE Error]", error)
    return NextResponse.json({ error: "Failed to delete skill level" }, { status: 500 })
  }
}
