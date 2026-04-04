import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getSession } from "@/lib/auth"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
import { statSchema } from "@/lib/validations"
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

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const result = statSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    // Get max order
    const maxOrderStat = await db
      .collection<Stat>(COLLECTIONS.STATS)
      .findOne({}, { sort: { order: -1 } })

    const newStat: Omit<Stat, "_id"> = {
      ...result.data,
      order: (maxOrderStat?.order || 0) + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const insertResult = await db.collection(COLLECTIONS.STATS).insertOne(newStat)

    return NextResponse.json({
      ...newStat,
      _id: insertResult.insertedId.toString(),
    })
  } catch (error) {
    console.error("[Stats POST Error]", error)
    return NextResponse.json({ error: "Failed to create stat" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { _id, ...statData } = body

    if (!_id) {
      return NextResponse.json({ error: "Stat ID is required" }, { status: 400 })
    }

    const result = statSchema.safeParse(statData)
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    const updateResult = await db.collection(COLLECTIONS.STATS).updateOne(
      { _id: new ObjectId(_id) },
      { $set: { ...result.data, updatedAt: new Date() } }
    )

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: "Stat not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Stats PUT Error]", error)
    return NextResponse.json({ error: "Failed to update stat" }, { status: 500 })
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
      return NextResponse.json({ error: "Stat ID is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const deleteResult = await db
      .collection(COLLECTIONS.STATS)
      .deleteOne({ _id: new ObjectId(id) })

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ error: "Stat not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Stats DELETE Error]", error)
    return NextResponse.json({ error: "Failed to delete stat" }, { status: 500 })
  }
}
