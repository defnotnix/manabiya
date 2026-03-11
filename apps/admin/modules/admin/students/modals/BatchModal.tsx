"use client";

import {
  Modal,
  Stack,
  TextInput,
  Select,
  Group,
  Button,
  NumberInput,
  Switch,
} from "@mantine/core";
import { FormHandler } from "@settle/core";
import { triggerNotification } from "@settle/admin";
import { BATCH_API, SHIFT_OPTIONS } from "../module.config";
import { batchFormConfig } from "../form/form.config";
import { CheckIcon, XIcon } from "@phosphor-icons/react";

interface BatchModalProps {
  opened: boolean;
  onClose: () => void;
  onSuccess?: (batch: any) => void;
  editRecord?: any;
}

function BatchForm({ onClose, isEdit }: { onClose: () => void; isEdit: boolean }) {
  const form = FormHandler.useForm();
  const { handleSubmit } = FormHandler.usePropContext();

  return (
    <Stack gap="md" p="md">
      <TextInput
        label="Batch Name"
        placeholder="e.g., N5-2026-A"
        required
        {...form.getInputProps("name")}
      />

      <Group grow>
        <Select
          label="Shift"
          placeholder="Select shift"
          data={SHIFT_OPTIONS}
          {...form.getInputProps("shift")}
        />
        <TextInput
          label="Course"
          placeholder="e.g., Japanese N5"
          {...form.getInputProps("course")}
        />
      </Group>

      <TextInput
        label="Books"
        placeholder="e.g., Minna no Nihongo"
        {...form.getInputProps("books")}
      />

      <TextInput
        label="Instructor"
        placeholder="e.g., Sato Sensei"
        {...form.getInputProps("instructor")}
      />

      <Group grow>
        <NumberInput
          label="Total Days"
          placeholder="e.g., 120"
          min={1}
          {...form.getInputProps("total_days")}
        />
        <TextInput
          label="Per Class Hours"
          placeholder="e.g., 1.50"
          {...form.getInputProps("per_class_hours")}
        />
      </Group>

      <Switch
        label="Active"
        {...form.getInputProps("is_active", { type: "checkbox" })}
      />

      <Group justify="flex-end" mt="md">
        <Button variant="light" onClick={onClose} leftSection={<XIcon size={14} />} size="xs">
          Cancel
        </Button>
        <Button onClick={handleSubmit} leftSection={<CheckIcon size={14} />} size="xs">
          {isEdit ? "Update" : "Create"} Batch
        </Button>
      </Group>
    </Stack>
  );
}

export function BatchModal({
  opened,
  onClose,
  onSuccess,
  editRecord,
}: BatchModalProps) {
  const isEdit = !!editRecord;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEdit ? "Edit Batch" : "New Batch"}
      size="md"
    >
      <FormHandler
        initial={editRecord || batchFormConfig.initial}
        formType={isEdit ? "edit" : "new"}
        validation={[{}]}
        apiSubmit={async (data, id) => {
          if (isEdit && id) {
            return BATCH_API.updateBatch(String(id), data);
          }
          return BATCH_API.createBatch(data);
        }}
        onSubmitSuccess={(res) => {
          // Extract the actual batch data from the response
          const batchData = res?.data || res;
          onSuccess?.(batchData);
        }}
        triggerNotification={triggerNotification.form}
      >
        <BatchForm onClose={onClose} isEdit={isEdit} />
      </FormHandler>
    </Modal>
  );
}
