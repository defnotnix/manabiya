"use client";

import { createContext, useContext, useState, useMemo, ReactNode, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { moduleApiCall } from "@settle/core";

// --- Document mode type ---

export type DocumentMode = "new" | "student" | "custom";

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
    relationship_verification: "Relationship Verification",
    occupation_verification: "Occupation Verification",
    dob_verification: "Date of Birth Verification",
    annual_income_verification: "Annual Income Verification",
    tax_clearance: "Tax Clearance Certificate",
    fiscal_year_details: "Fiscal Year Details",
    migration: "Migration Certificate",
    surname: "Surname Change Certificate",
    address: "Address Change Certificate",
};

/** Sub-documents bundled inside a bank-statement entry */
export const BANK_SUB_LABELS: Record<string, string> = {
    certificate: "Certificate",
    statement: "Statement",
};

/** Sub-documents bundled inside a student-certificate entry */
export const STUDENT_CERT_SUB_LABELS: Record<string, string> = {
    certificate: "Certificate",
};

/** Short display names for each bank organisation key */
export const BANK_KEY_LABELS: Record<string, string> = {
    bigyalaxmi: "Bigyalaxmi Saving & Credit",
    birendranagar: "Birendranagar Saving & Credit",
    himchuli: "Himchuli Saving & Credit",
    janautthan: "Janautthan Multipurpose Co-op",
    karnali: "Karnali Agriculture Co-op",
    mataBageshwori: "Mata Bageshwori Saving & Credit",
    narayan: "Narayan Multipurpose Co-op",
    shahabhagi: "Shahabhagi Saving & Credit",
    sumnima: "Sumnima Saving & Credit",
    tribeni: "Shree Tribeni Saving & Credit",
    vyas: "Vyas Saving & Credit",
};

export type DocEntry = {
    id: string;
    type: DocType;
    label: string;
    /** Extra metadata — e.g. bankKey for bank-statement entries */
    meta?: { bankKey?: string; statementId?: number; wodaDocId?: number };
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

export type WodaDocData = {
    // FormWodaGeneral fields
    wodadoc_refno: string;
    wodadoc_date: Date | null;
    spokesperson_name: string;
    spokesperson_post: string;
    spokesperson_contact: string;

    // FormWodaSpecific fields
    signature_issued_act_relationship: string;
    extra_relation: boolean;
    relation_extra_honorific: string;
    relation_extra_name: string;
    relation_extra_relation: string;

    fiscal_1_bs: string;
    fiscal_1_ad: string;
    fiscal_fullfiscal_1: string;
    fiscal_2_bs: string;
    fiscal_2_ad: string;
    fiscal_fullfiscal_2: string;
    fiscal_3_bs: string;
    fiscal_3_ad: string;
    fiscal_fullfiscal_3: string;

    applicant_earning_guardian: string;
    occupations: Array<{ name: string; income1: number; income2: number; income3: number }>;
    occupation_note: string;

    signature_issued_act_dob: string;

    usd_rate: number;
    rate_date: Date | null;

    tax: number;
    tax_clearance_issuer: string;
    signature_tax: string;

    initial_address: string;
    migration_date: Date | null;
    signature_migration_alongwith: string;

    applicant_surname_reference: string;
    applicant_parents_surname: string;
    applicant_surname: string;

    initial_address_name: string;
    address_name_change_date: Date | null;
    address_name_change_date_bs: string;

    // Applicant Personal Details
    applicant_gender: string;
    applicant_honorific: string;
    applicant_name: string;
    applicant_permanent_address: string;
    applicant_dob: Date | null;
    applicant_dob_bs: string;
    applicant_birth_address: string;
    applicant_citizenship: string;
    applicant_citizenship_issuer: string;
    applicant_father_honorific: string;
    applicant_father_name: string;
    applicant_mother_honorific: string;
    applicant_mother_name: string;

    // Metadata
    applicantName?: string;
    documentType?: string;
    municipality?: string;
    notes?: string;
};

export type BankStatementData = {
    bank_template: string;

    // Account Details
    statement_ref_no: string;
    statement_ref_no_statement: string;
    statement_account_no: string;
    statement_member_id: string;
    statement_account_holder: string;
    statement_account_address: string;
    statement_account_type: string;
    statement_account_status: string;
    statement_start_date: Date | null;
    statement_end_date: Date | null;
    statement_interest_calculation: string;
    statement_tax: number;
    statement_interest: number;
    statement_interest_method: string;
    statement_interest_post: string;
    statement_opening_balance: number;
    statements_opening_bal: number;
    statement_usdrate: number;
    statement_usdrate_equiv: number;
    statement_total_balance_words: string;
    statement_total_balance_words_usd: string;
    statement_spokesperson: string;
    statement_spokesperson_post: string;

    // Statement Table
    statements_opening_date: Date | null;
    statements_has_code: boolean;
    statements_has_cheque: boolean;
    statements: Array<{
        date: string;
        description: string;
        debit: number;
        credit: number;
        code: string;
        cheque: string;
        key: string;
        highlight?: boolean;
    }>;
    intrestStartIndex: number;
    pastIntrestStartIndex: number[];

    // Calculated fields for template rendering
    workedStatements?: Array<{
        date: string;
        description: string;
        debit: number;
        credit: number;
        code: string;
        cheque: string;
        key: string;
        highlight?: boolean;
    }>;
    statement_debit_total?: number;
    statement_credit_total?: number;

    // Legacy fields for compatibility
    bank?: string;
    accountHolderName?: string;
    accountNumber?: string;
    accountType?: "savings" | "current";
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
    // Woda data payload
    wodaData: WodaDocData | null;
    setWodaData: (data: WodaDocData | null) => void;
    // Bank statement data payload
    bankData: BankStatementData | null;
    setBankData: (data: BankStatementData | null) => void;
    // Custom group context
    customGroupId: number | null;
    setCustomGroupId: (id: number | null) => void;
    // Student context
    studentId: number | null;
    // Document mode
    documentMode: DocumentMode;
};

// --- Context ---

const DocContext = createContext<DocContextType | null>(null);

// --- Data Transformers ---

/** Transform nested WODA template to flat WodaDocData */
function transformWodaTemplate(template: any): WodaDocData {
    if (!template) return {} as WodaDocData;

    const body = template.body || {};
    const general = body.general || {};
    const relationship = body.relationship || {};
    const fiscal = body.fiscal || {};
    const occupation = body.occupation || {};
    const dob = body.dob || {};
    const income = body.income || {};
    const tax = body.tax || {};
    const migration = body.migration || {};
    const surname = body.surname || {};
    const address = body.address || {};
    const applicant = body.applicant || {};

    return {
        wodadoc_refno: general.refNo || "",
        wodadoc_date: general.date || null,
        spokesperson_name: general.spokesperson?.name || "",
        spokesperson_post: general.spokesperson?.post || "",
        spokesperson_contact: general.spokesperson?.contact || "",

        signature_issued_act_relationship: relationship.issuedAct || "",
        extra_relation: relationship.extraRelation || false,
        relation_extra_honorific: relationship.extraPersonnel?.honorific || "",
        relation_extra_name: relationship.extraPersonnel?.name || "",
        relation_extra_relation: relationship.extraPersonnel?.relation || "",

        fiscal_1_bs: fiscal.years?.[0]?.bs || "",
        fiscal_1_ad: fiscal.years?.[0]?.ad || "",
        fiscal_fullfiscal_1: fiscal.years?.[0]?.fullText || "",
        fiscal_2_bs: fiscal.years?.[1]?.bs || "",
        fiscal_2_ad: fiscal.years?.[1]?.ad || "",
        fiscal_fullfiscal_2: fiscal.years?.[1]?.fullText || "",
        fiscal_3_bs: fiscal.years?.[2]?.bs || "",
        fiscal_3_ad: fiscal.years?.[2]?.ad || "",
        fiscal_fullfiscal_3: fiscal.years?.[2]?.fullText || "",

        applicant_earning_guardian: occupation.earningGuardian || "",
        occupations: occupation.occupations || [],
        occupation_note: occupation.note || "",

        signature_issued_act_dob: dob.verificationText || "",

        usd_rate: income.usdRate || 0,
        rate_date: income.rateDate || null,

        tax: tax.rate || 0,
        tax_clearance_issuer: tax.clearanceIssuer || "",
        signature_tax: tax.signatureText || "",

        initial_address: migration.initialAddress || "",
        migration_date: migration.migrationDate || null,
        signature_migration_alongwith: migration.alongwith || "",

        applicant_surname_reference: surname.comparedWith || "",
        applicant_parents_surname: surname.parentsSurname || "",
        applicant_surname: surname.applicantSurname || "",

        initial_address_name: address.initialName || "",
        address_name_change_date: address.changeDate || null,
        address_name_change_date_bs: address.changeDateBs || "",

        applicant_gender: applicant.gender || "",
        applicant_honorific: applicant.honorific || "",
        applicant_name: applicant.name || "",
        applicant_permanent_address: applicant.permanentAddress || "",
        applicant_dob: applicant.dob || null,
        applicant_dob_bs: applicant.dobBs || "",
        applicant_birth_address: applicant.birthAddress || "",
        applicant_citizenship: applicant.citizenship || "",
        applicant_citizenship_issuer: applicant.citizenshipIssuer || "",
        applicant_father_honorific: applicant.father?.honorific || "",
        applicant_father_name: applicant.father?.name || "",
        applicant_mother_honorific: applicant.mother?.honorific || "",
        applicant_mother_name: applicant.mother?.name || "",
    } as WodaDocData;
}

/** Transform nested bank statement template to flat BankStatementData */
function transformBankTemplate(template: any): BankStatementData {
    if (!template) return {} as BankStatementData;

    const body = template.body || {};
    const statements = body.statements || [];

    // Calculate totals if not already provided
    let totalDebit = body.statement_debit_total || 0;
    let totalCredit = body.statement_credit_total || 0;

    if (!body.statement_debit_total || !body.statement_credit_total) {
        statements.forEach((stmt: any) => {
            totalDebit += stmt.debit || 0;
            totalCredit += stmt.credit || 0;
        });
    }

    return {
        bank_template: body.bank_template || "",
        statement_ref_no: body.statement_ref_no || "",
        statement_ref_no_statement: body.statement_ref_no_statement || "",
        statement_account_no: body.statement_account_no || "",
        statement_member_id: body.statement_member_id || "",
        statement_account_holder: body.statement_account_holder || "",
        statement_account_address: body.statement_account_address || "",
        statement_account_type: body.statement_account_type || "",
        statement_account_status: body.statement_account_status || "",
        statement_start_date: body.statement_start_date || null,
        statement_end_date: body.statement_end_date || null,
        statement_interest_calculation: body.statement_interest_calculation || "",
        statement_tax: body.statement_tax || 0,
        statement_interest: body.statement_interest || 0,
        statement_interest_method: body.statement_interest_method || "",
        statement_interest_post: body.statement_interest_post || "",
        statement_opening_balance: body.statement_opening_balance || 0,
        statements_opening_bal: body.statements_opening_bal || 0,
        statement_usdrate: body.statement_usdrate || 0,
        statement_usdrate_equiv: body.statement_usdrate_equiv || 0,
        statement_total_balance_words: body.statement_total_balance_words || "",
        statement_total_balance_words_usd: body.statement_total_balance_words_usd || "",
        statement_spokesperson: body.statement_spokesperson || "",
        statement_spokesperson_post: body.statement_spokesperson_post || "",
        statements_opening_date: body.statements_opening_date || null,
        statements_has_code: body.statements_has_code || false,
        statements_has_cheque: body.statements_has_cheque || false,
        statements: statements,
        intrestStartIndex: body.intrestStartIndex || 0,
        pastIntrestStartIndex: body.pastIntrestStartIndex || [],
        // Add calculated fields for template rendering
        workedStatements: body.workedStatements || statements,
        statement_debit_total: totalDebit,
        statement_credit_total: totalCredit,
    } as BankStatementData;
}

// --- Provider ---

export function DocContextProvider({ children }: { children: ReactNode }) {
    const [documents, setDocuments] = useState<DocEntry[]>([]);
    const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
    const [activeWodaKey, setActiveWodaKey] = useState<string | null>(null);
    const [documentData, setDocumentData] = useState<StudentCertificateData | null>(null);
    const [wodaData, setWodaData] = useState<WodaDocData | null>(null);
    const [bankData, setBankData] = useState<BankStatementData | null>(null);
    const [customGroupId, setCustomGroupId] = useState<number | null>(null);
    const [studentId, setStudentId] = useState<number | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Read customGroupId and studentId from URL on mount/change
    useEffect(() => {
        const customParam = searchParams?.get("custom");
        const studentParam = searchParams?.get("student_id");
        if (customParam) {
            setCustomGroupId(parseInt(customParam, 10));
        }
        if (studentParam) {
            setStudentId(parseInt(studentParam, 10));
        }
    }, [searchParams]);

    // Sync customGroupId to URL when it changes programmatically (only on docs page)
    useEffect(() => {
        // Only sync params if we're on the docs page
        if (!pathname.includes("/docs")) return;
        if (customGroupId === null) return;
        const customParam = searchParams?.get("custom");
        if (customParam === String(customGroupId)) return; // Already in URL

        const params = new URLSearchParams(searchParams?.toString() || "");
        params.set("custom", String(customGroupId));
        router.replace(`${pathname}?${params.toString()}`);
    }, [customGroupId, searchParams, pathname, router]);

    // Clear params when navigating away from docs page
    useEffect(() => {
        if (pathname.includes("/docs")) return; // Don't clear if on docs page

        // Check if we have docs-related params and remove them
        const currentParams = new URLSearchParams(searchParams?.toString() || "");
        if (currentParams.has("student_id") || currentParams.has("custom")) {
            currentParams.delete("student_id");
            currentParams.delete("custom");
            const newSearch = currentParams.toString();
            const newUrl = newSearch ? `${pathname}?${newSearch}` : pathname;
            router.replace(newUrl);
        }
    }, [pathname, searchParams, router]);

    const activeDocument = useMemo(
        () => documents.find((d) => d.id === activeDocumentId) ?? null,
        [documents, activeDocumentId]
    );

    // Fetch existing documents for the current context (student or custom group)
    useEffect(() => {
        if (!studentId && !customGroupId) return;

        const fetchContextDocuments = async () => {
            try {
                const filterParams = studentId
                    ? { student: studentId }
                    : { custom: customGroupId };

                // Fetch woda documents for this context
                const wodaResponse = await moduleApiCall.getRecords({
                    endpoint: "/api/documents/woda-docs/",
                    params: filterParams,
                });

                // Fetch statements for this context
                const statementsResponse = await moduleApiCall.getRecords({
                    endpoint: "/api/documents/statements/",
                    params: filterParams,
                });

                const newDocuments: DocEntry[] = [];

                // Add woda documents to the list
                if (wodaResponse?.results?.length > 0) {
                    wodaResponse.results.forEach((woda: any) => {
                        newDocuments.push({
                            id: `woda-${woda.id}`,
                            type: "woda-documents",
                            label: woda.name,
                            meta: { wodaDocId: woda.id },
                        });
                    });
                }

                // Add statements to the list
                if (statementsResponse?.results?.length > 0) {
                    statementsResponse.results.forEach((statement: any) => {
                        newDocuments.push({
                            id: `statement-${statement.id}`,
                            type: "bank-statement",
                            label: statement.name,
                            meta: {
                                bankKey: statement.bank?.toLowerCase().replace(/\s+/g, ''),
                                statementId: statement.id,
                            },
                        });
                    });
                }

                // If studentId is present, pre-add student certificate and CV templates
                if (studentId) {
                    // Add student certificate template
                    newDocuments.unshift({
                        id: `student-cert-${studentId}`,
                        type: "student-certificate",
                        label: DOC_TYPE_LABELS["student-certificate"],
                    });

                    // Add student CV template
                    newDocuments.unshift({
                        id: `student-cv-${studentId}`,
                        type: "student-cv",
                        label: DOC_TYPE_LABELS["student-cv"],
                    });
                }

                // Only update if we found documents
                if (newDocuments.length > 0) {
                    setDocuments(newDocuments);
                    // Set student-certificate as active if studentId is present, otherwise first document
                    const activeId = studentId
                        ? newDocuments.find(d => d.type === "student-certificate")?.id
                        : newDocuments[0].id;
                    if (activeId) {
                        setActiveDocumentId(activeId);
                    }
                }
            } catch (error) {
                console.error("Error fetching context documents:", error);
            }
        };

        fetchContextDocuments();
    }, [studentId, customGroupId]);

    // Fetch document data from API when activeDocument changes
    useEffect(() => {
        if (!activeDocument) {
            setWodaData(null);
            setBankData(null);
            return;
        }

        const fetchDocumentData = async () => {
            try {
                if (activeDocument.type === "woda-documents" && activeDocument.meta?.wodaDocId) {
                    // Clear bank data when switching to woda
                    setBankData(null);

                    // Fetch woda document data
                    const data = await moduleApiCall.getSingleRecord({
                        endpoint: "/api/documents/woda-docs/",
                        id: activeDocument.meta.wodaDocId,
                    });
                    if (data?.template) {
                        const flatData = transformWodaTemplate(data.template);
                        console.log("API template structure:", data.template);
                        console.log("Transformed flatData:", flatData);
                        setWodaData(flatData);
                    }
                } else if (activeDocument.type === "bank-statement" && activeDocument.meta?.statementId) {
                    // Clear woda data when switching to bank statement
                    setWodaData(null);

                    // Fetch bank statement data
                    const data = await moduleApiCall.getSingleRecord({
                        endpoint: "/api/documents/statements/",
                        id: activeDocument.meta.statementId,
                    });
                    console.log("Bank statement API response:", data);
                    console.log("Bank statement template:", data?.template);

                    if (data?.template) {
                        const flatData = transformBankTemplate(data.template);
                        console.log("Transformed bank data:", flatData);
                        setBankData(flatData);
                    } else if (data?.body) {
                        // Fallback: if data has body but no template wrapper
                        console.warn("Bank statement data has body but no template wrapper, using body directly");
                        const flatData = transformBankTemplate({ body: data.body });
                        setBankData(flatData);
                    } else if (data) {
                        // Last resort: treat entire data object as if it were BankStatementData
                        console.warn("Bank statement data structure unknown, attempting to use directly");
                        setBankData(data as any);
                    }
                }
            } catch (error) {
                console.error("Error fetching document data:", error);
            }
        };

        fetchDocumentData();
    }, [activeDocument]);

    const documentMode: DocumentMode = useMemo(() => {
        if (studentId) return "student";
        if (customGroupId) return "custom";
        return "new";
    }, [studentId, customGroupId]);

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
                wodaData,
                setWodaData,
                bankData,
                setBankData,
                customGroupId,
                setCustomGroupId,
                studentId,
                documentMode,
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
