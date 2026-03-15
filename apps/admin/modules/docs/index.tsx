"use client";

import { Center, Divider, LoadingOverlay, ScrollArea, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useDocContext } from "@/context/DocumentContext";
import { WodaDocumentDisplayTemplate, BankStatementDisplayTemplate } from "@/components/templates";
import { TemplateStudentCertificate } from "@/components/templates/student-certificate";
import { WodaDrawer } from "./drawers/WodaDrawer";
import { StatementDrawer } from "./drawers/StatementDrawer";
import { StudentCertificateDrawer } from "./drawers/StudentCertificateDrawer";
import { StudentCvDrawer } from "./drawers/StudentCvDrawer";
import { DocHeader } from "./components/DocHeader";
import { DocTabs } from "./components/DocTabs";
import { EmptyState } from "./components/EmptyState";
import { useDocumentActions } from "./hooks/useDocumentActions";

function DocTemplate() {
    const { activeDocument, bankData, wodaData } = useDocContext();

    if (!activeDocument) {
        return (
            <Center py="xl">
                <Text size="sm" c="dimmed">
                    Select or create a document from the panel on the right.
                </Text>
            </Center>
        );
    }

    if (activeDocument.type === "woda-documents") {
        if (!wodaData) {
            return (
                <Center py="xl">
                    <Text size="sm" c="dimmed">Loading document...</Text>
                </Center>
            );
        }
        return <WodaDocumentDisplayTemplate data={wodaData} />;
    }

    if (activeDocument.type === "bank-statement") {
        if (!bankData) {
            return (
                <Center py="xl">
                    <Text size="sm" c="dimmed">Loading document...</Text>
                </Center>
            );
        }
        const bankKey = activeDocument.meta?.bankKey;
        return <BankStatementDisplayTemplate data={bankData} bankKey={bankKey} />;
    }

    if (activeDocument.type === "student-certificate") {
        return <TemplateStudentCertificate />;
    }

    if (activeDocument.type === "student-cv") {
        return (
            <Center py="xl">
                <Text size="sm" c="dimmed">
                    Student CV template coming soon. Please create or edit from the drawer.
                </Text>
            </Center>
        );
    }

    return (
        <Center py="xl">
            <Text size="sm" c="dimmed">
                No template available for "{activeDocument.label}".
            </Text>
        </Center>
    );
}

export function ModuleAdminDocs() {
    const { activeDocument, activeDocumentId, studentId, documents, removeDocument, setActiveDocumentId } = useDocContext();
    const [wodaDrawerOpened, wodaDrawerHandlers] = useDisclosure(false);
    const [statementDrawerOpened, statementDrawerHandlers] = useDisclosure(false);
    const [certificateDrawerOpened, certificateDrawerHandlers] = useDisclosure(false);
    const [cvDrawerOpened, cvDrawerHandlers] = useDisclosure(false);

    const { isDeleting, handlePrintAll, handlePrintCurrent, handleRemoveDocument } = useDocumentActions({
        studentId,
        activeDocumentType: activeDocument?.type,
        activeDocumentLabel: activeDocument?.label ?? null,
        onDocumentRemoved: removeDocument,
    });

    return (
        <div
            style={{
                background: "var(--mantine-color-gray-2)",
                minHeight: "100vh",
                overflow: "hidden",
            }}
        >
            <DocHeader
                activeDocumentLabel={activeDocument?.label}
                documentsCount={documents.length}
                onPrintAll={handlePrintAll}
                onPrintCurrent={handlePrintCurrent}
            />

            <Divider />

            {documents.length > 0 && (
                <>
                    <DocTabs
                        documents={documents}
                        activeDocumentId={activeDocumentId ?? undefined}
                        onSelectDocument={setActiveDocumentId}
                        onRemoveDocument={handleRemoveDocument}
                        onOpenWodaDrawer={wodaDrawerHandlers.open}
                        onOpenStatementDrawer={statementDrawerHandlers.open}
                        onOpenCertificateDrawer={certificateDrawerHandlers.open}
                        onOpenCvDrawer={cvDrawerHandlers.open}
                    />
                    <Divider />
                </>
            )}


            <ScrollArea h={"calc(100vh - 75px)"}>
                <div style={{ position: "relative" }}>
                    <LoadingOverlay visible={isDeleting} zIndex={1000} />
                    {studentId && documents.length === 0 ? (
                        <EmptyState
                            isLoading={true}
                            onCreateWoda={wodaDrawerHandlers.open}
                            onCreateStatement={statementDrawerHandlers.open}
                            onCreateCertificate={certificateDrawerHandlers.open}
                            onCreateCV={cvDrawerHandlers.open}
                            isStudentContext={true}
                        />
                    ) : documents.length === 0 ? (
                        <EmptyState
                            isLoading={false}
                            onCreateWoda={wodaDrawerHandlers.open}
                            onCreateStatement={statementDrawerHandlers.open}
                            onCreateCertificate={certificateDrawerHandlers.open}
                            onCreateCV={cvDrawerHandlers.open}
                            isStudentContext={!!studentId}
                        />
                    ) : (
                        <Center>
                            <DocTemplate />
                        </Center>
                    )}
                </div>

                <WodaDrawer opened={wodaDrawerOpened} onClose={wodaDrawerHandlers.close} />
                <StatementDrawer opened={statementDrawerOpened} onClose={statementDrawerHandlers.close} />
                <StudentCertificateDrawer opened={certificateDrawerOpened} onClose={certificateDrawerHandlers.close} />
                <StudentCvDrawer opened={cvDrawerOpened} onClose={cvDrawerHandlers.close} />
            </ScrollArea>

        </div>
    );
}
