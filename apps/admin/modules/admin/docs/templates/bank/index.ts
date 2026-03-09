// ─── Imports ──────────────────────────────────────────────────────────────────
import { TemplateBigyalaxmiCertificate }    from "../../oldtemplates/statement/bigyalaxmi/certificate";
import { TemplateBigyalaxmiStatement }      from "../../oldtemplates/statement/bigyalaxmi/statement";
import { TemplateBirendranagarCertificate } from "../../oldtemplates/statement/birendranagar/certificate";
import { TemplateBirendranagarStatement }   from "../../oldtemplates/statement/birendranagar/statement";
import { TemplateHimchuliCertificate }      from "../../oldtemplates/statement/himchuli/certificate";
import { TemplateHimchuliStatement }        from "../../oldtemplates/statement/himchuli/statement";
import { TemplateJanautthanCertificate }    from "../../oldtemplates/statement/janautthan/certificate";
import { TemplateJanautthanStatement }      from "../../oldtemplates/statement/janautthan/statement";
import { TemplateKarnaliCertificate }       from "../../oldtemplates/statement/karnali/certificate";
import { TemplateKarnaliStatement }         from "../../oldtemplates/statement/karnali/statement";
import { TemplateMataBageshworiCertificate } from "../../oldtemplates/statement/mataBageshwori/certificate";
import { TemplateMataBageshworiStatement }  from "../../oldtemplates/statement/mataBageshwori/statement";
import { TemplateNarayanCertificate }       from "../../oldtemplates/statement/narayan/certificate";
import { TemplateNarayanStatement }         from "../../oldtemplates/statement/narayan/statement";
import { TemplateShahabhagiCertificate }    from "../../oldtemplates/statement/shahabhagi/certificate";
import { TemplateShahabhagiStatement }      from "../../oldtemplates/statement/shahabhagi/statement";
import { TemplateSumnimaCertificate }       from "../../oldtemplates/statement/sumnima/certificate";
import { TemplateSumnimaStatement }         from "../../oldtemplates/statement/sumnima/statement";
import { TemplateTribeniCertificate }       from "../../oldtemplates/statement/tribeni/certificate";
import { TemplateTribeniStatement }         from "../../oldtemplates/statement/tribeni/statement";
// Note: source file exports "TemplateVyasertificate" (typo) — corrected name used below
import { TemplateVyasertificate as TemplateVyasCertificate } from "../../oldtemplates/statement/vyas/certificate";
import { TemplateVyasStatement }            from "../../oldtemplates/statement/vyas/statement";

// ─── Named Exports ────────────────────────────────────────────────────────────
// Bigyalaxmi Saving & Credit Co-Operative Ltd.
export { TemplateBigyalaxmiCertificate, TemplateBigyalaxmiStatement };
// Birendranagar Saving & Credit Co-Operative Ltd.
export { TemplateBirendranagarCertificate, TemplateBirendranagarStatement };
// Himchuli Saving & Co-Operative Ltd.
export { TemplateHimchuliCertificate, TemplateHimchuliStatement };
// Janautthan Multipurpose Co-Operative Society Ltd.
export { TemplateJanautthanCertificate, TemplateJanautthanStatement };
// Karnali Agriculture Multipurpose Co-Operative Ltd.
export { TemplateKarnaliCertificate, TemplateKarnaliStatement };
// Mata Bageshwori Saving & Credit Co-operative Ltd.
export { TemplateMataBageshworiCertificate, TemplateMataBageshworiStatement };
// Narayan Multipurpose Co-Operative Ltd.
export { TemplateNarayanCertificate, TemplateNarayanStatement };
// Shahabhagi Saving & Credit Co-Operative Ltd.
export { TemplateShahabhagiCertificate, TemplateShahabhagiStatement };
// Sumnima Saving & Credit Coop. Ltd.
export { TemplateSumnimaCertificate, TemplateSumnimaStatement };
// Shree Tribeni Saving & Credit Co-Operative Ltd.
export { TemplateTribeniCertificate, TemplateTribeniStatement };
// Vyas Saving & Credit Co-Operative Ltd.
export { TemplateVyasCertificate, TemplateVyasStatement };

// ─── Bank Templates Namespace (nested per institution) ────────────────────────
export const BankTemplates = {
  bigyalaxmi: {
    certificate: TemplateBigyalaxmiCertificate,
    statement:   TemplateBigyalaxmiStatement,
  },
  birendranagar: {
    certificate: TemplateBirendranagarCertificate,
    statement:   TemplateBirendranagarStatement,
  },
  himchuli: {
    certificate: TemplateHimchuliCertificate,
    statement:   TemplateHimchuliStatement,
  },
  janautthan: {
    certificate: TemplateJanautthanCertificate,
    statement:   TemplateJanautthanStatement,
  },
  karnali: {
    certificate: TemplateKarnaliCertificate,
    statement:   TemplateKarnaliStatement,
  },
  mataBageshwori: {
    certificate: TemplateMataBageshworiCertificate,
    statement:   TemplateMataBageshworiStatement,
  },
  narayan: {
    certificate: TemplateNarayanCertificate,
    statement:   TemplateNarayanStatement,
  },
  shahabhagi: {
    certificate: TemplateShahabhagiCertificate,
    statement:   TemplateShahabhagiStatement,
  },
  sumnima: {
    certificate: TemplateSumnimaCertificate,
    statement:   TemplateSumnimaStatement,
  },
  tribeni: {
    certificate: TemplateTribeniCertificate,
    statement:   TemplateTribeniStatement,
  },
  vyas: {
    certificate: TemplateVyasCertificate,
    statement:   TemplateVyasStatement,
  },
} as const;

export type BankTemplateKey     = keyof typeof BankTemplates;
export type BankTemplateVariant = "certificate" | "statement";
