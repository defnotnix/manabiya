"use client";

import { ComponentType } from "react";
import { ActionIcon, Box, Button, Center, Container, Group, Menu, Stack, Text } from "@mantine/core";
import { ArrowLeftIcon, CaretDownIcon, PrinterIcon } from "@phosphor-icons/react";
import { ContextEditor } from "@/components/layout/editor/editor.context";
import { FormHandler } from "@/components/framework/FormHandler";
import { useDocContext } from "./context";
import { TemplateStudentCertificate } from "./templates/student-certificate";
import { WodaTemplates } from "./templates/woda";
import { BankTemplates } from "./templates/bank";
import { PRINT_LOG_API } from "@/modules/admin/students/module.config";

/** Wraps old templates in the stub providers they expect */
function TemplateShell({ children }: { children: React.ReactNode }) {
  return (
    <ContextEditor.Provider>
      <FormHandler.Provider>
        {children}
      </FormHandler.Provider>
    </ContextEditor.Provider>
  );
}

function WodaDocumentView() {
  const { activeWodaKey } = useDocContext();

  const entries = Object.entries(WodaTemplates) as [string, ComponentType][];
  const visible = activeWodaKey
    ? entries.filter(([key]) => key === activeWodaKey)
    : entries;

  return (
    <Stack gap={0}>
      {visible.map(([key, Template]) => (
        <TemplateShell key={key}>
          <Template />
        </TemplateShell>
      ))}
    </Stack>
  );
}

function BankStatementView({ bankKey }: { bankKey: string }) {
  const bank = BankTemplates[bankKey as keyof typeof BankTemplates];
  if (!bank) return null;
  const Certificate = bank.certificate as ComponentType;
  const Statement = bank.statement as ComponentType;
  return (
    <Stack gap={0}>
      <TemplateShell><Certificate /></TemplateShell>
      <TemplateShell><Statement /></TemplateShell>
    </Stack>
  );
}

function DocTemplate() {
  const { activeDocument } = useDocContext();

  if (!activeDocument) {
    return (
      <Center py="xl">
        <Text size="sm" c="dimmed">
          Select or create a document from the panel on the right.
        </Text>
      </Center>
    );
  }

  if (activeDocument.type === "student-certificate") {
    return <Stack gap={0}>
      <TemplateShell>
        <TemplateStudentCertificate />
      </TemplateShell>
    </Stack>;
  }

  if (activeDocument.type === "woda-documents") {
    return <WodaDocumentView />;
  }

  if (activeDocument.type === "bank-statement" && activeDocument.meta?.bankKey) {
    return <BankStatementView bankKey={activeDocument.meta.bankKey} />;
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
  const { activeDocument, studentId } = useDocContext();

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

  return (
    <div
      style={{
        background: "var(--mantine-color-gray-2)",
        minHeight: "100vh",
        overflow: "hidden"
      }}
    >
      <Container size="8.3in" px={{ base: "xs", lg: 0 }}>
        <Group justify="space-between" py="sm">
          <Group>
            <ActionIcon size="sm">
              <ArrowLeftIcon />
            </ActionIcon>
            <Text size="xs" fw={800}>
              {activeDocument
                ? `Document Editor — ${activeDocument.label}`
                : "Document Editor"}
            </Text>
          </Group>

          <Group gap={1}>
            <Button size="xs" leftSection={<PrinterIcon weight="fill" />} onClick={handlePrintAll}>
              Print All
            </Button>

            <Menu withArrow position="bottom-end">
              <Menu.Target>
                <Button size="xs" px={8} variant="light">
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
        </Group>
      </Container>

      <Center>
        <DocTemplate />
      </Center>
    </div>
  );
}
