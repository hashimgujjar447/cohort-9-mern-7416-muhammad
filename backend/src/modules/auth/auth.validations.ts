import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(50, "First name cannot exceed 50 characters."),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(50, "Last name cannot exceed 50 characters."),

  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(30, "Username cannot exceed 30 characters."),

  email: z
    .email("Invalid email address.")
    .max(254, "Email cannot exceed 254 characters."),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password cannot exceed 72 characters."),
});
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Invalid email address.")),
  password: z.string().min(1, "Password is required"),
});

export const verifyEmailSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Invalid email address.")),
  otpCode: z.string().min(1, "OTP is required"),
});

export const resetPasswordRequestSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Invalid email address.")),
});

export const changePasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
