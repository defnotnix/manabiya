// ─── Woda Template Exports ────────────────────────────────────────────────────
// Individual named exports
export { TemplatePermanentAddress } from "../../oldtemplates/woda/address";
export { TemplateDOBVerification } from "../../oldtemplates/woda/dob";
export { TemplateFiscalYear } from "../../oldtemplates/woda/fiscal";
export { TemplateIncomeVerification } from "../../oldtemplates/woda/income";
export { TemplateMigration } from "../../oldtemplates/woda/migration";
export { TemplateOccupationVerification } from "../../oldtemplates/woda/occupation";
export { TemplateRelationshipVerification } from "../../oldtemplates/woda/relationship";
export { TemplateSurname } from "../../oldtemplates/woda/surname";
export { TemplateTaxClearance } from "../../oldtemplates/woda/taxClearance";

// ─── Woda Templates Namespace ─────────────────────────────────────────────────
import { TemplatePermanentAddress } from "../../oldtemplates/woda/address";
import { TemplateDOBVerification } from "../../oldtemplates/woda/dob";
import { TemplateFiscalYear } from "../../oldtemplates/woda/fiscal";
import { TemplateIncomeVerification } from "../../oldtemplates/woda/income";
import { TemplateMigration } from "../../oldtemplates/woda/migration";
import { TemplateOccupationVerification } from "../../oldtemplates/woda/occupation";
import { TemplateRelationshipVerification } from "../../oldtemplates/woda/relationship";
import { TemplateSurname } from "../../oldtemplates/woda/surname";
import { TemplateTaxClearance } from "../../oldtemplates/woda/taxClearance";

export const WodaTemplates = {
  relationship_verification: TemplateRelationshipVerification,
  occupation_verification:   TemplateOccupationVerification,
  dob_verification:          TemplateDOBVerification,
  annual_income_verification: TemplateIncomeVerification,
  tax_clearance:             TemplateTaxClearance,
  fiscal_year_details:       TemplateFiscalYear,
  migration:                 TemplateMigration,
  surname:                   TemplateSurname,
  address:                   TemplatePermanentAddress,
} as const;

export type WodaTemplateKey = keyof typeof WodaTemplates;
