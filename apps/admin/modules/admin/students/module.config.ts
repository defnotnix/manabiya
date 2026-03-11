"use client";

import { UsersIcon } from "@phosphor-icons/react";
import {
  STUDENT_API,
  SIGNATURE_API,
  BATCH_API,
  CONTACT_API,
  EXPERIENCE_API,
  GRADING_API,
  FAMILY_MEMBER_API,
  EDUCATION_API,
  MARKING_API,
  AUDIT_LOG_API,
} from "./module.api";

export const STUDENT_MODULE_CONFIG = {
  name: "Student",
  term: "Student",
  label: "Students",
  description: "Manage student information, enrollments, and records",
  pluralName: "students",
  singularName: "student",
  icon: UsersIcon,
  basePath: "/admin/students",
};

// Re-export all APIs
export {
  STUDENT_API,
  SIGNATURE_API,
  BATCH_API,
  CONTACT_API,
  EXPERIENCE_API,
  GRADING_API,
  FAMILY_MEMBER_API,
  EDUCATION_API,
  MARKING_API,
  AUDIT_LOG_API,
};

// Gender options
export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

// Shift options for batches
export const SHIFT_OPTIONS = [
  { value: "morning", label: "Morning" },
  { value: "day", label: "Day" },
  { value: "evening", label: "Evening" },
];

// Grade options for grading
export const GRADE_OPTIONS = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
  { value: "D", label: "D" },
];

// Relationship options for family members
export const RELATIONSHIP_OPTIONS = [
  { value: "Father", label: "Father" },
  { value: "Mother", label: "Mother" },
  { value: "Guardian", label: "Guardian" },
  { value: "Sibling", label: "Sibling" },
  { value: "Spouse", label: "Spouse" },
  { value: "Other", label: "Other" },
];

// Education degree options
export const DEGREE_OPTIONS = [
  { value: "Primary", label: "Primary" },
  { value: "Secondary", label: "Secondary" },
  { value: "Higher Secondary", label: "Higher Secondary" },
  { value: "Bachelor", label: "Bachelor" },
  { value: "Master", label: "Master" },
  { value: "Doctorate", label: "Doctorate" },
  { value: "Other", label: "Other" },
];

// Month options for markings
export const MONTH_OPTIONS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];
