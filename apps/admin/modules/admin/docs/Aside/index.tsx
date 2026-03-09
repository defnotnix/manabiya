"use client";

import {
  AppShell,
  Box,
  Button,
  Divider,
  Group,
  Menu,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  CaretDownIcon,
  PencilIcon,
  PlusIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useDocContext, BANK_KEY_LABELS, WODA_SUB_LABELS, BANK_SUB_LABELS, STUDENT_CERT_SUB_LABELS } from "../context";

export function ModuleAdminDocAside() {
  const {
    documents,
    activeDocumentId,
    activeDocument,
    addDocument,
    removeDocument,
    setActiveDocumentId,
    setActiveWodaKey,
  } = useDocContext();

  // Derive which single-instance types are already in the list
  const hasType = (type: string) => documents.some((d) => d.type === type);
  const hasBankStatement = hasType("bank-statement");
  const activeBankKey = documents.find((d) => d.type === "bank-statement")?.meta?.bankKey;

  return (
    <>
      <AppShell.Aside>
        <Stack gap={0}>

          {/* Active Documents list */}
          <Box p="md">
            <Group justify="space-between">
              <Text size="xs" fw={900} tt="uppercase">
                Active Documents
              </Text>

              <Menu>
                <Menu.Target>
                  <Button size="xs" rightSection={<CaretDownIcon />}>
                    New
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  {/* Student documents — disabled once created */}
                  <Menu.Item
                    leftSection={<PlusIcon />}
                    disabled={hasType("student-certificate")}
                    onClick={() => addDocument("student-certificate")}
                  >
                    <Text size="xs">Student Certificate</Text>
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<PlusIcon />}
                    disabled={hasType("student-cv")}
                    onClick={() => addDocument("student-cv")}
                  >
                    <Text size="xs">Student CV</Text>
                  </Menu.Item>

                  <Menu.Divider />

                  {/* Woda — disabled once created */}
                  <Menu.Item
                    leftSection={<PlusIcon />}
                    disabled={hasType("woda-documents")}
                    onClick={() => addDocument("woda-documents")}
                  >
                    <Text size="xs">Woda Documents</Text>
                  </Menu.Item>

                  <Menu.Divider />

                  {/* Bank — replaces existing; active bank shown with checkmark */}
                  <Menu.Label>
                    Bank Statement{hasBankStatement ? " (1 active)" : ""}
                  </Menu.Label>
                  {Object.entries(BANK_KEY_LABELS).map(([key, label]) => (
                    <Menu.Item
                      key={key}
                      leftSection={activeBankKey === key ? <PlusIcon weight="fill" /> : <PlusIcon />}
                      onClick={() => addDocument("bank-statement", { bankKey: key })}
                    >
                      <Text size="xs" fw={activeBankKey === key ? 700 : 400}>{label}</Text>
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
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

                  {/* Sub-document list */}

                </Box>
              ))}
            </Stack>
          </Box>




        </Stack>
      </AppShell.Aside>
    </>
  );
}
