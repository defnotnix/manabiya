"use client";

import {
  Modal,
  Stack,
  TextInput,
  Select,
  Group,
  Button,
  NumberInput,
  Textarea,
} from "@mantine/core";
import { useEffect, useState, useRef } from "react";
import { FormHandler } from "@settle/core";
import { triggerNotification } from "@settle/admin";
import { STATEMENT_API } from "../module.api";
import { CheckIcon, XIcon } from "@phosphor-icons/react";
import { useDocContext } from "../context";

interface StatementModalProps {
  opened: boolean;
  onClose: () => void;
  statementId?: number;
  initialBank?: string;
  onCreated?: (id: number) => void;
}

const DOCUMENT_TYPE_OPTIONS = [
  { value: "bank_statement", label: "Bank Statement" },
];

const BANK_OPTIONS = [
  { value: "bigyalaxmi", label: "Bigyalaxmi Saving & Credit" },
  { value: "birendranagar", label: "Birendranagar Saving & Credit" },
  { value: "himchuli", label: "Himchuli Saving & Credit" },
  { value: "janautthan", label: "Janautthan Multipurpose Co-op" },
  { value: "karnali", label: "Karnali Agriculture Co-op" },
  { value: "mataBageshwori", label: "Mata Bageshwori Saving & Credit" },
  { value: "narayan", label: "Narayan Multipurpose Co-op" },
  { value: "shahabhagi", label: "Shahabhagi Saving & Credit" },
  { value: "sumnima", label: "Sumnima Saving & Credit" },
  { value: "tribeni", label: "Shree Tribeni Saving & Credit" },
  { value: "vyas", label: "Vyas Saving & Credit" },
];

function StatementForm({ onClose, isEdit }: { onClose: () => void; isEdit: boolean }) {
  const form = FormHandler.useForm();
  const { handleSubmit } = FormHandler.usePropContext();

  return (
    <Stack gap="md" p="md">
      <TextInput
        label="Name"
        placeholder="e.g., Savings Statement"
        required
        {...form.getInputProps("name")}
      />

      <Select
        label="Document Type"
        placeholder="Select document type"
        data={DOCUMENT_TYPE_OPTIONS}
        required
        {...form.getInputProps("document_type")}
      />

      <Select
        label="Bank"
        placeholder="Select bank"
        data={BANK_OPTIONS}
        searchable
        required
        {...form.getInputProps("bank")}
      />

      <NumberInput
        label="Student ID (Optional)"
        placeholder="Enter student ID if linked to a student"
        {...form.getInputProps("student")}
      />

      <NumberInput
        label="Custom Group ID (Optional)"
        placeholder="Enter custom group ID if linked to a custom group"
        {...form.getInputProps("custom")}
      />

      <Textarea
        label="Template (JSON)"
        placeholder='{"header": "...", "body": "..."}'
        minRows={6}
        {...form.getInputProps("template")}
      />

      <Group justify="flex-end" mt="md">
        <Button variant="light" onClick={onClose} leftSection={<XIcon size={14} />} size="xs">
          Cancel
        </Button>
        <Button onClick={handleSubmit} leftSection={<CheckIcon size={14} />} size="xs">
          {isEdit ? "Update" : "Create"} Statement
        </Button>
      </Group>
    </Stack>
  );
}

export function StatementModal({
  opened,
  onClose,
  statementId,
  initialBank,
  onCreated,
}: StatementModalProps) {
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const createdIdRef = useRef<number | null>(null);
  const { customGroupId } = useDocContext();

  useEffect(() => {
    if (opened && statementId) {
      const fetchRecord = async () => {
        setLoading(true);
        try {
          const response = await STATEMENT_API.getSingleRecord(String(statementId));
          if (response?.data) {
            setRecord(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch statement", error);
        } finally {
          setLoading(false);
        }
      };
      fetchRecord();
    } else if (opened && !statementId) {
      setRecord(null);
    }
  }, [opened, statementId]);

  const isEdit = !!record;
  const modalTitle = isEdit ? "Edit Statement" : "Add Statement";

  if (loading) {
    return (
      <Modal opened={opened} onClose={onClose} title={modalTitle} size="lg">
        <div>Loading...</div>
      </Modal>
    );
  }

  return (
    <Modal opened={opened} onClose={onClose} title={modalTitle} size="lg">
      <FormHandler
        initial={
          record || {
            name: "",
            document_type: "bank_statement",
            bank: initialBank || "",
            student: null,
            custom: customGroupId,
            template: "{}",
          }
        }
        formType={record ? "edit" : "new"}
        validation={[{}]}
        apiSubmit={async (data, id) => {
          const payload = {
            ...data,
            student: data.student || null,
            custom: data.custom || null,
            template:
              typeof data.template === "string"
                ? JSON.parse(data.template)
                : data.template,
          };
          if (record?.id) {
            return STATEMENT_API.editRecord(String(record.id), payload);
          }
          const response = await STATEMENT_API.createRecord(payload);
          createdIdRef.current = response?.data?.id ?? null;
          return response;
        }}
        onSubmitSuccess={() => {
          if (!record && onCreated && createdIdRef.current) {
            onCreated(createdIdRef.current);
          }
          onClose();
        }}
        triggerNotification={triggerNotification}
      >
        <StatementForm onClose={onClose} isEdit={isEdit} />
      </FormHandler>
    </Modal>
  );
}
