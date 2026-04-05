import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getSession } from "@/lib/auth"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
import { socialLinkSchema } from "@/lib/validations"
import type { SocialLink } from "@/lib/types"

export async function GET() {
  try {
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
