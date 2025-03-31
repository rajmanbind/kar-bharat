import z from "zod";

// Email validation regex
// const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Zod schema for email validation
const emailSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .min(1, "Email is required")
    .max(100, "Email must not exceed 100 characters")
    .regex(emailRegex, "Invalid email format"),
});

export default emailSchema;
