import nodemailer from "nodemailer"
import twilio from "twilio"

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

// Twilio configuration
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null

interface ContactNotification {
  name: string
  email: string
  subject?: string
  message: string
}

export async function sendEmailNotification(contact: ContactNotification): Promise<boolean> {
  if (!process.env.SMTP_USER || !process.env.NOTIFICATION_EMAIL) {
    console.log("[Notifications] Email not configured, skipping email notification")
    return false
  }

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFICATION_EMAIL,
      subject: `New Contact: ${contact.subject || "No Subject"}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0a192f;">New Contact Form Submission</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${contact.name}</p>
            <p><strong>Email:</strong> ${contact.email}</p>
            <p><strong>Subject:</strong> ${contact.subject || "No Subject"}</p>
            <hr style="border: 1px solid #ddd; margin: 15px 0;" />
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${contact.message}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This message was sent from your portfolio contact form.
          </p>
        </div>
      `,
    })
    console.log("[Notifications] Email sent successfully")
    return true
  } catch (error) {
    console.error("[Notifications] Failed to send email:", error)
    return false
  }
}

export async function sendSMSNotification(contact: ContactNotification): Promise<boolean> {
  if (!twilioClient || !process.env.TWILIO_PHONE_NUMBER || !process.env.NOTIFICATION_PHONE) {
    console.log("[Notifications] Twilio not configured, skipping SMS notification")
    return false
  }

  try {
    await twilioClient.messages.create({
      body: `New contact from ${contact.name}: ${contact.subject || "No Subject"} - ${contact.message.substring(0, 100)}${contact.message.length > 100 ? "..." : ""}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.NOTIFICATION_PHONE,
    })
    console.log("[Notifications] SMS sent successfully")
    return true
  } catch (error) {
    console.error("[Notifications] Failed to send SMS:", error)
    return false
  }
}

export async function sendContactNotifications(contact: ContactNotification): Promise<{
  email: boolean
  sms: boolean
}> {
  const [emailResult, smsResult] = await Promise.all([
    sendEmailNotification(contact),
    sendSMSNotification(contact),
  ])

  return {
    email: emailResult,
    sms: smsResult,
  }
}
