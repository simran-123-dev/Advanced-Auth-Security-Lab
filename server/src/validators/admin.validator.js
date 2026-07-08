// server/src/validators/admin.validator.js

import { z } from "zod";

/**
 * Ban user validation schema
 */
const banUserSchema = z.object({
  reason: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        return val.length <= 500;
      },
      { message: "Reason cannot exceed 500 characters" }
    ),
});

/**
 * Change user role validation schema
 */
const changeRoleSchema = z.object({
  role: z.enum(["user", "admin"], {
    errorMap: () => ({ message: "Role must be either 'user' or 'admin'" }),
  }),
});

export {
  banUserSchema,
  changeRoleSchema,
};