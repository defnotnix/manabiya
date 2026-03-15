"use client";

import { Center, Container, Loader, Paper, Stack, Text, UnstyledButton } from "@mantine/core";
import { PlusIcon } from "@phosphor-icons/react";

interface EmptyStateProps {
    isLoading: boolean;
    onCreateWoda: () => void;
    onCreateStatement: () => void;
    onCreateCertificate?: () => void;
    onCreateCV?: () => void;
    isStudentContext?: boolean;
}

export function EmptyState({ isLoading, onCreateWoda, onCreateStatement, onCreateCertificate, onCreateCV, isStudentContext = false }: EmptyStateProps) {
    if (isLoading) {
        return (
            <Center py="xl" style={{ flex: 1, minHeight: "400px" }}>
                <Stack gap="lg" align="center">
                    <Loader />
                    <Text size="sm" c="dimmed">
                        Loading documents...
                    </Text>
                </Stack>
            </Center>
        );
    }

    return (
        <Container size="sm">
            <Center h="70vh" py="xl" style={{ flex: 1, minHeight: "400px" }}>
                <Stack gap="lg" align="center">
                    <Text size="2rem" fw={600} ta="center">
                        You are creating<br /> a new Custom Document
                    </Text>
                    <Text size="xs" c="dimmed">
                        Select what document you will be creating. You can add either again later.
                    </Text>
                    <Stack gap="xs" style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                        {isStudentContext && onCreateCertificate && (
                            <UnstyledButton size="lg" variant="light" onClick={onCreateCertificate}>
                                <Paper p="xl" bg="brand.6">
                                    <Stack>
                                        <Center>
                                            <PlusIcon size={24} color="white" />
                                        </Center>
                                        <Text size="xs" c="white">
                                            Student Certificate
                                        </Text>
                                    </Stack>
                                </Paper>
                            </UnstyledButton>
                        )}
                        {isStudentContext && onCreateCV && (
                            <UnstyledButton size="lg" variant="light" onClick={onCreateCV}>
                                <Paper p="xl" bg="brand.6">
                                    <Stack>
                                        <Center>
                                            <PlusIcon size={24} color="white" />
                                        </Center>
                                        <Text size="xs" c="white">
                                            Student CV
                                        </Text>
                                    </Stack>
                                </Paper>
                            </UnstyledButton>
                        )}
                        <UnstyledButton size="lg" variant="light" onClick={onCreateWoda}>
                            <Paper p="xl" bg="brand.6">
                                <Stack>
                                    <Center>
                                        <PlusIcon size={24} color="white" />
                                    </Center>
                                    <Text size="xs" c="white">
                                        Woda Documents
                                    </Text>
                                </Stack>
                            </Paper>
                        </UnstyledButton>
                        <UnstyledButton size="lg" variant="light" onClick={onCreateStatement}>
                            <Paper p="xl" bg="brand.6">
                                <Stack>
                                    <Center>
                                        <PlusIcon size={24} color="white" />
                                    </Center>
                                    <Text size="xs" c="white">
                                        Bank Statement
                                    </Text>
                                </Stack>
                            </Paper>
                        </UnstyledButton>
                    </Stack>

                    <Text size="xs" c="dimmed">
                        If you are trying to create a document for a student, do it through the Student
                        Portal
                    </Text>
                </Stack>
            </Center>
        </Container>
    );
}
