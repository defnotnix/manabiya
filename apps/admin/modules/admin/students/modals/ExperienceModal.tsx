"use client";

import {
  Modal,
  Stack,
  TextInput,
  Textarea,
  Group,
  Button,
} from "@mantine/core";
import { FormHandler } from "@settle/core";
import { triggerNotification } from "@settle/admin";
import { EXPERIENCE_API } from "../module.config";
import { experienceFormConfig } from "../form/form.config";
import { CheckIcon, XIcon } from "@phosphor-icons/react";

interface ExperienceModalProps {
  opened: boolean;
  onClose: () => void;
  onSuccess?: (experience: any) => void;
  studentId: string | number;
  editRecord?: any;
}

function ExperienceForm({ onClose, isEdit }: { onClose: () => void; isEdit: boolean }) {
  const form = FormHandler.useForm();
  const { handleSubmit } = FormHandler.usePropContext();

  return (
    <Stack gap="md" p="md">
      <TextInput
        label="Company"
        placeholder="Enter company name"
        required
        {...form.getInputProps("company")}
      />

      <TextInput
        label="Role"
        placeholder="Enter role/position"
        required
        {...form.getInputProps("role")}
      />

      <Group grow>
        <TextInput
          label="Start Period"
          placeholder="e.g., 2024-01 or 2024"
          {...form.getInputProps("start_period")}
        />
        <TextInput
          label="End Period"
          placeholder="e.g., 2024-12 or 2024"
          {...form.getInputProps("end_period")}
        />
      </Group>

      <Textarea
        label="Notes"
        placeholder="Additional notes"
        rows={3}
        {...form.getInputProps("notes")}
      />

      <Group justify="flex-end" mt="md">
        <Button variant="light" onClick={onClose} leftSection={<XIcon size={14} />} size="xs">
          Cancel
        </Button>
        <Button onClick={handleSubmit} leftSection={<CheckIcon size={14} />} size="xs">
          {isEdit ? "Update" : "Add"} Experience
        </Button>
      </Group>
    </Stack>
  );
}

export function ExperienceModal({
  opened,
  onClose,
  onSuccess,
  studentId,
  editRecord,
}: ExperienceModalProps) {
  const isEdit = !!editRecord;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEdit ? "Edit Experience" : "Add Experience"}
      size="md"
    >
      <FormHandler
        initial={editRecord || { ...experienceFormConfig.initial, student: studentId }}
        formType={isEdit ? "edit" : "new"}
        validation={[{}]}
        apiSubmit={async (data, id) => {
          if (isEdit && id) {
            return EXPERIENCE_API.updateExperience(String(id), data);
          }
          return EXPERIENCE_API.createExperience({ ...data, student: studentId });
        }}
        onSubmitSuccess={(res) => {
          onSuccess?.(res.data || res);
        }}
        triggerNotification={triggerNotification.form}
      >
        <ExperienceForm onClose={onClose} isEdit={isEdit} />
      </FormHandler>
    </Modal>
  );
}
