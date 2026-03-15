"use client";

import { Button, Container, Group, Menu, Paper, SimpleGrid, Text } from "@mantine/core";
import { CaretDownIcon, PrinterIcon } from "@phosphor-icons/react";
import { DocType } from "@/context/DocumentContext";

interface DocHeaderProps {
    activeDocumentLabel?: string;
    documentsCount: number;
    onPrintAll: () => void;
    onPrintCurrent: () => void;
}

export function DocHeader({
    activeDocumentLabel,
    documentsCount,
    onPrintAll,
    onPrintCurrent,
}: DocHeaderProps) {
    return (
        <Paper radius={0}>
            <Container size="xl">
                <SimpleGrid cols={2} h={40}>
                    <Group gap={4}>
                        <Text size="sm" fw={800}>
                            {activeDocumentLabel
                                ? `Document Editor — ${activeDocumentLabel}`
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

                        <Menu withArrow position="bottom-end">
                            <Menu.Target>
                                <Button size="xs" px={8} disabled={documentsCount <= 0}>
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
    );
}
