"use client";

import { Center, Divider, LoadingOverlay, ScrollArea, Text, Stack, Group, Box, Paper, useMantineColorScheme, Select, SimpleGrid } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { useRef, useEffect, useState } from "react";
import { moduleApiCall } from "@settle/core";
import { useDocContext } from "@/context/DocumentContext";
import { WodaDocumentDisplayTemplate, BankStatementDisplayTemplate } from "@/components/templates";
import { TemplateStudentCertificate } from "@/components/templates/student-certificate";
import { WodaDrawer } from "./drawers/WodaDrawer";
import { StatementDrawer } from "./drawers/StatementDrawer";

import { DocHeader } from "./components/DocHeader";
import { DocTabs } from "./components/DocTabs";
import { EmptyState } from "./components/EmptyState";
import { useDocumentActions } from "./hooks/useDocumentActions";

interface DocTemplateProps {
    selectedInstructor: string | null;
    selectedDirector: string | null;
    signatures: Array<{ id: string; name: string }>;
}

function DocTemplate(props: DocTemplateProps) {
    const { activeDocument, bankData, wodaData, documentData } = useDocContext();

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
        return (
            <div data-mantine-color-scheme="light">
                <WodaDocumentDisplayTemplate data={wodaData} />
            </div>
        );
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
        return (
            <div data-mantine-color-scheme="light">
                <BankStatementDisplayTemplate data={bankData} bankKey={bankKey} />
            </div>
        );
    }

    if (activeDocument.type === "student-certificate") {
        return (
            <Stack gap="md" align="center">
                <div data-mantine-color-scheme="light">
                    <TemplateStudentCertificate
                        selectedInstructor={props.selectedInstructor}
                        selectedDirector={props.selectedDirector}
                        signatures={props.signatures}
                    />
                </div>
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
    const { colorScheme } = useMantineColorScheme();
    const { activeDocument, activeDocumentId, studentId, documents, removeDocument, setActiveDocumentId, documentData, setDocumentData } = useDocContext();
    const printableContentRef = useRef<HTMLDivElement>(null);
    const [wodaDrawerOpened, wodaDrawerHandlers] = useDisclosure(false);
    const [statementDrawerOpened, statementDrawerHandlers] = useDisclosure(false);
    const [certificateDrawerOpened, certificateDrawerHandlers] = useDisclosure(false);
    const [cvDrawerOpened, cvDrawerHandlers] = useDisclosure(false);
    const [issueDate, setIssueDate] = useState<Date | null>(null);
    const [signatures, setSignatures] = useState<Array<{ id: string; name: string }>>([]);
    const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);
    const [selectedDirector, setSelectedDirector] = useState<string | null>(null);

    const backgroundColor = colorScheme === "dark" ? "var(--mantine-color-dark-7)" : "var(--mantine-color-gray-2)";

    // Fetch signatures on component mount
    useEffect(() => {
        const fetchSignatures = async () => {
            try {
                const response = await moduleApiCall.getRecords({
                    endpoint: "/api/students/signatures/",
                });
                if (response?.results) {
                    setSignatures(response.results);
                    if (response.results.length > 0) {
                        setSelectedInstructor(String(response.results[0].id));
                        setSelectedDirector(String(response.results[0].id));
                    }
                }
            } catch (error) {
                console.error("Error fetching signatures:", error);
            }
        };
        fetchSignatures();
    }, []);

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
                background: backgroundColor,
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

            {activeDocument?.type === "student-certificate" && (
                <Box p="md" className="no-print">
                    <SimpleGrid cols={3} spacing="md" style={{ maxWidth: "900px", margin: "0 auto" }}>
                        <DateInput
                            label="Issue Date"
                            placeholder="Select issue date"
                            value={issueDate}
                            onChange={handleIssueDateChange}
                            clearable
                        />
                        <Select
                            label="Instructor"
                            placeholder="Select instructor"
                            data={signatures.map((sig) => ({
                                value: String(sig.id),
                                label: sig.name,
                            }))}
                            value={selectedInstructor}
                            onChange={setSelectedInstructor}
                            searchable
                        />
                        <Select
                            label="Managing Director"
                            placeholder="Select director"
                            data={signatures.map((sig) => ({
                                value: String(sig.id),
                                label: sig.name,
                            }))}
                            value={selectedDirector}
                            onChange={setSelectedDirector}
                            searchable
                        />
                    </SimpleGrid>
                </Box>
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
                                <DocTemplate
                                    selectedInstructor={selectedInstructor}
                                    selectedDirector={selectedDirector}
                                    signatures={signatures}
                                />
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
