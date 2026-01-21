import { z } from "zod";
import { triggerNotification } from "@settle/admin";
import { APPLICANT_API } from "../../module.api";

/**
 * Step validation schemas
 * Each step has its own validation schema (empty for now)
 */
export const STEP_SCHEMAS = [
  z.object({}), // Step 0: Welcome
  z.object({}), // Step 1: Identity & Contact
  z.object({}), // Step 2: Background & Legal Status
  z.object({}), // Step 3: Physical & Emergency Contact
  z.object({}), // Step 4: Personal Story
  z.object({}), // Step 5: Academics
  z.object({}), // Step 6: Work History
  z.object({}), // Step 7: Certifications
  z.object({}), // Step 8: Identifications
  z.object({}), // Step 9: Japan Visit History
  z.object({}), // Step 10: Completed
];

/**
 * Initial form values
 */
export const INITIAL_VALUES = {
  // Step 1: Identity & Contact
  first_name: "",
  jp_first_name: "",
  middle_name: "",
  jp_middle_name: "",
  last_name: "",
  jp_last_name: "",
  image: null,
  youtube_link: "",
  remark: "",
  jp_remark: "",
  category: "",
  date_of_birth: "",
  gender: "",
  nationality: "",
  jp_nationality: "",
  current_address: "",
  jp_current_address: "",
  contact: "",
  instagram_url: "",
  facebook_url: "",
  linkedin_url: "",

  // Step 2: Background & Legal Status
  martial_status: "",
  religion: "",
  jp_religion: "",
  drinks_alcohol: false,
  smokes: false,
  japanese_level: "",
  code: "",

  // Step 3: Physical & Emergency Contact
  height: "",
  weight: "",
  blood_type: "",
  distinguishing_marks: "",
  jp_distinguishing_marks: "",
  emergency_contact_name: "",
  jp_emergency_contact_name: "",
  emergency_contact_number: "",
  emergency_contact_relationship: "",

  // Step 4: Personal Story
  personal_story: "",
  jp_personal_story: "",
  motivation: "",
  jp_motivation: "",

  // Step 5: Academics
  education: [],

  // Step 6: Work History
  work_experience: [],

  // Step 7: Certifications
  licenses: [],

  // Step 8: Identifications
  passport: null,
  l_cert_image: null,
  ssw_cert_image: null,
  license_number: "",

  // Step 9: Japan Visit History
  visithistory: [],

  // Additional
  enable_translate: false,
};

/**
 * FormWrapper configuration for applicant form
 */
export const APPLICANT_FORM_CONFIG = {
  queryKey: "applicant.new",
  formName: "applicant-form",
  initial: INITIAL_VALUES,
  steps: 11,
  validation: STEP_SCHEMAS,
  disabledSteps: [],
  notifications: triggerNotification.form,
  apiSubmitFn: async (data: any) => {
    return APPLICANT_API.createApplicant(data);
  },
};
