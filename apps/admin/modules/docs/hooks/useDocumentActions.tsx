import { useState } from "react";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { moduleApiCall } from "@settle/core";
import { Text } from "@mantine/core";
import { useReactToPrint } from "react-to-print";
import { useQueryClient } from "@tanstack/react-query";
import { PRINT_LOG_API } from "@/modules/admin/students/module.config";
import { DocType, StudentCertificateData, WodaDocData, BankStatementData } from "@/context/DocumentContext";

interface UseDocumentActionsProps {
    studentId: number | null;
    activeDocumentType?: DocType;
    activeDocumentLabel?: string | null;
    onDocumentRemoved: (docId: string) => void;
    printableContentRef?: React.RefObject<HTMLDivElement | null>;
    documentData?: StudentCertificateData | null;
    bankData?: BankStatementData | null;
    wodaData?: WodaDocData | null;
    bankKey?: string | null;
    selectedInstructor?: string | null;
    selectedDirector?: string | null;
    issueDate?: Date | null;
    studyType?: string | null;
    signatures?: Array<{ id: string; name: string; signature_image: string; role?: string; jp_role?: string }>;
}

export function useDocumentActions({
    studentId,
    activeDocumentType,
    activeDocumentLabel,
    onDocumentRemoved,
    printableContentRef,
    documentData,
    bankData,
    wodaData,
    bankKey,
    selectedInstructor,
    selectedDirector,
    issueDate,
    studyType,
    signatures,
}: UseDocumentActionsProps): {
    isDeleting: boolean;
    handlePrintAll: () => void;
    handlePrintCurrent: () => void;
    handleRemoveDocument: (docId: string, docLabel: string, docType: DocType) => void;
} {
    const [isDeleting, setIsDeleting] = useState(false);
    const queryClient = useQueryClient();

    const logPrint = async (scope: "all" | "current") => {
        if (!studentId) return;

        let snapshot: Record<string, any> = {
            document_label: scope === "all" ? "All Documents" : (activeDocumentLabel ?? "Unknown"),
            active_document_type: scope === "all" ? "all" : (activeDocumentType ?? "unknown"),
        };

        // Build template-specific snapshot data for current document
        if (activeDocumentType === "student-certificate" && documentData) {
            snapshot.template_data = documentData;
            snapshot.instructor = selectedInstructor || "";
            snapshot.director = selectedDirector || "";
            snapshot.issue_date = issueDate ? issueDate.toISOString().split('T')[0] : "";
            snapshot.study_type = studyType || "0";

            // Save full signature data so historical render still works if signatures are deleted/inactivated
            if (signatures && selectedInstructor) {
                const instructorSig = signatures.find(s => String(s.id) === selectedInstructor);
                if (instructorSig) {
                    snapshot.instructor_data = instructorSig;
                }
            }
            if (signatures && selectedDirector) {
                const directorSig = signatures.find(s => String(s.id) === selectedDirector);
                if (directorSig) {
                    snapshot.director_data = directorSig;
                }
            }
        } else if (activeDocumentType === "bank-statement" && bankData) {
            snapshot.template_data = bankData;
            snapshot.bank_key = bankKey || "";
        } else if (activeDocumentType === "woda-documents" && wodaData) {
            snapshot.template_data = wodaData;
        }

        try {
            await PRINT_LOG_API.createRecord({
                student: studentId,
                content: {
                    template: scope === "all" ? "all" : (activeDocumentType ?? "unknown"),
                    printed_for: scope,
                    snapshot,
                },
            });

            // Invalidate and refetch print logs
            queryClient.invalidateQueries({
                queryKey: ["print-logs", studentId],
            });

            notifications.show({
                title: "Success",
                message: "Print logged successfully",
                color: "green",
            });
        } catch (error) {
            console.error("Error logging print:", error);
            notifications.show({
                title: "Error",
                message: "Failed to save print log",
                color: "red",
            });
        }
    };

    const printAll = useReactToPrint({
        contentRef: printableContentRef,
        documentTitle: "All Documents",
    });

    const printCurrent = useReactToPrint({
        contentRef: printableContentRef,
        documentTitle: activeDocumentLabel || "Document",
    });

    const handlePrintAll = () => {
        modals.openConfirmModal({
            title: <Text size="md" fw={600}>Save Print?</Text>,
            children: (
                <Text size="sm" c="dimmed">
                    Save this print to the log for future reference? You can view and restore these details later.
                </Text>
            ),
            styles: {
                content: {
                    padding: "var(--mantine-padding-md)",
                },
            },
            labels: { confirm: "Save Print", cancel: "Print Without Saving" },
            confirmProps: { color: "blue" },
            onConfirm: async () => {
                await logPrint("all");
                setTimeout(() => printAll(), 100);
            },
            onCancel: () => {
                setTimeout(() => printAll(), 0);
            },
        });
    };

    const handlePrintCurrent = () => {
        modals.openConfirmModal({
            title: <Text size="md" fw={600}>Save Print?</Text>,
            children: (
                <Text size="sm" c="dimmed">
                    Save this document to the log for future reference? You can view and restore these details later.
                </Text>
            ),
            styles: {
                content: {
                    padding: "var(--mantine-padding-md)",
                },
            },
            labels: { confirm: "Save Print", cancel: "Print Without Saving" },
            confirmProps: { color: "blue" },
            onConfirm: async () => {
                await logPrint("current");
                setTimeout(() => printCurrent(), 100);
            },
            onCancel: () => {
                setTimeout(() => printCurrent(), 0);
            },
        });
    };

    const handleRemoveDocument = (docId: string, docLabel: string, docType: DocType) => {
        modals.openConfirmModal({
            title: <Text size="sm">Remove Document?</Text>,
            children: (
                <Text size="sm">
                    Are you sure you want to remove "{docLabel}"? This action cannot be undone.
                </Text>
            ),
            styles: {
                content: {
                    padding: "var(--mantine-padding-xs)",
                },
            },
            labels: { confirm: "Remove", cancel: "Cancel" },
            confirmProps: { color: "red" },
            onConfirm: async () => {
                try {
                    setIsDeleting(true);
                    const endpoint =
                        docType === "woda-documents"
                            ? `/api/documents/woda-docs/`
                            : docType === "bank-statement"
                              ? `/api/documents/statements/`
                              : null;

                    if (endpoint) {
                        await moduleApiCall.deleteRecord({ endpoint, id: docId });
                    }

                    onDocumentRemoved(docId);

                    notifications.show({
                        title: "Success",
                        message: "Document deleted successfully",
                        color: "green",
                    });
                } catch (error) {
                    console.error("Error deleting document:", error);
                    notifications.show({
                        title: "Error",
                        message: "Failed to delete document",
                        color: "red",
                    });
                } finally {
                    setIsDeleting(false);
                }
            },
        });
    };

    return {
        isDeleting,
        handlePrintAll,
        handlePrintCurrent,
        handleRemoveDocument,
    };
}
