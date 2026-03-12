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
import { WODA_DOC_API } from "../module.api";
import { CheckIcon, XIcon } from "@phosphor-icons/react";
import { useDocContext } from "../context";

interface WodaDocModalProps {
  opened: boolean;
  onClose: () => void;
  wodaDocId?: number;
  onCreated?: (id: number) => void;
}

const DOCUMENT_TYPE_OPTIONS = [
  { value: "relationship_verification", label: "Relationship Verification" },
  { value: "occupation_verification", label: "Occupation Verification" },
  { value: "dob_verification", label: "Date of Birth Verification" },
  { value: "annual_income_verification", label: "Annual Income Verification" },
  { value: "tax_clearance", label: "Tax Clearance Certificate" },
  { value: "fiscal_year_details", label: "Fiscal Year Details" },
  { value: "migration", label: "Migration Certificate" },
  { value: "surname", label: "Surname Change Certificate" },
  { value: "address", label: "Address Change Certificate" },
];

function WodaDocForm({ onClose, isEdit }: { onClose: () => void; isEdit: boolean }) {
  const form = FormHandler.useForm();
  const { handleSubmit } = FormHandler.usePropContext();

  return (
    <Stack gap="md" p="md">
      <TextInput
        label="Name"
        placeholder="e.g., Residence Doc"
        required
        {...form.getInputProps("name")}
      />

      <Select
        label="Document Type"
        placeholder="Select document type"
        data={DOCUMENT_TYPE_OPTIONS}
        searchable
        required
        {...form.getInputProps("document_type")}
      />

      <TextInput
        label="Municipality"
        placeholder="e.g., Tokyo"
        {...form.getInputProps("municipality")}
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
        placeholder='{"section_1": "..."}'
        minRows={6}
        {...form.getInputProps("template")}
      />

      <Group justify="flex-end" mt="md">
        <Button variant="light" onClick={onClose} leftSection={<XIcon size={14} />} size="xs">
          Cancel
        </Button>
        <Button onClick={handleSubmit} leftSection={<CheckIcon size={14} />} size="xs">
          {isEdit ? "Update" : "Create"} Woda Doc
        </Button>
      </Group>
    </Stack>
  );
}

export function WodaDocModal({
  opened,
  onClose,
  wodaDocId,
  onCreated,
}: WodaDocModalProps) {
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const createdIdRef = useRef<number | null>(null);
  const { customGroupId } = useDocContext();

  useEffect(() => {
    if (opened && wodaDocId) {
      const fetchRecord = async () => {
        setLoading(true);
        try {
          const response = await WODA_DOC_API.getSingleRecord(String(wodaDocId));
          if (response?.data) {
            setRecord(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch woda doc", error);
        } finally {
          setLoading(false);
        }
      };
      fetchRecord();
    } else if (opened && !wodaDocId) {
      setRecord(null);
    }
  }, [opened, wodaDocId]);

  const isEdit = !!record;
  const modalTitle = isEdit ? "Edit Woda Document" : "Add Woda Document";

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
            document_type: "",
            municipality: "",
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
            return WODA_DOC_API.editRecord(String(record.id), payload);
          }
          const response = await WODA_DOC_API.createRecord(payload);
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
        <WodaDocForm onClose={onClose} isEdit={isEdit} />
      </FormHandler>
    </Modal>
  );
}
