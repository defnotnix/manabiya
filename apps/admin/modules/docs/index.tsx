"use client";

import { Center, Divider, LoadingOverlay, ScrollArea, Text, Stack, Box, useMantineColorScheme, Select, SimpleGrid, Grid } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { useRef, useEffect, useState } from "react";
import { moduleApiCall } from "@settle/core";
import { useDocContext } from "@/context/DocumentContext";
import { WodaDocumentDisplayTemplate, BankStatementDisplayTemplate } from "@/components/templates";
import { TemplateStudentCertificate } from "@/components/templates/student-certificate";
import { WodaDrawer } from "./drawers/WodaDrawer";
import { StatementDrawer } from "./drawers/StatementDrawer";

import { DocHeader, PrintLog } from "./components/DocHeader";
import { DocTabs } from "./components/DocTabs";
import { EmptyState } from "./components/EmptyState";
import { PrintLogsSidebar } from "./components/PrintLogsSidebar";
import { useDocumentActions } from "./hooks/useDocumentActions";

interface DocTemplateProps {
    selectedInstructor: string | null;
    selectedDirector: string | null;
    signatures: Array<{ id: string; name: string; signature_image: string }>;
    historicalLog?: PrintLog | null;
}

function DocTemplate(props: DocTemplateProps) {
    const { activeDocument, bankData, wodaData, documentData } = useDocContext();
    const { historicalLog } = props;

    // If viewing historical log, render from snapshot
    if (historicalLog && historicalLog.content?.snapshot?.template_data) {
        const { template: templateType, snapshot } = historicalLog.content;

        // Handle "all" template type — render the currently active document if it's a student cert
        const isCertificateLog = templateType === "student-certificate" ||
            snapshot.active_document_type === "student-certificate" ||
            (templateType === "all" && activeDocument?.type === "student-certificate");

        if (isCertificateLog) {
            // Merge saved metadata into the template data
            const mergedData = {
                ...snapshot.template_data,
                issue: snapshot.issue_date || snapshot.template_data.issue || "",
                studyType: snapshot.study_type !== undefined ? (snapshot.study_type === "0" || snapshot.study_type === 0 ? 0 : 1) : snapshot.template_data.studyType,
            };

            // Merge historical signature data so they render even if deleted/inactivated later
            const historicalSigs = [
                ...(snapshot.instructor_data ? [snapshot.instructor_data] : []),
                ...(snapshot.director_data ? [snapshot.director_data] : []),
            ];
            const mergedSignatures = [
                ...props.signatures,
                ...historicalSigs.filter(hs => !props.signatures.find(s => String(s.id) === String(hs.id))),
            ];

            return (
                <div data-mantine-color-scheme="light">
                    <TemplateStudentCertificate
                        selectedInstructor={snapshot.instructor || null}
                        selectedDirector={snapshot.director || null}
                        signatures={mergedSignatures}
                        overrideData={mergedData}
                    />
                </div>
            );
        }

        if ((templateType === "bank-statement" || (templateType === "all" && activeDocument?.type === "bank-statement")) && snapshot.template_data) {
            return (
                <div data-mantine-color-scheme="light">
                    <BankStatementDisplayTemplate data={snapshot.template_data} bankKey={snapshot.bank_key} />
                </div>
            );
        }

        if ((templateType === "woda-documents" || (templateType === "all" && activeDocument?.type === "woda-documents")) && snapshot.template_data) {
            return (
                <div data-mantine-color-scheme="light">
                    <WodaDocumentDisplayTemplate data={snapshot.template_data} />
                </div>
            );
        }
    }

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
    const { activeDocument, activeDocumentId, studentId, documents, removeDocument, setActiveDocumentId, documentData, setDocumentData, bankData, wodaData } = useDocContext();
    const printableContentRef = useRef<HTMLDivElement>(null);
    const [wodaDrawerOpened, wodaDrawerHandlers] = useDisclosure(false);
    const [statementDrawerOpened, statementDrawerHandlers] = useDisclosure(false);
    const [certificateDrawerOpened, certificateDrawerHandlers] = useDisclosure(false);
    const [cvDrawerOpened, cvDrawerHandlers] = useDisclosure(false);
    const [issueDate, setIssueDate] = useState<Date | null>(null);
    const [signatures, setSignatures] = useState<Array<{ id: string; name: string; signature_image: string }>>([]);
    const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);
    const [selectedDirector, setSelectedDirector] = useState<string | null>(null);
    const [studyType, setStudyType] = useState<string | null>("0");
    const [activeHistoricalLog, setActiveHistoricalLog] = useState<PrintLog | null>(null);

    const backgroundColor = colorScheme === "dark" ? "var(--mantine-color-dark-7)" : "var(--mantine-color-gray-2)";

    const handleStudyTypeChange = (value: string | null) => {
        if (value !== null) {
            setStudyType(value);
            if (documentData) {
                setDocumentData({
                    ...documentData,
                    studyType: value === "0" ? 0 : 1,
                });
            }
        }
    };

    // Fetch signatures on component mount
    useEffect(() => {
        const fetchSignatures = async () => {
            try {
                const response = await moduleApiCall.getRecords({
                    endpoint: "/api/students/signatures/",
                });
                if (response?.results) {
                    const filtered = response.results.filter((sig: any) => sig.is_active === true);
                    setSignatures(filtered);
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

    // Restore UI values when viewing a historical log
    useEffect(() => {
        if (activeHistoricalLog?.content?.snapshot) {
            const snapshot = activeHistoricalLog.content.snapshot;
            const { template: templateType } = activeHistoricalLog.content;

            // Only restore if viewing a student certificate (either explicitly or as part of "all")
            const isCertificateLog = templateType === "student-certificate" ||
                (templateType === "all" && activeDocument?.type === "student-certificate");

            if (isCertificateLog) {
                if (snapshot.instructor) {
                    setSelectedInstructor(snapshot.instructor);
                }
                if (snapshot.director) {
                    setSelectedDirector(snapshot.director);
                }
                if (snapshot.issue_date) {
                    setIssueDate(new Date(snapshot.issue_date));
                }
                if (snapshot.study_type !== undefined) {
                    setStudyType(snapshot.study_type);
                }
            }
        }
    }, [activeHistoricalLog, activeDocument?.type]);

    const { isDeleting, handlePrintAll, handlePrintCurrent, handleRemoveDocument } = useDocumentActions({
        studentId,
        activeDocumentType: activeDocument?.type,
        activeDocumentLabel: activeDocument?.label ?? null,
        onDocumentRemoved: removeDocument,
        printableContentRef,
        documentData,
        bankData,
        wodaData,
        bankKey: activeDocument?.meta?.bankKey ?? null,
        selectedInstructor,
        selectedDirector,
        issueDate,
        studyType,
        signatures,
    });

    return (
        <div
            style={{
                background: backgroundColor,
                minHeight: "100vh",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <DocHeader
                activeDocumentLabel={activeDocument?.label}
                documentsCount={documents.length}
                onPrintAll={handlePrintAll}
                onPrintCurrent={handlePrintCurrent}
                studentId={studentId}
                onSelectLog={setActiveHistoricalLog}
                activeHistoricalLogId={activeHistoricalLog?.id}
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

            <Grid>
                <Grid.Col span={{ base: 12, lg: 8 }}>
                    {activeDocument?.type === "student-certificate" && (
                        <Box p="md" className="no-print">
                            <SimpleGrid cols={{ base: 2, lg: 4 }} spacing="md" style={{ maxWidth: "900px", margin: "0 auto" }}>
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
                                    data={[
                                        { value: "", label: "Blank" },
                                        ...signatures.map((sig) => ({
                                            value: String(sig.id),
                                            label: sig.name,
                                        })),
                                    ]}
                                    value={selectedInstructor}
                                    onChange={setSelectedInstructor}
                                    searchable
                                    clearable
                                />
                                <Select
                                    label="Managing Director"
                                    placeholder="Select director"
                                    data={[
                                        { value: "", label: "Blank" },
                                        ...signatures.map((sig) => ({
                                            value: String(sig.id),
                                            label: sig.name,
                                        })),
                                    ]}
                                    value={selectedDirector}
                                    onChange={setSelectedDirector}
                                    searchable
                                    clearable
                                />
                                <Select
                                    label="Study Status"
                                    placeholder="Select study status"
                                    data={[
                                        { value: "0", label: "Currently Studying (履修している)" },
                                        { value: "1", label: "Completed (履修した)" },
                                    ]}
                                    value={studyType}
                                    onChange={handleStudyTypeChange}
                                />
                            </SimpleGrid>
                        </Box>
                    )}

                    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
                        <ScrollArea style={{ flex: 1 }}>
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
                                                historicalLog={activeHistoricalLog}
                                            />
                                        </Center>
                                    </div>
                                )}
                            </div>

                            <WodaDrawer opened={wodaDrawerOpened} onClose={wodaDrawerHandlers.close} />
                            <StatementDrawer opened={statementDrawerOpened} onClose={statementDrawerHandlers.close} />
                        </ScrollArea>


                    </div>
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 4 }}>
                    {/* Print Logs Sidebar */}
                    <div style={{ width: 320 }}>
                        <PrintLogsSidebar
                            studentId={studentId}
                            onSelectLog={setActiveHistoricalLog}
                            activeHistoricalLogId={activeHistoricalLog?.id}
                            activeDocumentType={activeDocument?.type ?? null}
                        />
                    </div>
                </Grid.Col>
            </Grid>

        </div>
    );
}
