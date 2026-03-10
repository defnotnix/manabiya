"use client";

import {
  AppShell,
  Box,
  Button,
  Group,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PlusIcon, XIcon } from "@phosphor-icons/react";
import { useDocContext, WODA_SUB_LABELS, BANK_SUB_LABELS, STUDENT_CERT_SUB_LABELS } from "../context";
import { NewDocModal } from "./NewDocModal";

export function ModuleAdminDocAside() {
  const {
    documents,
    activeDocumentId,
    removeDocument,
    setActiveDocumentId,
    setActiveWodaKey,
  } = useDocContext();

  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

  return (
    <>
      <NewDocModal opened={modalOpened} onClose={closeModal} />

      <AppShell.Aside>
        <Stack gap={0}>

          {/* Active Documents list */}
          <Box p="md">
            <Group justify="space-between">
              <Text size="xs" fw={900} tt="uppercase">
                Active Documents
              </Text>

              <Button size="xs" leftSection={<PlusIcon />} onClick={openModal}>
                New
              </Button>
            </Group>

            <Stack mt="xs" gap={4}>
              {documents.length === 0 && (
                <Text size="xs" c="dimmed">
                  No documents yet. Click New to add one.
                </Text>
              )}
              {documents.map((doc) => (
                <Box key={doc.id}>
                  <UnstyledButton
                    component="div"
                    onClick={() => {
                      setActiveDocumentId(doc.id);
                      if (doc.type === "woda-documents") setActiveWodaKey(null);
                    }}
                    style={(theme) => ({
                      width: "100%",
                      borderRadius: theme.radius.sm,
                      padding: "4px 8px",
                      background:
                        doc.id === activeDocumentId
                          ? theme.colors.blue[0]
                          : "transparent",
                      border: `1px solid ${doc.id === activeDocumentId ? theme.colors.blue[3] : "transparent"}`,
                    })}
                  >
                    <Group justify="space-between">
                      <Text
                        size="xs"
                        fw={doc.id === activeDocumentId ? 700 : 400}
                        c={doc.id === activeDocumentId ? "blue" : "inherit"}
                      >
                        {doc.label}
                      </Text>
                      <Button
                        size="compact-xs"
                        variant="subtle"
                        color="red"
                        px={4}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDocument(doc.id);
                        }}
                      >
                        <XIcon size={10} />
                      </Button>
                    </Group>

                    {doc.type === "woda-documents" && (
                      <Text size="xs" c="dimmed" px={8} pt={2}>
                        {Object.values(WODA_SUB_LABELS).join(", ")}
                      </Text>
                    )}
                    {doc.type === "bank-statement" && (
                      <Text size="xs" c="dimmed" px={8} pt={2}>
                        {Object.values(BANK_SUB_LABELS).join(", ")}
                      </Text>
                    )}
                    {doc.type === "student-certificate" && (
                      <Text size="xs" c="dimmed" px={8} pt={2}>
                        {Object.values(STUDENT_CERT_SUB_LABELS).join(", ")}
                      </Text>
                    )}

                  </UnstyledButton>
                </Box>
              ))}
            </Stack>
          </Box>

        </Stack>
      </AppShell.Aside>
    </>
  );
}
