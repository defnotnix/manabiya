"use client";

import { Center, Divider, LoadingOverlay, ScrollArea, Text, Stack, Group, Box, Paper } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { useRef, useEffect, useState } from "react";
import { useDocContext } from "@/context/DocumentContext";
import { WodaDocumentDisplayTemplate, BankStatementDisplayTemplate } from "@/components/templates";
import { TemplateStudentCertificate } from "@/components/templates/student-certificate";
import { WodaDrawer } from "./drawers/WodaDrawer";
import { StatementDrawer } from "./drawers/StatementDrawer";

import { DocHeader } from "./components/DocHeader";
import { DocTabs } from "./components/DocTabs";
import { EmptyState } from "./components/EmptyState";
import { useDocumentActions } from "./hooks/useDocumentActions";

function DocTemplate() {
    const { activeDocument, bankData, wodaData, documentData, setDocumentData } = useDocContext();
    const [issueDate, setIssueDate] = useState<Date | null>(null);

    // Update document data when issue date changes
    const handleIssueDateChange = (dateStr: string | null) => {
        if (dateStr) {
            const date = new Date(dateStr);
            setIssueDate(date);
            if (documentData) {
                setDocumentData({
                    ...documentData,
                    issue: dateStr,
                });
            }
        } else {
            setIssueDate(null);
            if (documentData) {
                setDocumentData({
                    ...documentData,
                    issue: "",
                });
            }
        }
    };

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
        return (
            <Stack gap="md" align="center">
                <Box style={{ width: "100%", maxWidth: "900px" }}>
                    <Paper p="md" radius="md" withBorder>
                        <Group gap="md">
                            <DateInput
                                label="Issue Date"
                                placeholder="Select issue date"
                                value={issueDate}
                                onChange={handleIssueDateChange}
                                clearable
                                style={{ flex: 1 }}
                            />
                        </Group>
                    </Paper>
                </Box>
                <TemplateStudentCertificate />
            </Stack>
        );
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
    const printableContentRef = useRef<HTMLDivElement>(null);
    const [wodaDrawerOpened, wodaDrawerHandlers] = useDisclosure(false);
    const [statementDrawerOpened, statementDrawerHandlers] = useDisclosure(false);
    const [certificateDrawerOpened, certificateDrawerHandlers] = useDisclosure(false);
    const [cvDrawerOpened, cvDrawerHandlers] = useDisclosure(false);

    // Auto-select certificate document when page loads with student_id
    useEffect(() => {
        if (studentId && documents.length > 0) {
            const certDocument = documents.find((d) => d.type === "student-certificate");
            if (certDocument) {
                setActiveDocumentId(certDocument.id);
            }
        }
    }, [studentId, documents.length, setActiveDocumentId]);

    const { isDeleting, handlePrintAll, handlePrintCurrent, handleRemoveDocument } = useDocumentActions({
        studentId,
        activeDocumentType: activeDocument?.type,
        activeDocumentLabel: activeDocument?.label ?? null,
        onDocumentRemoved: removeDocument,
        printableContentRef,
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
                    <LoadingOverlay visible={isDeleting} zIndex={0} />
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
                        <div ref={printableContentRef}>
                            <Center>
                                <DocTemplate />
                            </Center>
                        </div>
                    )}
                </div>

                <WodaDrawer opened={wodaDrawerOpened} onClose={wodaDrawerHandlers.close} />
                <StatementDrawer opened={statementDrawerOpened} onClose={statementDrawerHandlers.close} />

            </ScrollArea>

        </div>
    );
}
