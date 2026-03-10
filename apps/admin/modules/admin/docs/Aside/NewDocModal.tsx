"use client";

import {
  Badge,
  Box,
  Card,
  Checkbox,
  Divider,
  Group,
  Modal,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  BankIcon,
  CertificateIcon,
  FileTextIcon,
  IdentificationCardIcon,
  PlusCircleIcon,
} from "@phosphor-icons/react";
import {
  BANK_KEY_LABELS,
  DocType,
  useDocContext,
} from "../context";

interface NewDocModalProps {
  opened: boolean;
  onClose: () => void;
}

interface DocTypeCardProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  disabled?: boolean;
  active?: boolean;
  onClick: () => void;
}

function DocTypeCard({ icon, label, description, disabled, active, onClick }: DocTypeCardProps) {
  return (
    <UnstyledButton
      onClick={disabled ? undefined : onClick}
      style={{ width: "100%", opacity: disabled ? 0.45 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
    >
      <Card
        withBorder
        p={0}
        radius="xs"
        style={(theme) => ({
          position: "relative",
          borderColor: active
            ? theme.colors.blue[5]
            : disabled
              ? theme.colors.gray[3]
              : theme.colors.gray[3],
          background: active ? theme.colors.blue[0] : "white",
          transition: "border-color 120ms, background 120ms",
          "&:hover": !disabled
            ? { borderColor: theme.colors.blue[4], background: theme.colors.blue[0] }
            : {},
        })}
      >
        {!disabled && (
          <Box style={{ position: "absolute", top: 8, right: 8, zIndex: 1, pointerEvents: "none" }}>
            <Checkbox checked={!!active} readOnly size="xs" />
          </Box>
        )}

        <Stack gap={6}>

          <Paper
            radius={0}
            h={100}
            bg="brand.2"
          >
            <Box p="md" c={active ? "blue" : disabled ? "dimmed" : "dark"}>{icon}</Box>
          </Paper>

          <Text px="md" pb="xs" size="xs" fw={900} c={active ? "blue" : disabled ? "dimmed" : "dark"}>
            {label}
          </Text>

        </Stack>
      </Card>
    </UnstyledButton>
  );
}

export function NewDocModal({ opened, onClose }: NewDocModalProps) {
  const { documents, addDocument } = useDocContext();

  const hasType = (type: DocType) => documents.some((d) => d.type === type);
  const activeBankKey = documents.find((d) => d.type === "bank-statement")?.meta?.bankKey;

  function handleAdd(type: DocType, meta?: { bankKey?: string }) {
    addDocument(type, meta);
    onClose();
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={700} size="sm">
          New Document
        </Text>
      }
      size="lg"
      centered
    >
      <Stack gap="lg" p="md">

        {/* Student Documents */}
        <Box>
          <Text size="xs" fw={700} tt="uppercase" c="dimmed" mb="xs">
            Student Documents
          </Text>
          <SimpleGrid cols={3} spacing="sm">
            <DocTypeCard
              icon={<CertificateIcon size={28} />}
              label="Student Certificate"
              description="Official course completion certificate"
              disabled={hasType("student-certificate")}
              active={false}
              onClick={() => handleAdd("student-certificate")}
            />
            <DocTypeCard
              icon={<IdentificationCardIcon size={28} />}
              label="Student CV"
              description="Student curriculum vitae"
              disabled={hasType("student-cv")}
              active={false}
              onClick={() => handleAdd("student-cv")}
            />
            <DocTypeCard
              icon={<FileTextIcon size={28} />}
              label="Woda Documents"
              description="Relationship, occupation, DoB, income, tax, fiscal, migration, surname & address verifications"
              disabled={hasType("woda-documents")}
              active={false}
              onClick={() => handleAdd("woda-documents")}
            />

          </SimpleGrid>
        </Box>




        <Divider />

        {/* Bank Statement */}
        <Box>
          <Group justify="space-between" mb="xs">
            <Text size="xs" fw={700} tt="uppercase" c="dimmed">
              Bank Statement
            </Text>
            {activeBankKey && (
              <Badge size="xs" variant="light" color="blue">
                1 active
              </Badge>
            )}

             {!activeBankKey && (
            <Text size="xs" c="dimmed" mt="xs">
              Selecting a bank replaces any previously active bank statement.
            </Text>
            )}
            
          </Group>
          <SimpleGrid cols={3} spacing="sm">
            {Object.entries(BANK_KEY_LABELS).map(([key, label]) => (
              <DocTypeCard
                key={key}
                icon={<BankIcon size={24} />}
                label={label}
                active={activeBankKey === key}
                disabled={false}
                onClick={() => handleAdd("bank-statement", { bankKey: key })}
              />
            ))}
          </SimpleGrid>
         
        </Box>

      </Stack>
    </Modal>
  );
}
