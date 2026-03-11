"use client";

import {
  Modal,
  Stack,
  TextInput,
  Select,
  Group,
  Button,
} from "@mantine/core";
import { FormHandler } from "@settle/core";
import { triggerNotification } from "@settle/admin";
import { EDUCATION_API, DEGREE_OPTIONS } from "../module.config";
import { educationFormConfig } from "../form/form.config";
import { CheckIcon, XIcon } from "@phosphor-icons/react";

interface EducationModalProps {
  opened: boolean;
  onClose: () => void;
  onSuccess?: (education: any) => void;
  studentId?: string | number; // Make studentId optional for local mode
  editRecord?: any;
  localMode?: boolean; // When true, skip API calls and just return data
}

function EducationForm({ onClose, isEdit }: { onClose: () => void; isEdit: boolean }) {
  const form = FormHandler.useForm();
  const { handleSubmit } = FormHandler.usePropContext();

  return (
    <Stack gap="md" p="md">
      <TextInput
        label="Institution"
        placeholder="Enter institution name"
        required
        {...form.getInputProps("institution")}
      />

      <Group grow>
        <Select
          label="Degree"
          placeholder="Select degree"
          data={DEGREE_OPTIONS}
          required
          {...form.getInputProps("degree")}
        />
        <TextInput
          label="Field of Study"
          placeholder="e.g., Education, Engineering"
          {...form.getInputProps("field_of_study")}
        />
      </Group>

      <Group grow>
        <TextInput
          label="Start Period"
          placeholder="e.g., 2018 or 2018-01"
          {...form.getInputProps("start_period")}
        />
        <TextInput
          label="End Period"
          placeholder="e.g., 2022 or 2022-12"
          {...form.getInputProps("end_period")}
        />
      </Group>

      <Group justify="flex-end" mt="md">
        <Button variant="light" onClick={onClose} leftSection={<XIcon size={14} />} size="xs">
          Cancel
        </Button>
        <Button onClick={handleSubmit} leftSection={<CheckIcon size={14} />} size="xs">
          {isEdit ? "Update" : "Add"} Education
        </Button>
      </Group>
    </Stack>
  );
}

export function EducationModal({
  opened,
  onClose,
  onSuccess,
  studentId,
  editRecord,
  localMode = false,
}: EducationModalProps) {
  const isEdit = !!editRecord;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEdit ? "Edit Education" : "Add Education"}
      size="md"
    >
      <FormHandler
        initial={editRecord || { ...educationFormConfig.initial, student: studentId }}
        formType={isEdit ? "edit" : "new"}
        validation={[{}]}
        apiSubmit={async (data, id) => {
          if (localMode) {
            return {
              data: {
                ...data,
                ...(isEdit && editRecord?.localId ? { localId: editRecord.localId } : { localId: Math.random().toString(36).substr(2, 9) }),
              },
            };
          }
          if (isEdit && id) {
            return EDUCATION_API.updateEducation(String(id), data);
          }
          return EDUCATION_API.createEducation({ ...data, student: studentId });
        }}
        onSubmitSuccess={(res) => {
          onSuccess?.(res.data || res);
        }}
        triggerNotification={triggerNotification}
      >
        <EducationForm onClose={onClose} isEdit={isEdit} />
      </FormHandler>
    </Modal>
  );
}
