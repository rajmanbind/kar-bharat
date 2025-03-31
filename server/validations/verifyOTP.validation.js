import z from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const verifyOTPSchema = z.object({
    email: z
        .string({
          required_error: "Email is required",
        })
        .email("Please include a valid email")
        .max(100, "Email must not exceed 100 characters")
        .regex(emailRegex, "Invalid email format"),
      otp: z
        .string({
          required_error: "OTP is required",
        })
        .length(4, "OTP must be exactly 4 digits")
        .regex(/^\d{4}$/, "OTP must only contain numeric digits"),
    });
    
export default verifyOTPSchema;
