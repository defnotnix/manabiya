import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";

// ─────────────────────────────────────────────
// User Type Enum
// ─────────────────────────────────────────────

export const USER_TYPES = {
  STAFF: "staff",
  SUPERUSER: "superuser",
  DATA_ENTRY: "data_entry",
} as const;

export type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];

// ─────────────────────────────────────────────
// Form Schemas (One per step)
// ─────────────────────────────────────────────

export const UsersFormSchema = {
  // Step 0: User Type Selection
  userType: z.object({
    userType: z.enum(["staff", "superuser", "data_entry"], {
      required_error: "Please select a user type",
    }),
  }),

  // Step 1: Identity & Account (for Staff/Superuser)
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
    birthDate: z.string().optional(),
    role: z.string().optional(),
    is_active: z.boolean().optional(),
    is_disabled: z.boolean().optional(),
  }),

  // Data Entry Account Schema
  dataEntry: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    polling_stations: z
      .array(z.string())
      .min(1, "At least one Polling Station is required"),
    is_active: z.boolean().optional(),
    is_disabled: z.boolean().optional(),
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
// Dynamic Validation Helper
// ─────────────────────────────────────────────

// Create a dynamic resolver that checks user type and applies appropriate validation
const createDynamicStepValidator = (
  staffSuperuserSchema: z.ZodObject<any>,
  dataEntrySchema: z.ZodObject<any> | null = null
) => {
  return (values: any) => {
    const userType = values.userType;

    // For data entry users, use data entry schema or skip validation
    if (userType === USER_TYPES.DATA_ENTRY) {
      if (dataEntrySchema) {
        return zodResolver(dataEntrySchema)(values);
      }
      // Return empty errors (skip validation for this step)
      return {};
    }

    // For staff/superuser, use the regular schema
    return zodResolver(staffSuperuserSchema)(values);
  };
};

// ─────────────────────────────────────────────
// Form Configuration
// ─────────────────────────────────────────────

export const UsersFormConfig = {
  steps: 5, // 1 user type + 3 input steps + 1 review
  stepLabels: [
    "User Type",
    "Identity & Account",
    "Physical & Address",
    "Employment & Bank",
    "Review",
  ],
  initial: {
    userType: "" as UserType | "",
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
    is_active: true,
    is_disabled: false,

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

    // Data entry specific fields
    name: "",
    polling_stations: [] as string[],
  },
  validation: [
    zodResolver(UsersFormSchema.userType), // Step 0: User type selection
    createDynamicStepValidator(UsersFormSchema.step1, UsersFormSchema.dataEntry), // Step 1: Identity or Data Entry
    createDynamicStepValidator(UsersFormSchema.step2, null), // Step 2: Physical (skip for data entry)
    createDynamicStepValidator(UsersFormSchema.step3, null), // Step 3: Employment (skip for data entry)
    zodResolver(UsersFormSchema.review), // Step 4: Review
  ],
  stepValidationFn: async () => null,
};
