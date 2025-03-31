import { z } from "zod";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const registerSchema = z
  .object({
    name: z
      .string({
        required_error: "Name is required",
      })
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must not exceed 50 characters"),
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
    cnf_password: z.string(),

    userType: z.enum(["customer", "worker", "broker"], {
      required_error: "User type must be customer, worker, or broker",
    }),
    skills: z
      .array(z.string().max(30, "Each skill must not exceed 30 characters"))
      .optional(),
    rating: z
      .number()
      .min(0, "Rating must be at least 0")
      .max(5, "Rating must not exceed 5")
      .default(0),
    ratingCount: z
      .number()
      .min(0, "Rating count must be at least 0")
      .default(0),
    brokerId: z.string().optional(),
  })
  .refine((data) => data.password === data.cnf_password, {
    path: ["cnf_password"],
    message: "Password and Confirm Password must match",
  });

export const registerSchemaTwo = z
  .object({
    phone: z
      .string({ required_error: "Phone is required" })
      .regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
    // address: z
    //   .string({
    //     required_error: "address is required",
    //   })
    //   .min(10, "address must be 10 plus characters")
    //   .max(200, "Phone number must not exceed 15 characters"),
    address: z
      .object({
        street: z
          .string({ required_error: "Street is required" })
          .min(3, "Street must be at least 3 characters")
          .max(100, "Street must not exceed 100 characters")
          ,
        city: z
          .string({ required_error: "City is required" })
          .min(2, "City must be at least 2 characters")
          .max(50, "City must not exceed 50 characters"),
        state: z
          .string({ required_error: "State is required" })
          .min(2, "State must be at least 2 characters")
          .max(50, "State must not exceed 50 characters"),
        zipCode: z
          .string({ required_error: "Pincode is required" })
          .regex(/^\d{5,10}(?:[-\s]\d{4})?$/, "Invalid zip/postal code format"),
        country: z
          .string({ required_error: "Country is required" })
          .min(2, "Country must be at least 2 characters")
          .max(50, "Country must not exceed 50 characters"),
      })
      .required(),
    skills: z
      .array(z.string().max(30, "Each skill must not exceed 30 characters"))
      .optional(),
    rating: z
      .number()
      .min(0, "Rating must be at least 0")
      .max(5, "Rating must not exceed 5")
      .default(0),
    ratingCount: z
      .number()
      .min(0, "Rating count must be at least 0")
      .default(0),
    brokerId: z.string().optional(),
  })

  .refine(
    (data) => {
      // Ensure at least one skill is present if the userType is "worker"
      if (data.userType === "worker") {
        return Array.isArray(data.skills) && data.skills.length > 0;
      }
      return true;
    },
    {
      path: ["skills"],
      message: "At least one skill is required for userType 'worker'",
    }
  );

export const emailSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .min(1, "Email is required")
    .max(100, "Email must not exceed 100 characters")
    .regex(emailRegex, "Invalid email format"),
});

export const verifyOTPSchema = z.object({
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

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Please include a valid email")
    .max(100, "Email must not exceed 100 characters"),
  // .regex(emailRegex, "Invalid email format"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters")
    .max(30, "Password must not exceed 30 characters"),
});
