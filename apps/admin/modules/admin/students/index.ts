// Page exports
export { ListPage } from "./pages/list/page";
export { NewPage } from "./pages/new/page";
export { EditPage } from "./pages/edit/page";
export { ViewPage } from "./pages/view/page";

// Config and API exports
export { STUDENT_MODULE_CONFIG } from "./module.config";
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
} from "./module.config";

// Form exports
export { StudentsForm, STUDENT_FORM_STEPS } from "./form/StudentsForm";
export { studentFormConfig } from "./form/form.config";

// Component exports
export { SelectWithCreate } from "./components/SelectWithCreate";
export { LockedStudentBanner } from "./components/LockedStudentBanner";

// Modal exports
export { BatchModal } from "./modals/BatchModal";
export { SignatureModal } from "./modals/SignatureModal";
export { ExperienceModal } from "./modals/ExperienceModal";
export { GradingModal } from "./modals/GradingModal";
export { FamilyMemberModal } from "./modals/FamilyMemberModal";
export { EducationModal } from "./modals/EducationModal";
export { MarkingModal } from "./modals/MarkingModal";
