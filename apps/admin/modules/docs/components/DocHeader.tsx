"use client";

import { Button, Container, Group, Menu, Paper, SimpleGrid, Text, Loader, ThemeIcon } from "@mantine/core";
import { CaretDownIcon, PrinterIcon, CheckCircle } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { PRINT_LOG_API } from "@/modules/admin/students/module.api";
import { DocType } from "@/context/DocumentContext";

export type PrintLog = {
    id: number;
    student: number;
    content: { template: string; printed_for: string; snapshot: Record<string, any> };
    created_at: string;
};

interface DocHeaderProps {
    activeDocumentLabel?: string;
    documentsCount: number;
    onPrintAll: () => void;
    onPrintCurrent: () => void;
    studentId: number | null;
    onSelectLog: (log: PrintLog) => void;
    activeHistoricalLogId?: number | null;
}

export function DocHeader({
    activeDocumentLabel,
    documentsCount,
    onPrintAll,
    onPrintCurrent,
    studentId,
    onSelectLog,
    activeHistoricalLogId,
}: DocHeaderProps) {
    const { data: printLogs = [], isLoading: logsLoading } = useQuery({
        queryKey: ["print-logs", studentId],
        queryFn: async () => {
            if (!studentId) return [];
            const res = await PRINT_LOG_API.getRecordsByStudent(String(studentId));
            return res.data ?? [];
        },
        enabled: !!studentId,
    });

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Paper radius={0}>
            <Container size="xl">
                <SimpleGrid cols={2} h={40}>
                    <Group gap={4}>
                        <Text size="sm" fw={800} visibleFrom="lg">
                            {activeDocumentLabel
                                ? `Document Editor — ${activeDocumentLabel}`
                                : "Document Editor"}
                            {` View`}
                        </Text>

                        <Text size="xs" fw={800} hiddenFrom="lg">
                            {activeDocumentLabel
                                ? `Document Editor`
                                : "Document Editor"}
                            {` View`}
                        </Text>

                        <Text size="sm" c="dimmed" fw={800}>
                            {/* Here should be student name */}
                        </Text>
                    </Group>

                    <Group gap={1} justify="flex-end">
                        <Button
                            size="xs"
                            leftSection={<PrinterIcon weight="fill" />}
                            onClick={onPrintAll}
                            disabled={documentsCount <= 0}
                        >
                            Print All
                        </Button>

                        {/* Desktop: Print history dropdown beside Print All */}
                        {printLogs.length > 0 && (
                            <Menu withArrow position="bottom-end">
                                <Menu.Target>
                                    <Button
                                        size="xs"
                                        variant="default"
                                        px={8}
                                        disabled={documentsCount <= 0}
                                        display={{ base: "none", lg: "flex" }}
                                    >
                                        <CaretDownIcon weight="bold" />
                                    </Button>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Label>
                                        <Group justify="space-between">
                                            <Text size="xs">Print History</Text>
                                            {logsLoading && <Loader size={12} />}
                                        </Group>
                                    </Menu.Label>
                                    {printLogs.map((log: PrintLog) => (
                                        <Menu.Item
                                            key={log.id}
                                            onClick={() => onSelectLog(log)}
                                            leftSection={activeHistoricalLogId === log.id ? <CheckCircle size={16} weight="fill" /> : null}
                                        >
                                            <Text size="xs">
                                                {log.content.snapshot.document_label} — {formatDate(log.created_at)}
                                            </Text>
                                        </Menu.Item>
                                    ))}
                                </Menu.Dropdown>
                            </Menu>
                        )}

                        {/* Mobile + Desktop fallback: More options menu */}
                        <Menu withArrow position="bottom-end">
                            <Menu.Target>
                                <Button
                                    size="xs"
                                    px={8}
                                    disabled={documentsCount <= 0}
                                    display={{ lg: "none" }}
                                >
                                    <CaretDownIcon weight="bold" />
                                </Button>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item
                                    leftSection={<PrinterIcon weight="fill" />}
                                    onClick={onPrintCurrent}
                                >
                                    <Text size="xs">Print Current Document Only</Text>
                                </Menu.Item>
                                {printLogs.length > 0 && (
                                    <>
                                        <Menu.Divider />
                                        <Menu.Item rightSection={<CaretDownIcon size={14} style={{ marginLeft: "auto" }} />}>
                                            <Text size="xs">Print History</Text>
                                            <Menu position="right-start" withArrow>
                                                <Menu.Target>
                                                    <div />
                                                </Menu.Target>
                                                <Menu.Dropdown>
                                                    {printLogs.map((log: PrintLog) => (
                                                        <Menu.Item
                                                            key={log.id}
                                                            onClick={() => onSelectLog(log)}
                                                            leftSection={activeHistoricalLogId === log.id ? <CheckCircle size={16} weight="fill" /> : null}
                                                        >
                                                            <Text size="xs">
                                                                {log.content.snapshot.document_label} — {formatDate(log.created_at)}
                                                            </Text>
                                                        </Menu.Item>
                                                    ))}
                                                </Menu.Dropdown>
                                            </Menu>
                                        </Menu.Item>
                                    </>
                                )}
                                {printLogs.length === 0 && !logsLoading && (
                                    <>
                                        <Menu.Divider />
                                        <Menu.Item disabled>
                                            <Text size="xs">No print history</Text>
                                        </Menu.Item>
                                    </>
                                )}
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </SimpleGrid>
            </Container>
        </Paper>
    );
}
