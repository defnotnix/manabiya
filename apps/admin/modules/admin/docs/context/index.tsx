"use client";

import { createContext, useContext, useState, useMemo, ReactNode } from "react";

// --- Document types ---

export type DocType =
  | "student-certificate"
  | "student-cv"
  | "woda-documents"   // one entry = all woda docs bundled together
  | "bank-statement";  // one entry = one bank org (bankKey stored in meta)

export const DOC_TYPE_LABELS: Record<DocType, string> = {
  "student-certificate": "Student Certificate",
  "student-cv": "Student CV",
  "woda-documents": "Woda Documents",
  "bank-statement": "Bank Statement",
};

/** Human-readable labels for the 9 individual woda sub-documents */
export const WODA_SUB_LABELS: Record<string, string> = {
  relationship_verification:     "Relationship Verification",
  occupation_verification:       "Occupation Verification",
  dob_verification:              "Date of Birth Verification",
  annual_income_verification:    "Annual Income Verification",
  tax_clearance:                 "Tax Clearance Certificate",
  fiscal_year_details:           "Fiscal Year Details",
  migration:                     "Migration Certificate",
  surname:                       "Surname Change Certificate",
  address:                       "Address Change Certificate",
};

/** Sub-documents bundled inside a bank-statement entry */
export const BANK_SUB_LABELS: Record<string, string> = {
  certificate: "Certificate",
  statement:   "Statement",
};

/** Sub-documents bundled inside a student-certificate entry */
export const STUDENT_CERT_SUB_LABELS: Record<string, string> = {
  certificate: "Certificate",
};

/** Short display names for each bank organisation key */
export const BANK_KEY_LABELS: Record<string, string> = {
  bigyalaxmi:     "Bigyalaxmi Saving & Credit",
  birendranagar:  "Birendranagar Saving & Credit",
  himchuli:       "Himchuli Saving & Credit",
  janautthan:     "Janautthan Multipurpose Co-op",
  karnali:        "Karnali Agriculture Co-op",
  mataBageshwori: "Mata Bageshwori Saving & Credit",
  narayan:        "Narayan Multipurpose Co-op",
  shahabhagi:     "Shahabhagi Saving & Credit",
  sumnima:        "Sumnima Saving & Credit",
  tribeni:        "Shree Tribeni Saving & Credit",
  vyas:           "Vyas Saving & Credit",
};

export type DocEntry = {
  id: string;
  type: DocType;
  label: string;
  /** Extra metadata — e.g. bankKey for bank-statement entries */
  meta?: { bankKey?: string };
};

// --- Certificate data types ---

export type CertificateMarkEntry = {
  month: string;
  total_days: number;
  class_hr: number;
  present: number;
  absent: number;
  attendance_percentage: number;
};

export type StudentCertificateData = {
  firstname: string;
  middlename?: string;
  lastname: string;
  date_of_birth: string;
  gender: "Male" | "Female";
  address: string;
  date_of_admission: string;
  date_of_completion: string;
  issue: string;
  coursehour: number;
  grammar: "A" | "B" | "C" | "D";
  listening: "A" | "B" | "C" | "D";
  conversation: "A" | "B" | "C" | "D";
  reading: "A" | "B" | "C" | "D";
  composition: "A" | "B" | "C" | "D";
  studyType: 0 | 1;
  image?: string;
  customBranch?: string;
  customBranchNo?: string;
  batch: {
    course: {
      name: string;
      level: string;
      total_days: number;
      books: { name: string }[];
    };
    instructor: { name: string }[];
  };
  marking: CertificateMarkEntry[];
};

// --- Context type ---

export type DocContextType = {
  // Document list
  documents: DocEntry[];
  activeDocumentId: string | null;
  activeDocument: DocEntry | null;
  addDocument: (type: DocType, meta?: DocEntry["meta"]) => void;
  removeDocument: (id: string) => void;
  setActiveDocumentId: (id: string | null) => void;
  // Woda sub-document navigation
  activeWodaKey: string | null;
  setActiveWodaKey: (key: string | null) => void;
  // Student data payload
  documentData: StudentCertificateData | null;
  setDocumentData: (data: StudentCertificateData | null) => void;
};

// --- Context ---

const DocContext = createContext<DocContextType | null>(null);

// --- Provider ---

export function DocContextProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<DocEntry[]>([]);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const [activeWodaKey, setActiveWodaKey] = useState<string | null>(null);
  const [documentData, setDocumentData] = useState<StudentCertificateData | null>(null);

  const activeDocument = useMemo(
    () => documents.find((d) => d.id === activeDocumentId) ?? null,
    [documents, activeDocumentId]
  );

  function addDocument(type: DocType, meta?: DocEntry["meta"]) {
    // Bank statements: only one allowed — replace the existing one
    if (type === "bank-statement") {
      const existing = documents.find((d) => d.type === "bank-statement");
      if (existing) {
        const label = meta?.bankKey ? (BANK_KEY_LABELS[meta.bankKey] ?? DOC_TYPE_LABELS[type]) : DOC_TYPE_LABELS[type];
        setDocuments((prev) =>
          prev.map((d) => (d.id === existing.id ? { ...d, label, meta } : d))
        );
        setActiveDocumentId(existing.id);
        return;
      }
    }
    const id = crypto.randomUUID();
    let label = DOC_TYPE_LABELS[type];
    if (type === "bank-statement" && meta?.bankKey) {
      label = BANK_KEY_LABELS[meta.bankKey] ?? label;
    }
    const entry: DocEntry = { id, type, label, meta };
    setDocuments((prev) => [...prev, entry]);
    setActiveDocumentId(id);
  }

  function removeDocument(id: string) {
    setDocuments((prev) => {
      const next = prev.filter((d) => d.id !== id);
      return next;
    });
    setActiveDocumentId((prev) => {
      if (prev !== id) return prev;
      const remaining = documents.filter((d) => d.id !== id);
      return remaining.at(-1)?.id ?? null;
    });
  }

  return (
    <DocContext.Provider
      value={{
        documents,
        activeDocumentId,
        activeDocument,
        addDocument,
        removeDocument,
        setActiveDocumentId,
        activeWodaKey,
        setActiveWodaKey,
        documentData,
        setDocumentData,
      }}
    >
      {children}
    </DocContext.Provider>
  );
}

// --- Hook ---

export function useDocContext() {
  const ctx = useContext(DocContext);
  if (!ctx)
    throw new Error("useDocContext must be used within DocContextProvider");
  return ctx;
}
