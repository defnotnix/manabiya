"use client";

import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";

// Step labels for the stepper
export const STUDENT_FORM_STEPS = [
  "Basic Info",
  "Contact Info",
  "Background Info",
  "Enrollment & Academic",
  "Review",
];

// Step 1: Basic Info validation
const step1Schema = z.object({
  first_name: z.string().min(1, "First name is required"),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, "Last name is required"),
  date_of_birth: z.any().optional(),
  gender: z.string().optional(),
  current_address: z.string().min(1, "Current address is required"),
  permanent_address: z.string().min(1, "Permanent address is required"),
  jp_first_name: z.string().optional(),
  jp_middle_name: z.string().optional(),
  jp_last_name: z.string().optional(),
  jp_date_of_birth: z.any().optional(),
  jp_gender: z.string().optional(),
  jp_current_address: z.string().optional(),
  jp_permanent_address: z.string().optional(),
});

// Step 2: Contact Info validation
const step2Schema = z.object({
  email: z.string().min(1, "Email is required").email("Email must be a valid email format"),
  contact: z.string().min(1, "Contact number is required").regex(/^\+?[0-9]{7,20}$/, "Use phone format with 7-20 digits, optional leading +."),
  emergency_contact_name: z.string().optional(),
  emergency_contact_relation: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
});

// Step 3: Background Info validation (Arrays)
const step3Schema = z.object({
  experiences: z.array(z.any()).optional(),
  educations: z.array(z.any()).optional(),
  family_members: z.array(z.any()).optional(),
});

// Step 4: Enrollment validation (Fields + Arrays)
const step4Schema = z.object({
  batch: z.any().optional(),
  date_of_admission: z.any().optional(),
  date_of_completion: z.any().optional(),
  grading_grammar: z.string().optional(),
  grading_conversation: z.string().optional(),
  grading_composition: z.string().optional(),
  grading_listening: z.string().optional(),
  grading_reading: z.string().optional(),
  marking_start_date: z.any().optional(),
  markings: z.array(z.any()).optional(),
}).refine(
  (data) => {
    if (!data.date_of_admission || !data.date_of_completion) {
      return true;
    }
    return new Date(data.date_of_completion) > new Date(data.date_of_admission);
  },
  {
    message: "Date of completion must be after date of admission",
    path: ["date_of_completion"],
  }
);

// Step 5: Review (no validation needed)
const step5Schema = z.object({});

// Batch validation schema - all fields required
const batchSchema = z.object({
  name: z.string().min(1, "Batch name is required"),
  shift: z.string().min(1, "Shift is required"),
  course: z.string().min(1, "Course is required"),
  books: z.string().min(1, "Books is required"),
  instructor: z.string().min(1, "Instructor is required"),
  total_days: z.coerce.number().min(1, "Total days must be at least 1"),
  per_class_hours: z.coerce.number().min(0.5, "Class hours per session must be at least 0.5").max(99.99, "Class hours per session must not exceed 99.99"),
});

export const studentFormConfig = {
  initial: {
    // Basic Info (Step 1)
    image: null,
    student_code: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: null,
    gender: "",
    current_address: "",
    permanent_address: "",
    jp_first_name: "",
    jp_middle_name: "",
    jp_last_name: "",
    jp_date_of_birth: null,
    jp_gender: "",
    jp_current_address: "",
    jp_permanent_address: "",

    // Contact Info (Step 2)
    email: "",
    contact: "",
    emergency_contact_name: "",
    emergency_contact_relation: "",
    emergency_contact_phone: "",

    // Background Info (Step 3)
    experiences: [],
    educations: [],
    family_members: [],

    // Enrollment (Step 4)
    batch: null,
    default_class_hours: null,
    date_of_admission: null,
    date_of_completion: null,
    grading_grammar: "",
    grading_conversation: "",
    grading_composition: "",
    grading_listening: "",
    grading_reading: "",
    marking_start_date: null,
    markings: [],
  },
  steps: 5,
  validation: [
    zodResolver(step1Schema),
    zodResolver(step2Schema),
    zodResolver(step3Schema),
    zodResolver(step4Schema),
    {}, // No validation for review step
  ],
  disabledSteps: [],
  stepLabels: STUDENT_FORM_STEPS,
};

// Batch form configuration
export const batchFormConfig = {
  initial: {
    name: "",
    shift: "",
    course: "",
    books: "",
    instructor: "",
    total_days: null,
    per_class_hours: 1.5,
  },
  validation: zodResolver(batchSchema),
};

// Signature form configuration
export const signatureFormConfig = {
  initial: {
    name: "",
    signature_image: null,
    is_active: true,
  },
};

// Experience form configuration
export const experienceFormConfig = {
  initial: {
    company: "",
    role: "",
    start_period: "",
    end_period: "",
    notes: "",
  },
};

// Grading form configuration
export const gradingFormConfig = {
  initial: {
    grammar: "",
    conversation: "",
    composition: "",
    listening: "",
    reading: "",
  },
};

// Family member form configuration
export const familyMemberFormConfig = {
  initial: {
    name: "",
    relationship: "",
    age: null,
    occupation: "",
    contact: "",
  },
};

// Education form configuration
export const educationFormConfig = {
  initial: {
    institution: "",
    degree: "",
    field_of_study: "",
    start_period: "",
    end_period: "",
  },
};

// Marking form configuration
export const markingFormConfig = {
  initial: {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    total_days: null,
    class_hours: "",
    present: null,
    absent: null,
    attendance_percent: "",
  },
};
