import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";

// Create schema with password
export const usersCreateFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  is_active: z.boolean().default(true),
});

// Edit schema without password
export const usersEditFormSchema = z.object({
  first_name: z.string().optional().default(""),
  last_name: z.string().optional().default(""),
  email: z.string().email("Invalid email address"),
  is_active: z.boolean().default(true),
});

export const usersCreateFormConfig = {
  initial: {
    username: "",
    email: "",
    password: "",
    is_active: true,
  },
  steps: 1,
  validation: [zodResolver(usersCreateFormSchema)],
  submitFormat: "json" as const,
};

export const usersEditFormConfig = {
  initial: {
    first_name: "",
    last_name: "",
    email: "",
    is_active: true,
  },
  steps: 1,
  validation: [zodResolver(usersEditFormSchema)],
  submitFormat: "json" as const,
};
