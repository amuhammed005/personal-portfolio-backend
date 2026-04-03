import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()

    // Get counts
    const [
      projectsCount,
      skillsCount,
      experienceCount,
      messagesCount,
      unreadMessagesCount,
    ] = await Promise.all([
      db.collection(COLLECTIONS.PROJECTS).countDocuments(),
      db.collection(COLLECTIONS.SKILLS).countDocuments(),
      db.collection(COLLECTIONS.EXPERIENCE).countDocuments(),
      db.collection(COLLECTIONS.CONTACTS).countDocuments(),
      db.collection(COLLECTIONS.CONTACTS).countDocuments({ read: false }),
    ])

    // Get recent messages
    const recentMessages = await db
      .collection(COLLECTIONS.CONTACTS)
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray()

    // Get recent projects
    const recentProjects = await db
      .collection(COLLECTIONS.PROJECTS)
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray()

    return NextResponse.json({
      stats: {
        projects: projectsCount,
        skills: skillsCount,
        experience: experienceCount,
        messages: messagesCount,
        unreadMessages: unreadMessagesCount,
      },
      recentMessages: recentMessages.map((msg) => ({
        ...msg,
        _id: msg._id.toString(),
      })),
      recentProjects: recentProjects.map((proj) => ({
        ...proj,
        _id: proj._id.toString(),
      })),
    })
  } catch (error) {
    console.error("[Dashboard Stats Error]", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    )
  }
}
