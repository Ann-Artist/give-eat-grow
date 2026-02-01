import { z } from "zod";

// Sanitize text input by removing potentially dangerous characters
const sanitizeText = (text: string): string => {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, '') // Remove remaining angle brackets
    .trim();
};

export const donationSchema = z.object({
  foodType: z
    .string()
    .min(1, "Food type is required")
    .max(100, "Food type must be less than 100 characters")
    .transform(sanitizeText),
  quantity: z
    .string()
    .min(1, "Quantity is required")
    .max(50, "Quantity must be less than 50 characters")
    .transform(sanitizeText),
  servings: z
    .string()
    .optional()
    .transform((val) => val ? val.trim() : "")
    .refine((val) => val === "" || (!isNaN(parseInt(val)) && parseInt(val) >= 1 && parseInt(val) <= 1000), {
      message: "Servings must be between 1 and 1000",
    }),
  location: z
    .string()
    .min(1, "Location is required")
    .max(200, "Location must be less than 200 characters")
    .transform(sanitizeText),
  expiryHours: z
    .string()
    .min(1, "Expiry time is required")
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 1 && parseInt(val) <= 48, {
      message: "Expiry hours must be between 1 and 48",
    }),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional()
    .transform((val) => val ? sanitizeText(val) : ""),
});

export type DonationFormData = z.infer<typeof donationSchema>;

// Validate image file
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: "Only JPEG, PNG, GIF, and WebP images are allowed" };
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "Image must be less than 5MB" };
  }
  
  return { valid: true };
};
