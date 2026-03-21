"use client";

import {
    Box,
    Group,
    Stack,
    Text,
    ActionIcon,
    Paper,
    Button,
} from "@mantine/core";
import { PlusIcon, PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";

interface FormListRenderProps {
    items: any[];
    title: string;
    onAdd: () => void;
    onEdit: (item: any, index: number) => void;
    onRemove: (index: number) => void;
    renderItem: (item: any) => React.ReactNode;
    disabled?: boolean;
}

export function FormListRender({
    items,
    title,
    onAdd,
    onEdit,
    onRemove,
    renderItem,
    disabled = false,
}: FormListRenderProps) {
    return (
        <Stack gap="sm">
            <Group justify="space-between" align="center">
                <Text size="sm" fw={600}>
                    {title}
                </Text>
                <Button
                    variant="light"
                    size="xs"
                    leftSection={<PlusIcon size={14} />}
                    onClick={onAdd}
                    disabled={disabled}
                >
                    Add
                </Button>
            </Group>

            {items.length === 0 ? (
                <Paper withBorder p="md" style={{ borderStyle: "dashed" }}>
                    <Text size="sm" c="dimmed" ta="center">
                        No {title.toLowerCase()} added yet.
                    </Text>
                </Paper>
            ) : (
                <Stack gap="xs">
                    {items.map((item, index) => (
                        <Paper key={index} withBorder p="sm" radius="md">
                            <Group wrap="nowrap" align="flex-start">
                                <Box style={{ flex: 1 }}>{renderItem(item)}</Box>
                                <Group gap="xs" wrap="nowrap">
                                    <ActionIcon
                                        variant="subtle"
                                        color="blue"
                                        onClick={() => onEdit(item, index)}
                                        disabled={disabled}
                                    >
                                        <PencilSimpleIcon size={16} />
                                    </ActionIcon>
                                    <ActionIcon
                                        variant="subtle"
                                        color="red"
                                        onClick={() => onRemove(index)}
                                        disabled={disabled}
                                    >
                                        <TrashIcon size={16} />
                                    </ActionIcon>
                                </Group>
                            </Group>
                        </Paper>
                    ))}
                </Stack>
            )}
        </Stack>
    );
}
