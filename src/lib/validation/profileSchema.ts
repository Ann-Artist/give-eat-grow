import { z } from "zod";

// Sanitize text input by removing potentially dangerous characters
const sanitizeText = (text: string): string => {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, '') // Remove remaining angle brackets
    .trim();
};

export const profileSchema = z.object({
  full_name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .transform(sanitizeText)
    .refine((val) => val.length > 0, { message: "Name cannot be empty after sanitization" }),
  phone: z
    .string()
    .max(20, "Phone must be less than 20 characters")
    .optional()
    .transform((val) => val ? sanitizeText(val) : "")
    .refine((val) => val === "" || /^[\d\s\-+()]+$/.test(val), {
      message: "Phone can only contain digits, spaces, and +()-",
    }),
  location: z
    .string()
    .max(200, "Location must be less than 200 characters")
    .optional()
    .transform((val) => val ? sanitizeText(val) : ""),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
