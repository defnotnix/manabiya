"use client";

// Import step components
import { StepWelcome } from "./steps/s0_welcome";
import { StepIdentityContact } from "./steps/s1_identity_contact";
import { StepBackgroundLegal } from "./steps/s2_background_legal";
import { StepPhysicalEmergency } from "./steps/s3_physical_emergency";
import { StepPersonalStory } from "./steps/s4_personal_story";
import { StepAcademics } from "./steps/s5_academics";
import { StepWorkHistory } from "./steps/s6_work_history";
import { StepCertifications } from "./steps/s7_certifications";
import { StepIdentifications } from "./steps/s8_identifications";
import { StepJapanVisit } from "./steps/s9_japan_visit";
import { StepCompleted } from "./steps/s10_completed";

// Step mapping - FormWrapper will handle which step to display
export const STEPS = [
  "Welcome",
  "Identity & Contact",
  "Background & Legal Status",
  "Physical & Emergency Contact",
  "Personal Story",
  "Academics",
  "Work History",
  "Certifications",
  "Identifications",
  "Japan Visit History",
  "Completed",
];

export const STEP_COMPONENTS = [
  StepWelcome,
  StepIdentityContact,
  StepBackgroundLegal,
  StepPhysicalEmergency,
  StepPersonalStory,
  StepAcademics,
  StepWorkHistory,
  StepCertifications,
  StepIdentifications,
  StepJapanVisit,
  StepCompleted,
];

/**
 * ApplicantForm - Multi-step form component
 *
 * This component works with FormWrapper which handles:
 * - Step management
 * - Form submission
 * - Validation
 * - State management
 *
 * The component receives the current step index from FormWrapper
 * and renders the appropriate step component.
 */
export function ApplicantForm() {
  // Simply render the first step for now
  // FormWrapper will control which step is displayed via conditional rendering
  // or by passing the step index as a prop

  const CurrentStep = STEP_COMPONENTS[0];

  return <CurrentStep />;
}
