import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";

// ─────────────────────────────────────────────
// Form Schemas (One per step)
// ─────────────────────────────────────────────

export const UsersFormSchema = {
  // Step 1: Identity & Account
  step1: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    maidenName: z.string().optional(),
    age: z.number().min(0, "Age must be positive").max(120, "Invalid age"),
    gender: z.enum(["male", "female", "other"]),
    email: z.string().email("Invalid email"),
    phone: z.string().min(1, "Phone is required"),
    username: z.string().min(3, "Username must be at least 3 chars"),
    password: z.string().min(6, "Password must be at least 6 chars"),
    birthDate: z.string().optional(), // Using string for date input simplicity or Date objects
    role: z.string().optional(),
  }),

  // Step 2: Physical & Address
  step2: z.object({
    height: z.number().positive("Height must be positive").optional(),
    weight: z.number().positive("Weight must be positive").optional(),
    bloodGroup: z.string().optional(),
    eyeColor: z.string().optional(),
    hair: z
      .object({
        color: z.string().optional(),
        type: z.string().optional(),
      })
      .optional(),
    address: z.object({
      address: z.string().min(1, "Address is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().default("United States"),
    }),
  }),

  // Step 3: Employment & Bank
  step3: z.object({
    university: z.string().optional(),
    company: z.object({
      name: z.string().min(1, "Company name is required"),
      title: z.string().min(1, "Job title is required"),
      department: z.string().optional(),
    }),
    bank: z.object({
      cardExpire: z.string().optional(),
      cardNumber: z.string().optional(),
      cardType: z.string().optional(),
      currency: z.string().optional(),
      iban: z.string().optional(),
    }),
  }),

  // Final Step: Review (no validation)
  review: z.object({}),
};

// ─────────────────────────────────────────────
// Form Configuration
// ─────────────────────────────────────────────

export const UsersFormConfig = {
  steps: 4, // 3 input steps + 1 review
  stepLabels: [
    "Identity & Account",
    "Physical & Address",
    "Employment & Bank",
    "Review",
  ],
  initial: {
    firstName: "",
    lastName: "",
    maidenName: "",
    age: 18,
    gender: "male",
    email: "",
    phone: "",
    username: "",
    password: "",
    birthDate: "",
    role: "user",

    height: 0,
    weight: 0,
    bloodGroup: "",
    eyeColor: "",
    hair: { color: "", type: "" },
    address: {
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "United States",
    },

    university: "",
    company: { name: "", title: "", department: "" },
    bank: {
      cardExpire: "",
      cardNumber: "",
      cardType: "",
      currency: "USD",
      iban: "",
    },
  },
  validation: [
    zodResolver(UsersFormSchema.step1),
    zodResolver(UsersFormSchema.step2),
    zodResolver(UsersFormSchema.step3),
    zodResolver(UsersFormSchema.review),
  ],
  stepValidationFn: async () => null,
};
