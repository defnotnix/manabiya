"use client";

import { useState } from "react";
import { ActionIcon, Button, Center, Container, Divider, Group, Menu, Paper, SimpleGrid, Stack, Text, Loader, LoadingOverlay } from "@mantine/core";
import { CaretDownIcon, PenIcon, PlusIcon, PrinterIcon, XIcon } from "@phosphor-icons/react";
import { modals } from "@mantine/modals";
import { useDisclosure } from "@mantine/hooks";
import { useDocContext, BANK_KEY_LABELS, DocType } from "@/context/DocumentContext";
import { notifications } from "@mantine/notifications";
import { moduleApiCall } from "@settle/core";
import { WodaDocumentDisplayTemplate, BankStatementDisplayTemplate } from "@/components/templates";
import { WodaDrawer } from "./drawers/WodaDrawer";
import { StatementDrawer } from "./drawers/StatementDrawer";
import { PRINT_LOG_API } from "@/modules/admin/students/module.config";

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

    return (
        <Center py="xl">
            <Text size="sm" c="dimmed">
                No template available for "{activeDocument.label}".
            </Text>
        </Center>
    );
}

export function ModuleAdminDocs() {
    const { activeDocument, activeDocumentId, studentId, documents, removeDocument, setActiveDocumentId, bankData } = useDocContext();
    const [wodaDrawerOpened, wodaDrawerHandlers] = useDisclosure(false);
    const [statementDrawerOpened, statementDrawerHandlers] = useDisclosure(false);
    const [isDeleting, setIsDeleting] = useState(false);

    async function logPrint(scope: "all" | "current") {
        if (!studentId) return;
        await PRINT_LOG_API.createRecord({
            student: studentId,
            content: {
                template: scope === "all" ? "all" : (activeDocument?.type ?? "unknown"),
                printed_for: scope,
                snapshot: {
                    document_label: scope === "all" ? "All Documents" : (activeDocument?.label ?? "Unknown"),
                },
            },
        });
    }

    function handlePrintAll() {
        window.print();
        logPrint("all");
    }

    function handlePrintCurrent() {
        window.print();
        logPrint("current");
    }

    function handleRemoveDocument(docId: string, docLabel: string, docType: DocType) {
        modals.openConfirmModal({
            title: <Text size="sm">
                Remove Document?
            </Text>,
            children: (
                <Text size="sm">
                    Are you sure you want to remove "{docLabel}"? This action cannot be undone.
                </Text>
            ),
            styles: {
                content: {
                    padding: 'var(--mantine-padding-xs)'
                }
            },
            labels: { confirm: "Remove", cancel: "Cancel" },
            confirmProps: { color: "red" },
            onConfirm: async () => {
                try {
                    setIsDeleting(true);
                    // Delete from appropriate API endpoint based on document type
                    const endpoint = docType === "woda-documents"
                        ? `/api/documents/woda-docs/`
                        : docType === "bank-statement"
                            ? `/api/documents/statements/`
                            : null;

                    if (endpoint) {
                        await moduleApiCall.deleteRecord({ endpoint, id: docId });
                    }

                    // Remove from context
                    removeDocument(docId);

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
    }

    return (
        <div
            style={{
                background: "var(--mantine-color-gray-2)",
                minHeight: "100vh",
                overflow: "hidden"
            }}
        >
            <Paper radius={0}>
                <Container >
                    <SimpleGrid cols={2} h={40}>
                        <Group>



                            <Text size="xs" fw={800}>
                                {activeDocument
                                    ? `Document Editor — ${activeDocument.label}`
                                    : "Document Editor"}
                            </Text>
                        </Group>



                        <Group gap={1} justify="flex-end">


                            <Button size="xs" leftSection={<PrinterIcon weight="fill" />} onClick={handlePrintAll}>
                                Print All
                            </Button>

                            <Menu withArrow position="bottom-end">
                                <Menu.Target>
                                    <Button size="xs" px={8} >
                                        <CaretDownIcon weight="bold" />
                                    </Button>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Item leftSection={<PrinterIcon weight="fill" />} onClick={handlePrintCurrent}>
                                        <Text size="xs">Print Current Document Only</Text>
                                    </Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Item leftSection={<PrinterIcon weight="fill" />}>
                                        <Text size="xs">Print Woda Document - Birth Certificate</Text>
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </Group>
                    </SimpleGrid>
                </Container>
            </Paper>

            <Divider />

            {documents.length > 0 && (
                <Paper>
                    <Container>
                        <Group justify="space-between">
                            <Group gap={0}>
                                {documents.map((doc) => (
                                    <Group key={doc.id} gap={0} wrap="nowrap">
                                        <Button
                                            radius={0}
                                            size="xs"
                                            color={activeDocumentId === doc.id ? "brand" : "blue"}
                                            variant={activeDocumentId === doc.id ? "filled" : "light"}
                                            onClick={() => setActiveDocumentId(doc.id)}
                                            rightSection={<ActionIcon
                                                size="xs"

                                                radius="xl"
                                                variant="transparent"
                                                onClick={() => handleRemoveDocument(doc.id, doc.label, doc.type)}
                                                color={activeDocumentId === doc.id ? "white" : "brand"}
                                            >
                                                <XIcon size={12} />
                                            </ActionIcon>}
                                        >
                                            <Text size="xs">{doc.label}</Text>
                                        </Button>

                                    </Group>
                                ))}
                                <Menu withArrow position="bottom-end">
                                    <Menu.Target>
                                        <Button radius={0} ml={4} color="brand" size="xs" variant="subtle" leftSection={<PlusIcon />}>
                                            Add Document
                                        </Button>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Item
                                            onClick={() => wodaDrawerHandlers.open()}
                                            disabled={documents.some(d => d.type === "woda-documents")}
                                        >
                                            <Text size="xs">Woda Certificate</Text>
                                        </Menu.Item>
                                        <Menu.Item
                                            onClick={() => statementDrawerHandlers.open()}
                                            disabled={documents.some(d => d.type === "bank-statement")}
                                        >
                                            <Text size="xs">Statement Document</Text>
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </Group>

                            {activeDocument?.type === "woda-documents" && (
                                <Button radius={0} color="teal" size="xs" variant="light" onClick={() => wodaDrawerHandlers.open()} leftSection={<PenIcon />}>
                                    Edit
                                </Button>
                            )}

                            {activeDocument?.type === "bank-statement" && (
                                <Group gap="xs">
                                    {bankData && bankData.bank && (
                                        <Group gap="xs">
                                            <Text size="xs" fw={600}>{BANK_KEY_LABELS[bankData.bank]}</Text>
                                            <Text size="xs" c="dimmed">·</Text>
                                            <Text size="xs" c="dimmed">{bankData.accountHolderName}</Text>
                                        </Group>
                                    )}
                                    <Button radius={0} size="xs" variant="light" onClick={() => statementDrawerHandlers.open()} leftSection={<PenIcon />}>
                                        Edit
                                    </Button>
                                </Group>
                            )}
                        </Group>
                    </Container>
                </Paper>
            )}

            <Divider />

            <div style={{ position: "relative" }}>
                <LoadingOverlay visible={isDeleting} zIndex={1000} />
                {studentId && documents.length === 0 ? (
                    <Center py="xl" style={{ flex: 1, minHeight: "400px" }}>
                        <Stack gap="lg" align="center">
                            <Loader />
                            <Text size="sm" c="dimmed">
                                Loading documents...
                            </Text>
                        </Stack>
                    </Center>
                ) : documents.length === 0 ? (
                    <Center py="xl" style={{ flex: 1, minHeight: "400px" }}>
                        <Stack gap="lg" align="center">
                            <Text size="lg" fw={600} c="dimmed">
                                No documents created yet
                            </Text>
                            <Group gap="lg">
                                <Button
                                    size="lg"
                                    variant="light"
                                    onClick={() => wodaDrawerHandlers.open()}
                                >
                                    Add Woda Certificate
                                </Button>
                                <Button
                                    size="lg"
                                    variant="light"
                                    onClick={() => statementDrawerHandlers.open()}
                                >
                                    Add Statement Document
                                </Button>
                            </Group>
                        </Stack>
                    </Center>
                ) : (
                    <Center>
                        <DocTemplate />
                    </Center>
                )}
            </div>

            <WodaDrawer opened={wodaDrawerOpened} onClose={wodaDrawerHandlers.close} />
            <StatementDrawer opened={statementDrawerOpened} onClose={statementDrawerHandlers.close} />
        </div>
    );
}
