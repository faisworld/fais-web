"use server"

import { sendContactFormNotification } from "@/utils/email"
import { z } from "zod"

// Define a schema for form validation
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
})

export async function submitContactForm(formData: FormData) {
  // Extract form data
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const message = formData.get("message") as string

  // Validate form data
  const result = contactFormSchema.safeParse({ name, email, message })

  if (!result.success) {
    // Return validation errors
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    }
  }

  try {
    // Send email notification
    const emailResult = await sendContactFormNotification({ name, email, message })

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send your message. Please try again later.",
      }
    }

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    }
  } catch (error) {
    console.error("Error in contact form submission:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    }
  }
}
