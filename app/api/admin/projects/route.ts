import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getSession } from "@/lib/auth"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
import { projectSchema } from "@/lib/validations"
import type { Project } from "@/lib/types"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const projects = await db
      .collection<Project>(COLLECTIONS.PROJECTS)
      .find()
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(
      projects.map((p) => ({ ...p, _id: p._id?.toString() }))
    )
  } catch (error) {
    console.error("[Projects GET Error]", error)
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const result = projectSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    // Check if project ID already exists
    const existingProject = await db
      .collection(COLLECTIONS.PROJECTS)
      .findOne({ id: result.data.id })

    if (existingProject) {
      return NextResponse.json(
        { error: "Project with this ID already exists" },
        { status: 400 }
      )
    }

    const newProject: Omit<Project, "_id"> = {
      ...result.data,
      liveUrl: result.data.liveUrl || undefined,
      githubUrl: result.data.githubUrl || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const insertResult = await db.collection(COLLECTIONS.PROJECTS).insertOne(newProject)

    return NextResponse.json({
      ...newProject,
      _id: insertResult.insertedId.toString(),
    })
  } catch (error) {
    console.error("[Projects POST Error]", error)
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { _id, ...projectData } = body

    if (!_id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    const result = projectSchema.safeParse(projectData)
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    const updateResult = await db.collection(COLLECTIONS.PROJECTS).updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          ...result.data,
          liveUrl: result.data.liveUrl || undefined,
          githubUrl: result.data.githubUrl || undefined,
          updatedAt: new Date(),
        },
      }
    )

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Projects PUT Error]", error)
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    )
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
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const deleteResult = await db
      .collection(COLLECTIONS.PROJECTS)
      .deleteOne({ _id: new ObjectId(id) })

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Projects DELETE Error]", error)
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    )
  }
}
