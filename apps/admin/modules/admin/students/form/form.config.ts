"use client";

import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";

// Step labels for the stepper
export const STUDENT_FORM_STEPS = [
  "Basic Info",
  "Contact Info",
  "Enrollment",
  "Review",
];

// Step 1: Basic Info validation
const step1Schema = z.object({
  first_name: z.string().min(1, "First name is required"),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, "Last name is required"),
  date_of_birth: z.any().optional(),
  gender: z.string().optional(),
  current_address: z.string().optional(),
  permanent_address: z.string().optional(),
});

// Step 2: Contact Info validation
const step2Schema = z.object({
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  contact: z.string().optional(),
  phone_number: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_relation: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
});

// Step 3: Enrollment validation
const step3Schema = z.object({
  batch: z.any().optional(),
  date_of_admission: z.any().optional(),
});

// Step 4: Review (no validation needed)
const step4Schema = z.object({});

export const studentFormConfig = {
  initial: {
    // Basic Info (Step 1)
    student_code: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: null,
    gender: "",
    current_address: "",
    permanent_address: "",

    // Contact Info (Step 2)
    email: "",
    contact: "",
    phone_number: "",
    emergency_contact_name: "",
    emergency_contact_relation: "",
    emergency_contact_phone: "",

    // Enrollment (Step 3)
    batch: null,
    date_of_admission: null,
    date_of_completion: null,
  },
  steps: 4,
  validation: [
    zodResolver(step1Schema),
    zodResolver(step2Schema),
    zodResolver(step3Schema),
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
    per_class_hours: "",
    is_active: true,
  },
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
    remarks: "",
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
