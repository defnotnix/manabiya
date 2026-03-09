// ─────────────────────────────────────────────────────────────────────────────
// LEGACY — prefer importing from "../templates" for the organised nested API:
//   import { Templates, WodaTemplates, BankTemplates } from "../templates";
// This file remains for backwards-compat and for `configTemplateInfo`.
// ─────────────────────────────────────────────────────────────────────────────
import { TemplateBigyalaxmiCertificate } from "./statement/bigyalaxmi/certificate";
import { TemplateBigyalaxmiStatement } from "./statement/bigyalaxmi/statement";
import { TemplateBirendranagarCertificate } from "./statement/birendranagar/certificate";
import { TemplateBirendranagarStatement } from "./statement/birendranagar/statement";
import { TemplateHimchuliCertificate } from "./statement/himchuli/certificate";
import { TemplateHimchuliStatement } from "./statement/himchuli/statement";
import { TemplateJanautthanCertificate } from "./statement/janautthan/certificate";
import { TemplateJanautthanStatement } from "./statement/janautthan/statement";
import { TemplateKarnaliCertificate } from "./statement/karnali/certificate";
import { TemplateKarnaliStatement } from "./statement/karnali/statement";
import { TemplateMataBageshworiCertificate } from "./statement/mataBageshwori/certificate";
import { TemplateMataBageshworiStatement } from "./statement/mataBageshwori/statement";
import { TemplateNarayanCertificate } from "./statement/narayan/certificate";
import { TemplateNarayanStatement } from "./statement/narayan/statement";
import { TemplateSumnimaCertificate } from "./statement/sumnima/certificate";
import { TemplateSumnimaStatement } from "./statement/sumnima/statement";
import { TemplateTribeniCertificate } from "./statement/tribeni/certificate";
import { TemplateTribeniStatement } from "./statement/tribeni/statement";
import { TemplateVyasertificate } from "./statement/vyas/certificate";
import { TemplateVyasStatement } from "./statement/vyas/statement";
import { TemplateShahabhagiCertificate } from "./statement/shahabhagi/certificate";
import { TemplateShahabhagiStatement } from "./statement/shahabhagi/statement";
import { TemplatePermanentAddress } from "./woda/address";
import { TemplateDOBVerification } from "./woda/dob";
import { TemplateFiscalYear } from "./woda/fiscal";
import { TemplateIncomeVerification } from "./woda/income";
import { TemplateMigration } from "./woda/migration";
import { TemplateOccupationVerification } from "./woda/occupation";
import { TemplateRelationshipVerification } from "./woda/relationship";
import { TemplateSurname } from "./woda/surname";
import { TemplateTaxClearance } from "./woda/taxClearance";

//images
import imgAnnual from "@/assets/img/template/woda/annual.png";
import imgDob from "@/assets/img/template/woda/dob.png";
import imgFiscal from "@/assets/img/template/woda/fiscal.png";
import imgMigration from "@/assets/img/template/woda/migration.png";
import imgOccupation from "@/assets/img/template/woda/occupation.png";
import imgRelationship from "@/assets/img/template/woda/relationship.png";
import imgSurname from "@/assets/img/template/woda/surname.png";
import imgTax from "@/assets/img/template/woda/tax.png";
//statement
import imgBiyalaxmiCt from "@/assets/img/template/statement/bigyalaxmi_ct.png";
import imgBiyalaxmiSt from "@/assets/img/template/statement/bigyalaxmi_st.png";
import imgVyasCt from "@/assets/img/template/statement/vyas_ct.png";
import imgVyasSt from "@/assets/img/template/statement/vyas_st.png";
import imgSumnimaCt from "@/assets/img/template/statement/sumnima_ct.png";
import imgSumnimaSt from "@/assets/img/template/statement/sumnima_st.png";
import imgMataBageshworiCt from "@/assets/img/template/statement/matabageshwori_ct.png";
import imgMataBageshworiSt from "@/assets/img/template/statement/matabageshwori_st.png";
import imgNarayanCt from "@/assets/img/template/statement/narayan_ct.png";
import imgNarayanSt from "@/assets/img/template/statement/narayan_st.png";

export const T = {
  relationship_verification: TemplateRelationshipVerification,
  occupation_verification: TemplateOccupationVerification,
  dob_verification: TemplateDOBVerification,
  annual_income_verification: TemplateIncomeVerification,
  tax_clearance: TemplateTaxClearance,
  fiscal_year_details: TemplateFiscalYear,
  migration: TemplateMigration,
  surname: TemplateSurname,
  // * STATEMENTS
  sumnima_statement: TemplateSumnimaStatement,
  sumnima_certificate: TemplateSumnimaCertificate,
  mataBageshwori_statement: TemplateMataBageshworiStatement,
  mataBageshwori_certificate: TemplateMataBageshworiCertificate,
  narayan_statement: TemplateNarayanStatement,
  narayan_certificate: TemplateNarayanCertificate,
  himchuli_statement: TemplateHimchuliStatement,
  himchuli_certificate: TemplateHimchuliCertificate,
  vyas_statement: TemplateVyasStatement,
  vyas_certificate: TemplateVyasertificate,
  birendranagar_certificate: TemplateBirendranagarCertificate,
  birendranagar_statement: TemplateBirendranagarStatement,
  karnali_certificate: TemplateKarnaliCertificate,
  karnali_statement: TemplateKarnaliStatement,
  janautthan_certificate: TemplateJanautthanCertificate,
  janautthan_statement: TemplateJanautthanStatement,
  bigyalaxmi_certificate: TemplateBigyalaxmiCertificate,
  bigyalaxmi_statement: TemplateBigyalaxmiStatement,
  tribeni_certificate: TemplateTribeniCertificate,
  tribeni_statement: TemplateTribeniStatement,
  sahabhagi_certificate: TemplateShahabhagiCertificate,
  sahabhagi_statement: TemplateShahabhagiStatement,
  address: TemplatePermanentAddress,
};

export const configTemplateInfo: any[] = [
  {
    group: "Woda Documents",
    value: "woda",
    type: "woda",
    items: [
      {
        value: "relationship_verification",
        label: "Relationship Verification",
        img: imgRelationship.src,
      },
      {
        value: "occupation_verification",
        label: "Occupation Verification",
        img: imgOccupation.src,
      },
      {
        value: "dob_verification",
        label: "Date of Birth Verification",
        img: imgDob.src,
      },
      {
        value: "annual_income_verification",
        label: "Annual Income Verification",
        img: imgAnnual.src,
      },
      {
        value: "tax_clearance",
        label: "TAX Clearance",
        img: imgTax.src,
      },
      {
        value: "fiscal_year_details",
        label: "Fiscal Year Details",
        img: imgFiscal.src,
      },

      {
        value: "migration",
        label: "Migration",
        disablePreSelect: true,
        img: imgMigration.src,
      },
      {
        value: "surname",
        label: "Surname Verification",
        disablePreSelect: true,
        img: imgSurname.src,
      },
      {
        value: "address",
        label: "Permanent Address Verification",
        disablePreSelect: true,
        img: imgSurname.src,
      },
    ],
  },

  {
    group: "Bigyalaxmi Saving & Credit Co-Operative Ltd.",
    value: "bigyalaxmi",
    type: "bank",
    items: [
      {
        value: "bigyalaxmi_certificate",
        label: "Bigyalaxmi Saving | Balance Certificate",
        img: imgBiyalaxmiCt.src,
      },
      {
        value: "bigyalaxmi_statement",
        label: "Bigyalaxmi Saving | Balance Statement",
        img: imgBiyalaxmiSt.src,
      },
    ],
  },

  {
    group: "Sumnima Saving & Credit Coop. Ltd.",
    value: "sumnima",
    type: "bank",

    //disable: true,
    items: [
      {
        value: "sumnima_certificate",
        label: "Sumnima | Balance Certificate",
        img: imgSumnimaCt.src,
      },
      {
        value: "sumnima_statement",
        label: "Sumnima | Balance Statement",
        img: imgSumnimaSt.src,
      },
    ],
  },
  {
    group: "Mata Bageshwori Saving & Credit Co-operative Ltd.",
    value: "mataBageshwori",
    type: "bank",
    //disable: true,
    items: [
      {
        value: "mataBageshwori_certificate",
        label: "Mata Bageshwori | Balance Certificate",
        img: imgMataBageshworiCt.src,
      },
      {
        value: "mataBageshwori_statement",
        label: "Mata Bageshwori | Balance Statement",
        img: imgMataBageshworiSt.src,
      },
    ],
  },
  {
    group: "Narayan Multipurpose Co-Operative Ltd.",
    value: "narayan",
    type: "bank",
    //disable: true,
    items: [
      {
        value: "narayan_certificate",
        label: "Narayan Multipurpose | Balance Certificate",
        img: imgNarayanCt.src,
      },
      {
        value: "narayan_statement",
        label: "Narayan Multipurpose| Balance Statement",
        img: imgNarayanSt.src,
      },
    ],
  },
  {
    group: "Himchui Saving & Co-Operative Ltd.",
    value: "himchuli",
    type: "bank",
    //disable: true,
    items: [
      {
        value: "himchuli_certificate",
        label: "Himchui Saving | Balance Certificate",
      },
      {
        value: "himchuli_statement",
        label: "Himchui Saving| Balance Statement",
      },
    ],
  },
  {
    group: "Vyas Saving & Credit Co-Operative Ltd.",
    value: "vyas",
    type: "bank",
    items: [
      {
        value: "vyas_certificate",
        label: "Vyas Saving & Credit | Balance Certificate",
        img: imgVyasCt.src,
      },
      {
        value: "vyas_statement",
        label: "Vyas Saving & Credit| Balance Statement",
        img: imgVyasSt.src,
      },
    ],
  },
  {
    group: "Birendranagar Saving & Credit Co-Operative Ltd.",
    value: "birendranagar",
    type: "bank",
    //disable: true,
    items: [
      {
        value: "birendranagar_certificate",
        label: "Birendranagar Saving & Credit | Balance Certificate",
      },
      {
        value: "birendranagar_statement",
        label: "Birendranagar Saving & Credit | Balance Statement",
      },
    ],
  },
  {
    group: "Karnali Agriculture Multipurpose Co-Operative Ltd.",
    value: "karnali",
    type: "bank",
    //disable: true,
    items: [
      {
        value: "karnali_certificate",
        label: "Karnali Agriculture Multipurpose | Balance Certificate",
      },
      {
        value: "karnali_statement",
        label: "Karnali Agriculture Multipurpose | Balance Statement",
      },
    ],
  },
  {
    group: "Janautthan Multipurpose Co-Operative Society Ltd.",
    value: "janautthan",
    //disable: true,
    type: "bank",
    items: [
      {
        value: "janautthan_certificate",
        label: "Janautthan Multipurpose | Balance Certificate",
      },
      {
        value: "janautthan_statement",
        label: "Janautthan Multipurpose | Balance Statement",
      },
    ],
  },

  {
    group: "Shree Tribeni Saving & Credit Co-Operative Ltd.",
    value: "tribeni",
    type: "bank",
    //disable: true,
    items: [
      {
        value: "tribeni_certificate",
        label: "Shree Tribeni Saving | Balance Certificate",
      },
      {
        value: "tribeni_statement",
        label: "Shree Tribeni Saving | Balance Statement",
      },
    ],
  },

  {
    group: "Sahabhagi Saving & Credit Co-Operative Ltd.",
    value: "sahabhagi",
    type: "bank",
    //disable: true,
    items: [
      {
        value: "sahabhagi_certificate",
        label: "Sahabhagi Saving & Credit | Balance Certificate",
      },
      {
        value: "sahabhagi_statement",
        label: "Sahabhagi Saving & Credit | Balance Statement",
      },
    ],
  },
];
