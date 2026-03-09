// ─── Template Barrel ──────────────────────────────────────────────────────────
// Central export for all document templates.
//
// Usage:
//   import { Templates }           from "@/modules/admin/docs/templates";
//   import { WodaTemplates }        from "@/modules/admin/docs/templates";
//   import { BankTemplates }        from "@/modules/admin/docs/templates";
//   import { TemplateStudentCertificate } from "@/modules/admin/docs/templates";
//
// Nested access:
//   Templates.student.certificate
//   Templates.woda.dob_verification
//   Templates.bank.bigyalaxmi.certificate
//   Templates.bank.bigyalaxmi.statement

// ─── Re-exports ───────────────────────────────────────────────────────────────

// Student templates
export { TemplateStudentCertificate } from "./student-certificate";

// Woda templates (individual + namespace)
export * from "./woda";

// Bank templates (individual + namespace)
export * from "./bank";

// ─── Imports for unified namespace ───────────────────────────────────────────
import { TemplateStudentCertificate } from "./student-certificate";
import { WodaTemplates }              from "./woda";
import { BankTemplates }              from "./bank";

// ─── Unified Templates Namespace ─────────────────────────────────────────────
export const Templates = {
  // ── Student ──────────────────────────────────────────────────────────────
  student: {
    certificate: TemplateStudentCertificate,
  },

  // ── Woda (Ward-level documents) ──────────────────────────────────────────
  woda: WodaTemplates,

  // ── Bank (cooperative / savings institutions) ────────────────────────────
  bank: BankTemplates,
} as const;

export type { WodaTemplateKey }             from "./woda";
export type { BankTemplateKey, BankTemplateVariant } from "./bank";
