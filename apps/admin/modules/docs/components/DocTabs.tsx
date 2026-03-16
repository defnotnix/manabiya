"use client";

import { Button, Container, Group, Menu, Paper, Text, Box } from "@mantine/core";
import { PenIcon, PlusIcon, XIcon } from "@phosphor-icons/react";
import { BANK_KEY_LABELS, DocType } from "@/context/DocumentContext";
import { useDocContext } from "@/context/DocumentContext";

interface Document {
    id: string;
    label: string;
    type: DocType;
    meta?: Record<string, any>;
}

interface DocTabsProps {
    documents: Document[];
    activeDocumentId?: string;
    onSelectDocument: (docId: string) => void;
    onRemoveDocument: (docId: string, docLabel: string, docType: DocType) => void;
    onOpenWodaDrawer: () => void;
    onOpenStatementDrawer: () => void;
    onOpenCertificateDrawer: () => void;
    onOpenCvDrawer: () => void;
}

export function DocTabs({
    documents,
    activeDocumentId,
    onSelectDocument,
    onRemoveDocument,
    onOpenWodaDrawer,
    onOpenStatementDrawer,
    onOpenCertificateDrawer,
    onOpenCvDrawer,
}: DocTabsProps) {
    const { activeDocument, bankData } = useDocContext();

    return (
        <Paper radius={0}>
            <Container size="xl">
                <Group justify="space-between">
                    <Group gap={0}>
                        {documents.map((doc) => (
                            <Group key={doc.id} gap={0} wrap="nowrap">
                                <Button
                                    radius={0}
                                    size="xs"
                                    color={activeDocumentId === doc.id ? "brand" : "blue"}
                                    variant={activeDocumentId === doc.id ? "filled" : "light"}
                                    onClick={() => onSelectDocument(doc.id)}
                                    rightSection={
                                        <Box
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onRemoveDocument(doc.id, doc.label, doc.type);
                                            }}
                                            style={{
                                                cursor: "pointer",
                                                padding: "4px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <XIcon size={12} color={activeDocumentId === doc.id ? "white" : "var(--mantine-color-brand-6)"} />
                                        </Box>
                                    }
                                >
                                    <Text size="xs">{doc.label}</Text>
                                </Button>

                            </Group>
                        ))}
                        <Menu withArrow position="bottom-end">
                            <Menu.Target>
                                <Button
                                    radius={0}

                                    color="brand"
                                    size="xs"
                                    variant="subtle"
                                    leftSection={<PlusIcon />}
                                >
                                    Add Document
                                </Button>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item
                                    onClick={onOpenCertificateDrawer}
                                    disabled={documents.some((d) => d.type === "student-certificate")}
                                >
                                    <Text size="xs">Student Certificate</Text>
                                </Menu.Item>
                                <Menu.Item
                                    onClick={onOpenCvDrawer}
                                    disabled={documents.some((d) => d.type === "student-cv")}
                                >
                                    <Text size="xs">Student CV</Text>
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Item
                                    onClick={onOpenWodaDrawer}
                                    disabled={documents.some((d) => d.type === "woda-documents")}
                                >
                                    <Text size="xs">Woda Certificate</Text>
                                </Menu.Item>
                                <Menu.Item
                                    onClick={onOpenStatementDrawer}
                                    disabled={documents.some((d) => d.type === "bank-statement")}
                                >
                                    <Text size="xs">Statement Document</Text>
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>

                    <Group justify="flex-end">
                        {activeDocument?.type === "woda-documents" && (
                            <Button
                                radius={0}
                                color="teal"
                                size="xs"
                                onClick={onOpenWodaDrawer}
                                leftSection={<PenIcon />}
                            >
                                Edit
                            </Button>
                        )}

                        {activeDocument?.type === "bank-statement" && (
                            <Group gap="xs">
                                {bankData && bankData.bank && (
                                    <Group gap="xs">
                                        <Text size="xs" fw={600}>
                                            {BANK_KEY_LABELS[bankData.bank]}
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            ·
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            {bankData.accountHolderName}
                                        </Text>
                                    </Group>
                                )}
                                <Button
                                    radius={0}
                                    size="xs"
                                    color="teal"
                                    onClick={onOpenStatementDrawer}
                                    leftSection={<PenIcon />}
                                >
                                    Edit
                                </Button>
                            </Group>
                        )}


                    </Group>
                </Group>
            </Container>
        </Paper>
    );
}
