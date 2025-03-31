import z from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Please include a valid email")
    .max(100, "Email must not exceed 100 characters")
    .regex(emailRegex, "Invalid email format"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters")
    .max(30, "Password must not exceed 30 characters"),
});
export default loginSchema;
