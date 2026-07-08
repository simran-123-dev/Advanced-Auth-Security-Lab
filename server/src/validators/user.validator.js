// server/src/validators/user.validator.js

import { z } from "zod";

/**
 * Email validation schema
 */
const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .min(1, "Email is required")
  .max(255, "Email cannot exceed 255 characters")
  .toLowerCase();

/**
 * Name validation schema
 */
const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name cannot exceed 50 characters")
  .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes");

/**
 * Phone validation schema (optional)
 */
const phoneSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val || val === "") return true;
      return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(val);
    },
    { message: "Please enter a valid phone number" }
  );

/**
 * URL validation schema (optional)
 */
const urlSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val || val === "") return true;
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Please enter a valid URL" }
  );

/**
 * Bio validation schema (optional)
 */
const bioSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val || val === "") return true;
      return val.length <= 200;
    },
    { message: "Bio cannot exceed 200 characters" }
  );

/**
 * Location validation schema (optional)
 */
const locationSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val || val === "") return true;
      return val.length <= 100;
    },
    { message: "Location cannot exceed 100 characters" }
  );

/**
 * Update profile validation schema
 */
const updateProfileSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  bio: bioSchema,
  phone: phoneSchema,
  location: locationSchema,
  website: urlSchema,
});

/**
 * Password validation rules
 */
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password cannot exceed 100 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

/**
 * Change password validation schema
 */
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, "Confirm new password is required"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export {
  updateProfileSchema,
  changePasswordSchema,
};