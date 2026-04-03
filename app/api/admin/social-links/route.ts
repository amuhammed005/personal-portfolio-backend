import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getSession } from "@/lib/auth"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
import { socialLinkSchema } from "@/lib/validations"
import type { SocialLink } from "@/lib/types"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const socialLinks = await db
      .collection<SocialLink>(COLLECTIONS.SOCIAL_LINKS)
      .find()
      .sort({ order: 1 })
      .toArray()

    return NextResponse.json(
      socialLinks.map((s) => ({ ...s, _id: s._id?.toString() }))
    )
  } catch (error) {
    console.error("[Social Links GET Error]", error)
    return NextResponse.json({ error: "Failed to fetch social links" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const result = socialLinkSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    // Get max order
    const maxOrderLink = await db
      .collection<SocialLink>(COLLECTIONS.SOCIAL_LINKS)
      .findOne({}, { sort: { order: -1 } })

    const newSocialLink: Omit<SocialLink, "_id"> = {
      ...result.data,
      order: (maxOrderLink?.order || 0) + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const insertResult = await db.collection(COLLECTIONS.SOCIAL_LINKS).insertOne(newSocialLink)

    return NextResponse.json({
      ...newSocialLink,
      _id: insertResult.insertedId.toString(),
    })
  } catch (error) {
    console.error("[Social Links POST Error]", error)
    return NextResponse.json({ error: "Failed to create social link" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { _id, ...socialLinkData } = body

    if (!_id) {
      return NextResponse.json({ error: "Social link ID is required" }, { status: 400 })
    }

    const result = socialLinkSchema.safeParse(socialLinkData)
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    const updateResult = await db.collection(COLLECTIONS.SOCIAL_LINKS).updateOne(
      { _id: new ObjectId(_id) },
      { $set: { ...result.data, updatedAt: new Date() } }
    )

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: "Social link not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Social Links PUT Error]", error)
    return NextResponse.json({ error: "Failed to update social link" }, { status: 500 })
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
      return NextResponse.json({ error: "Social link ID is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const deleteResult = await db
      .collection(COLLECTIONS.SOCIAL_LINKS)
      .deleteOne({ _id: new ObjectId(id) })

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ error: "Social link not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Social Links DELETE Error]", error)
    return NextResponse.json({ error: "Failed to delete social link" }, { status: 500 })
  }
}
