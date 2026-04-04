import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getSession } from "@/lib/auth"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
import type { ContactMessage } from "@/lib/types"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const messages = await db
      .collection<ContactMessage>(COLLECTIONS.CONTACTS)
      .find()
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(
      messages.map((m) => ({ ...m, _id: m._id?.toString() }))
    )
  } catch (error) {
    console.error("[Messages GET Error]", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { _id, read } = body

    if (!_id) {
      return NextResponse.json({ error: "Message ID is required" }, { status: 400 })
    }

    const db = await getDatabase()

    const updateResult = await db.collection(COLLECTIONS.CONTACTS).updateOne(
      { _id: new ObjectId(_id) },
      { $set: { read: read ?? true, updatedAt: new Date() } }
    )

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Messages PUT Error]", error)
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 })
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
      return NextResponse.json({ error: "Message ID is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const deleteResult = await db
      .collection(COLLECTIONS.CONTACTS)
      .deleteOne({ _id: new ObjectId(id) })

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Messages DELETE Error]", error)
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 })
  }
}
