import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";

// Create schema with password and groups
export const usersCreateFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  first_name: z.string().optional().default(""),
  last_name: z.string().optional().default(""),
  password: z.string().min(8, "Password must be at least 8 characters"),
  groups: z.array(z.number()).min(1, "Role is required").max(1, "Only one role is allowed"),
  is_active: z.boolean().default(true),
  is_disabled: z.boolean().default(false),
  disabled_at: z.string().nullable().default(null),
  disabled_reason: z.string().optional().default(""),
});

// Edit schema with all editable fields (password is optional for updates)
export const usersEditFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  first_name: z.string().optional().default(""),
  last_name: z.string().optional().default(""),
  password: z.string().optional().default(""),
  groups: z.array(z.number()).min(1, "Role is required").max(1, "Only one role is allowed"),
  is_active: z.boolean().default(true),
  is_disabled: z.boolean().default(false),
  disabled_at: z.string().nullable().default(null),
  disabled_reason: z.string().optional().default(""),
});

export const usersCreateFormConfig = {
  initial: {
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    groups: [],
    is_active: true,
    is_disabled: false,
    disabled_at: null,
    disabled_reason: "",
  },
  steps: 1,
  validation: [zodResolver(usersCreateFormSchema)],
  submitFormat: "json" as const,
};

export const usersEditFormConfig = {
  initial: {
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    groups: [],
    is_active: true,
    is_disabled: false,
    disabled_at: null,
    disabled_reason: "",
  },
  steps: 1,
  validation: [zodResolver(usersEditFormSchema)],
  submitFormat: "json" as const,
};
