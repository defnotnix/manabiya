"use client";

import { useState } from "react";
import {
  AppShell,
  Box,
  Button,
  Group,
  Stack,
  Text,
  UnstyledButton,
  Tooltip,
  ActionIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PlusIcon, XIcon, PencilSimpleIcon } from "@phosphor-icons/react";
import { useDocContext, WODA_SUB_LABELS, BANK_SUB_LABELS, STUDENT_CERT_SUB_LABELS } from "../context";
import { NewDocModal } from "./NewDocModal";
import { StudentCertificateModal } from "../modals/StudentCertificateModal";
import { StatementModal } from "../modals/StatementModal";
import { WodaDocModal } from "../modals/WodaDocModal";

export function ModuleAdminDocAside() {
  const {
    documents,
    activeDocumentId,
    removeDocument,
    setActiveDocumentId,
    setActiveWodaKey,
    addDocument,
  } = useDocContext();

  const [newDocModalOpened, { open: openNewDocModal, close: closeNewDocModal }] = useDisclosure(false);
  const [studentCertEditOpened, { open: openStudentCertEdit, close: closeStudentCertEdit }] = useDisclosure(false);
  const [statementEditOpened, { open: openStatementEdit, close: closeStatementEdit }] = useDisclosure(false);
  const [statementEditId, setStatementEditId] = useState<number | null>(null);
  const [wodaDocEditOpened, { open: openWodaDocEdit, close: closeWodaDocEdit }] = useDisclosure(false);
  const [wodaDocEditId, setWodaDocEditId] = useState<number | null>(null);
  const [createStatementOpened, { open: openCreateStatement, close: closeCreateStatement }] = useDisclosure(false);
  const [pendingBankKey, setPendingBankKey] = useState<string | null>(null);
  const [createWodaDocOpened, { open: openCreateWodaDoc, close: closeCreateWodaDoc }] = useDisclosure(false);
  const [createStudentCertOpened, { open: openCreateStudentCert, close: closeCreateStudentCert }] = useDisclosure(false);

  const handleEditClick = (doc: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (doc.type === "student-certificate") {
      openStudentCertEdit();
    } else if (doc.type === "bank-statement" && doc.meta?.statementId) {
      setStatementEditId(doc.meta.statementId);
      openStatementEdit();
    } else if (doc.type === "woda-documents" && doc.meta?.wodaDocId) {
      setWodaDocEditId(doc.meta.wodaDocId);
      openWodaDocEdit();
    }
  };

  const handleRequestCreate = (type: any, meta?: { bankKey?: string }) => {
    if (type === "bank-statement") {
      setPendingBankKey(meta?.bankKey ?? null);
      openCreateStatement();
    } else if (type === "woda-documents") {
      openCreateWodaDoc();
    } else if (type === "student-certificate") {
      openCreateStudentCert();
    }
  };

  return (
    <>
      <NewDocModal opened={newDocModalOpened} onClose={closeNewDocModal} onRequestCreate={handleRequestCreate} />
      <StudentCertificateModal opened={studentCertEditOpened} onClose={closeStudentCertEdit} />
      {statementEditId !== null && (
        <StatementModal opened={statementEditOpened} onClose={closeStatementEdit} statementId={statementEditId} />
      )}
      {wodaDocEditId !== null && (
        <WodaDocModal opened={wodaDocEditOpened} onClose={closeWodaDocEdit} wodaDocId={wodaDocEditId} />
      )}
      <StatementModal
        opened={createStatementOpened}
        onClose={closeCreateStatement}
        initialBank={pendingBankKey ?? undefined}
        onCreated={(id) => {
          addDocument("bank-statement", { bankKey: pendingBankKey!, statementId: id });
          closeCreateStatement();
        }}
      />
      <WodaDocModal
        opened={createWodaDocOpened}
        onClose={closeCreateWodaDoc}
        onCreated={(id) => {
          addDocument("woda-documents", { wodaDocId: id });
          closeCreateWodaDoc();
        }}
      />
      <StudentCertificateModal
        opened={createStudentCertOpened}
        onClose={closeCreateStudentCert}
        onCreated={() => {
          addDocument("student-certificate");
          closeCreateStudentCert();
        }}
      />

      <AppShell.Aside>
        <Stack gap={0}>

          {/* Active Documents list */}
          <Box p="md">
            <Group justify="space-between">
              <Text size="xs" fw={900} tt="uppercase">
                Active Documents
              </Text>

              <Button size="xs" leftSection={<PlusIcon />} onClick={openNewDocModal}>
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
                      <Group gap={2}>
                        <Tooltip
                          label={
                            doc.type === "student-certificate"
                              ? "Edit certificate data"
                              : doc.type === "bank-statement" && !doc.meta?.statementId
                                ? "No backend record linked"
                                : doc.type === "woda-documents" && !doc.meta?.wodaDocId
                                  ? "No backend record linked"
                                  : "Edit document"
                          }
                          disabled={
                            doc.type === "student-certificate" ||
                            (doc.type === "bank-statement" && !!doc.meta?.statementId) ||
                            (doc.type === "woda-documents" && !!doc.meta?.wodaDocId)
                          }
                        >
                          <ActionIcon
                            size="compact-xs"
                            variant="subtle"
                            color={
                              (doc.type === "bank-statement" && !doc.meta?.statementId) ||
                              (doc.type === "woda-documents" && !doc.meta?.wodaDocId)
                                ? "gray"
                                : "blue"
                            }
                            disabled={
                              (doc.type === "bank-statement" && !doc.meta?.statementId) ||
                              (doc.type === "woda-documents" && !doc.meta?.wodaDocId)
                            }
                            onClick={(e) => handleEditClick(doc, e)}
                          >
                            <PencilSimpleIcon size={10} />
                          </ActionIcon>
                        </Tooltip>
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
