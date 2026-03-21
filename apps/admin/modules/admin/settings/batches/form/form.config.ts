import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";

export const batchesFormSchema = z.object({
  name: z.string().min(1, "Batch name is required"),
  shift: z.enum(["morning", "day", "evening"], { message: "Please select a shift" }),
  course: z.string().min(1, "Course is required"),
  books: z.string().optional().default(""),
  instructor: z.string().min(1, "Instructor name is required"),
  total_days: z.number().min(1, "Total days must be at least 1"),
  per_class_hours: z.number().min(0.5, "Class hours per session must be at least 0.5").max(99.99, "Class hours per session must not exceed 99.99"),
});

export const batchesFormConfig = {
  initial: {
    name: "",
    shift: "morning" as const,
    course: "",
    books: "",
    instructor: "",
    total_days: 0,
    per_class_hours: 1.5,
  },
  steps: 1,
  validation: [zodResolver(batchesFormSchema)],
  submitFormat: "json" as const,
};

export const SHIFT_OPTIONS = [
  { label: "Morning", value: "morning" },
  { label: "Day", value: "day" },
  { label: "Evening", value: "evening" },
];
