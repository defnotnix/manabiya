"use client";

import { useEffect, useState } from "react";
import { Modal, Stack, TextInput, Textarea, Switch, Button, Group, Card, SimpleGrid, Box, Text, Paper, UnstyledButton, Checkbox, Divider, Badge } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CUSTOM_API } from "../module.config";
import { BankIcon, CertificateIcon, FileTextIcon, IdentificationCardIcon } from "@phosphor-icons/react";

interface NewCustomModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: any;
}

const BANK_KEY_LABELS: Record<string, string> = {
  bigyalaxmi: "Bigyalaxmi Saving & Credit",
  birendranagar: "Birendranagar Saving & Credit",
  himchuli: "Himchuli Saving & Credit",
  janautthan: "Janautthan Multipurpose Co-op",
  karnali: "Karnali Agriculture Co-op",
  mataBageshwori: "Mata Bageshwori Saving & Credit",
  narayan: "Narayan Multipurpose Co-op",
  shahabhagi: "Shahabhagi Saving & Credit",
  sumnima: "Sumnima Saving & Credit",
  tribeni: "Shree Tribeni Saving & Credit",
  vyas: "Vyas Saving & Credit",
};

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
          borderColor: active ? theme.colors.blue[5] : disabled ? theme.colors.gray[3] : theme.colors.gray[3],
          background: active ? theme.colors.blue[0] : "white",
          transition: "border-color 120ms, background 120ms",
          "&:hover": !disabled ? { borderColor: theme.colors.blue[4], background: theme.colors.blue[0] } : {},
        })}
      >
        {!disabled && (
          <Box style={{ position: "absolute", top: 8, right: 8, zIndex: 1, pointerEvents: "none" }}>
            <Checkbox checked={!!active} readOnly size="xs" />
          </Box>
        )}
        <Stack gap={6}>
          <Paper radius={0} h={100} bg="brand.2">
            <Box p="md" c={active ? "blue" : disabled ? "dimmed" : "dark"}>
              {icon}
            </Box>
          </Paper>
          <Text h={49} px="md" pb="xs" size="xs" fw={900} c={active ? "blue" : disabled ? "dimmed" : "dark"}>
            {label}
          </Text>
        </Stack>
      </Card>
    </UnstyledButton>
  );
}

export function NewCustomModal({ open, onClose, initialData }: NewCustomModalProps) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<"info" | "documents">("info");
  const [createdCustomId, setCreatedCustomId] = useState<number | null>(null);
  const [selectedDocTypes, setSelectedDocTypes] = useState<string[]>([]);

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      is_active: true,
    },
    validate: {
      name: (value) => (!value || value.trim() === "" ? "Name is required" : null),
    },
  });

  useEffect(() => {
    if (initialData) {
      form.setValues({
        name: initialData.name || "",
        description: initialData.description || "",
        is_active: initialData.is_active ?? true,
      });
      setStep("info");
    } else {
      form.reset();
      setStep("info");
      setCreatedCustomId(null);
      setSelectedDocTypes([]);
    }
  }, [initialData, open]);

  const createMutation = useMutation({
    mutationFn: async (values: any) => {
      const result = await CUSTOM_API.createRecord(values);
      return result;
    },
    onSuccess: (result: any) => {
      queryClient.invalidateQueries({ queryKey: ["customs.list"] });
      if (result?.data?.id) {
        setCreatedCustomId(result.data.id);
        setStep("documents");
      }
    },
  });

  const editMutation = useMutation({
    mutationFn: async (values: any) => {
      await CUSTOM_API.editRecord(String(initialData.id), values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customs.list"] });
      form.reset();
      onClose();
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    if (initialData) {
      editMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  });

  const toggleDocType = (docType: string) => {
    setSelectedDocTypes((prev) =>
      prev.includes(docType) ? prev.filter((d) => d !== docType) : [...prev, docType]
    );
  };

  const handleFinish = () => {
    if (createdCustomId && selectedDocTypes.length > 0) {
      // Navigate to docs with custom group and selected doc types
      const params = new URLSearchParams({ custom: String(createdCustomId) });
      window.location.href = `/admin/docs?${params.toString()}`;
    } else {
      onClose();
    }
  };

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title={step === "info" ? (initialData ? "Edit Custom Group" : "New Custom Group") : "Select Documents to Add"}
      size="lg"
    >
      {step === "info" ? (
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Name"
              placeholder="e.g., Embassy Batch A"
              required
              {...form.getInputProps("name")}
            />

            <Textarea
              label="Description"
              placeholder="Enter group description"
              rows={3}
              {...form.getInputProps("description")}
            />

            <Switch
              label="Active"
              description="Enable this custom group"
              {...form.getInputProps("is_active", { type: "checkbox" })}
            />

            <Group justify="flex-end" gap="sm" mt="md">
              <Button variant="light" onClick={onClose}>
                Cancel
              </Button>
              {!initialData && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSubmit()}
                  disabled={createMutation.isPending}
                >
                  Create & Add Documents
                </Button>
              )}
              <Button type="submit" disabled={createMutation.isPending || editMutation.isPending}>
                {initialData ? "Update" : "Create"}
              </Button>
            </Group>
          </Stack>
        </form>
      ) : (
        <Stack gap="lg">
          <Box>
            <Text size="xs" fw={700} tt="uppercase" c="dimmed" mb="xs">
              General Documents
            </Text>
            <SimpleGrid cols={3} spacing="sm">
              <DocTypeCard
                icon={<CertificateIcon size={28} />}
                label="Student Certificate"
                active={selectedDocTypes.includes("student-certificate")}
                onClick={() => toggleDocType("student-certificate")}
              />
              <DocTypeCard
                icon={<IdentificationCardIcon size={28} />}
                label="Student CV"
                active={selectedDocTypes.includes("student-cv")}
                onClick={() => toggleDocType("student-cv")}
              />
              <DocTypeCard
                icon={<FileTextIcon size={28} />}
                label="Woda Documents"
                active={selectedDocTypes.includes("woda-documents")}
                onClick={() => toggleDocType("woda-documents")}
              />
            </SimpleGrid>
          </Box>

          <Divider />

          <Box>
            <Text size="xs" fw={700} tt="uppercase" c="dimmed" mb="xs">
              Bank Statements
            </Text>
            <SimpleGrid cols={3} spacing="sm">
              {Object.entries(BANK_KEY_LABELS).map(([key, label]) => (
                <DocTypeCard
                  key={key}
                  icon={<BankIcon size={24} />}
                  label={label}
                  active={selectedDocTypes.includes(`bank-${key}`)}
                  onClick={() => toggleDocType(`bank-${key}`)}
                />
              ))}
            </SimpleGrid>
          </Box>

          <Group justify="flex-end" gap="sm" mt="md">
            <Button variant="light" onClick={() => setStep("info")}>
              Back
            </Button>
            <Button onClick={handleFinish}>
              {selectedDocTypes.length > 0 ? "Continue to Documents" : "Skip & Close"}
            </Button>
          </Group>
        </Stack>
      )}
    </Modal>
  );
}
