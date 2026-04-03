import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getSession } from "@/lib/auth"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
import { experienceSchema } from "@/lib/validations"
import type { Experience } from "@/lib/types"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const result = experienceSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    // Get max order
    const maxOrderExp = await db
      .collection<Experience>(COLLECTIONS.EXPERIENCE)
      .findOne({}, { sort: { order: -1 } })

    const newExperience: Omit<Experience, "_id"> = {
      ...result.data,
      companyUrl: result.data.companyUrl || undefined,
      order: (maxOrderExp?.order || 0) + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const insertResult = await db.collection(COLLECTIONS.EXPERIENCE).insertOne(newExperience)

    return NextResponse.json({
      ...newExperience,
      _id: insertResult.insertedId.toString(),
    })
  } catch (error) {
    console.error("[Experience POST Error]", error)
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { _id, ...experienceData } = body

    if (!_id) {
      return NextResponse.json({ error: "Experience ID is required" }, { status: 400 })
    }

    const result = experienceSchema.safeParse(experienceData)
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    const updateResult = await db.collection(COLLECTIONS.EXPERIENCE).updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          ...result.data,
          companyUrl: result.data.companyUrl || undefined,
          updatedAt: new Date(),
        },
      }
    )

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Experience PUT Error]", error)
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 })
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
      return NextResponse.json({ error: "Experience ID is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const deleteResult = await db
      .collection(COLLECTIONS.EXPERIENCE)
      .deleteOne({ _id: new ObjectId(id) })

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Experience DELETE Error]", error)
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 })
  }
}
