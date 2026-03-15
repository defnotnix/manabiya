import { useState } from "react";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { moduleApiCall } from "@settle/core";
import { Text } from "@mantine/core";
import { PRINT_LOG_API } from "@/modules/admin/students/module.config";
import { DocType } from "@/context/DocumentContext";

interface UseDocumentActionsProps {
    studentId: number | null;
    activeDocumentType?: DocType;
    activeDocumentLabel?: string | null;
    onDocumentRemoved: (docId: string) => void;
}

export function useDocumentActions({
    studentId,
    activeDocumentType,
    activeDocumentLabel,
    onDocumentRemoved,
}: UseDocumentActionsProps): {
    isDeleting: boolean;
    handlePrintAll: () => void;
    handlePrintCurrent: () => void;
    handleRemoveDocument: (docId: string, docLabel: string, docType: DocType) => void;
} {
    const [isDeleting, setIsDeleting] = useState(false);

    const logPrint = async (scope: "all" | "current") => {
        if (!studentId) return;
        await PRINT_LOG_API.createRecord({
            student: studentId,
            content: {
                template: scope === "all" ? "all" : (activeDocumentType ?? "unknown"),
                printed_for: scope,
                snapshot: {
                    document_label: scope === "all" ? "All Documents" : (activeDocumentLabel ?? "Unknown"),
                },
            },
        });
    };

    const handlePrintAll = () => {
        window.print();
        logPrint("all");
    };

    const handlePrintCurrent = () => {
        window.print();
        logPrint("current");
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
