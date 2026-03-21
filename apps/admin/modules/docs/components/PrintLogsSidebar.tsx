"use client";

import { Paper, Stack, Text, Group, Loader, Button, ThemeIcon, ScrollArea, CheckIcon, Drawer, ActionIcon, Box } from "@mantine/core";
import { CheckCircle, Clock, ClockIcon, TrashIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { PRINT_LOG_API } from "@/modules/admin/students/module.api";
import { PrintLog } from "./DocHeader";

interface PrintLogsSidebarProps {
    studentId: number | null;
    onSelectLog: (log: PrintLog | null) => void;
    activeHistoricalLogId?: number | null;
    activeDocumentType?: string | null;
}

export function PrintLogsSidebar({
    studentId,
    onSelectLog,
    activeHistoricalLogId,
    activeDocumentType,
}: PrintLogsSidebarProps) {
    const [isLoadingLogId, setIsLoadingLogId] = useState<number | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const isMobile = useMediaQuery("(max-width: 768px)");

    const { data: printLogs = [], isLoading } = useQuery({
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

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Clear loading state after a short delay
    useEffect(() => {
        if (isLoadingLogId === null) return;
        const timer = setTimeout(() => setIsLoadingLogId(null), 500);
        return () => clearTimeout(timer);
    }, [isLoadingLogId]);

    const renderLogsList = () => (
        <Stack gap={0} h="100%">
            {/* Header */}
            <Group h={60} p="md" pb="xs" gap="xs" justify="space-between">
                <Group gap={4}>
                    <ClockIcon size={18} />
                    <Text fw={600} size="xs" flex={1}>
                        Print History
                    </Text>
                </Group>

                {activeHistoricalLogId && (
                    <Button leftSection={<TrashIcon />} size="xs" variant="light" rightSection={isLoading && <Loader size={16} />} onClick={() => onSelectLog(null)}>
                        Back
                    </Button>
                )}
            </Group>

            {/* Logs List */}
            {printLogs.length > 0 ? (
                <ScrollArea flex={1}>
                    <Stack gap={4} p="md">
                        {printLogs
                            .filter((log: PrintLog) => {
                                const logDocType = log.content.snapshot.active_document_type;
                                // Show if log matches current doc type, or if log is "all" and we have a cert
                                return logDocType === activeDocumentType ||
                                    logDocType === "all" ||
                                    (logDocType === "all" && activeDocumentType === "student-certificate");
                            })
                            .sort((a: PrintLog, b: PrintLog) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                            .map((log: PrintLog) => (
                                <Button
                                    justify="space-between"
                                    key={log.id}
                                    variant={activeHistoricalLogId === log.id ? "filled" : "default"}
                                    onClick={() => {
                                        setIsLoadingLogId(log.id);
                                        onSelectLog(log);
                                    }}
                                    rightSection={activeHistoricalLogId === log.id && <CheckIcon size={14} />}
                                    fullWidth
                                    h="auto"
                                    p="sm"
                                    style={{ whiteSpace: "normal", justifyContent: "flex-start", textAlign: "left" }}
                                >
                                    <Group gap={6} justify="space-between" w="100%">
                                        <Text size="xs" c={activeHistoricalLogId === log.id ? "white" : "dimmed"} ta="left" flex={1}>
                                            {formatDate(log.created_at)}
                                        </Text>
                                        {isLoadingLogId === log.id && <Loader size={14} />}
                                    </Group>
                                </Button>
                            ))}
                    </Stack>
                </ScrollArea>
            ) : isLoading ? (
                <Group justify="center" h={200}>
                    <Loader size="sm" />
                </Group>
            ) : (
                <Group justify="center" h={200}>
                    <Text size="sm" c="dimmed" ta="left">
                        No print history yet
                    </Text>
                </Group>
            )}
        </Stack>
    );

    if (!studentId) {
        return (
            <Paper h="100%" p="md" radius={0}>
                <Text size="sm" c="dimmed" ta="left">
                    Select a student to view print logs
                </Text>
            </Paper>
        );
    }

    if (isMobile) {
        return (
            <>
                <Box
                    style={{
                        position: "fixed",
                        bottom: 20,
                        left: 20,
                        zIndex: 1000,
                    }}
                >
                    <ActionIcon
                        size="lg"
                        radius="md"
                        onClick={() => setIsDrawerOpen(true)}
                    >
                        <Clock size={20} />
                    </ActionIcon>
                </Box>

                <Drawer
                    opened={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    title="Print History"
                    position="left"
                    size="100%"
                >
                    <Paper p={0} radius={0}>
                        {renderLogsList()}
                    </Paper>
                </Drawer>
            </>
        );
    }

    return (
        <Paper h="100%" p={0} radius={0}>
            {renderLogsList()}
        </Paper>
    );
}
