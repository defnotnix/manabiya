import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";

// ─────────────────────────────────────────────
// Agenda Form Schemas
// ─────────────────────────────────────────────

export const agendaFormSchema = {
  // Step 1: Basic Information
  basicInfo: z.object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title must be less than 100 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    status: z.string().min(1, "Status is required"),
  }),

  // Step 2: Details & Schedule
  details: z
    .object({
      priority: z.string().min(1, "Priority is required"),
      category: z.string().min(1, "Category is required"),
      budget: z
        .number()
        .min(0, "Budget cannot be negative")
        .optional()
        .nullable(),
      duration: z
        .number()
        .min(1, "Duration must be at least 1 day")
        .max(365, "Duration cannot exceed 365 days")
        .optional()
        .nullable(),
      startDate: z.date().optional().nullable(),
      endDate: z.date().optional().nullable(),
    })
    .refine(
      (data) => {
        if (data.startDate && data.endDate) {
          return data.endDate >= data.startDate;
        }
        return true;
      },
      {
        message: "End date must be after start date",
        path: ["endDate"],
      },
    ),

  // Step 3: Settings & Notifications
  settings: z
    .object({
      progress: z
        .number()
        .min(0, "Progress must be between 0 and 100")
        .max(100, "Progress must be between 0 and 100")
        .optional()
        .nullable(),
      isPublic: z.boolean().optional(),
      emailNotifications: z.boolean().optional(),
      smsNotifications: z.boolean().optional(),
    })
    .refine(
      (data) => {
        if (
          data.isPublic &&
          !data.emailNotifications &&
          !data.smsNotifications
        ) {
          return false;
        }
        return true;
      },
      {
        message:
          "Public agendas require at least one notification method enabled",
        path: ["emailNotifications"],
      },
    ),

  // Step 4: Review (No validation required)
  review: z.object({}),
};

// ─────────────────────────────────────────────
// Form Configuration
// ─────────────────────────────────────────────

export const agendaFormConfig = {
  steps: 4,
  stepLabels: [
    "Basic Info",
    { label: "Details", description: "Priority, budget & dates" },
    { label: "Settings", description: "Notifications & visibility" },
    "Review",
  ],
  initial: {
    status: "pending",
    priority: "medium",
    progress: 0,
    emailNotifications: true,
    smsNotifications: false,
    isPublic: false,
  },
  // Step validation function not needed when using Zod resolvers per step
  stepValidationFn: async () => null,
  validation: [
    zodResolver(agendaFormSchema.basicInfo),
    zodResolver(agendaFormSchema.details),
    zodResolver(agendaFormSchema.settings),
    zodResolver(agendaFormSchema.review),
  ],
};
