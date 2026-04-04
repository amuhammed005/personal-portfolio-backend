import { NextResponse } from "next/server"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
import type { PersonalInfo } from "@/lib/types"

export async function GET() {
  try {
    const db = await getDatabase()

    const personalInfo = await db
      .collection<PersonalInfo>(COLLECTIONS.PERSONAL_INFO)
      .findOne({})

    console.log("Personal info from DB:", personalInfo) // Log raw data for debugging
    
    if (!personalInfo) {
      return NextResponse.json(null)
    }

    return NextResponse.json({ ...personalInfo, _id: personalInfo._id?.toString() })
  } catch (error) {
    console.error("[Personal Info GET Error]", error)
    return NextResponse.json({ error: "Failed to fetch personal info" }, { status: 500 })
  }
}