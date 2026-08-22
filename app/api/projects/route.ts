import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSession } from "@/lib/auth";
import { getDatabase, COLLECTIONS } from "@/lib/mongodb";
import { projectSchema } from "@/lib/validations";
import type { Project } from "@/lib/types";

export async function GET() {
  try {
    const db = await getDatabase();
    
    const projects = await db
      .collection<Project>(COLLECTIONS.PROJECTS)
      .find()
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    // ✅ FIX: Map MongoDB _id to both _id and id fields for frontend compatibility
    // Frontend expects 'id' field, but MongoDB uses '_id'
    return NextResponse.json(
      projects.map((p) => ({
        ...p,
        _id: p._id?.toString(),
        // Ensure 'id' field exists - use existing 'id' or fallback to '_id'
        id: p.id || p._id?.toString(),
        // Existing portfolio records predate project statuses; treat them as completed
        // until they are updated from the dashboard.
        status: p.status || "completed",
      })),
    );
  } catch (error) {
    console.error("[Projects GET Error]", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}
