import { NextRequest, NextResponse } from "next/server";
import { getDatabase, COLLECTIONS } from "@/lib/mongodb";
import { contactMessageSchema } from "@/lib/validations";
import { sendContactNotifications } from "@/lib/notifications";
import type { ContactMessage } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = contactMessageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 },
      );
    }

    const db = await getDatabase();

    const newMessage: Omit<ContactMessage, "_id"> = {
      ...result.data,
      read: false,
      createdAt: new Date(),
    };

    await db.collection(COLLECTIONS.CONTACTS).insertOne(newMessage);

    // Send notifications (non-blocking)
    sendContactNotifications({
      name: result.data.name,
      email: result.data.email,
      subject: result.data.subject,
      message: result.data.message,
    }).catch((error) => {
      console.error("[Contact Notifications Error]", error);
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("[Contact POST Error]", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
