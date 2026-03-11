"use client";

import {
  Modal,
  Stack,
  Select,
  Group,
  Button,
  NumberInput,
  TextInput,
} from "@mantine/core";
import { FormHandler } from "@settle/core";
import { triggerNotification } from "@settle/admin";
import { MARKING_API, MONTH_OPTIONS } from "../module.config";
import { markingFormConfig } from "../form/form.config";
import { CheckIcon, XIcon } from "@phosphor-icons/react";

interface MarkingModalProps {
  opened: boolean;
  onClose: () => void;
  onSuccess?: (marking: any) => void;
  studentId: string | number;
  editRecord?: any;
}

function MarkingForm({ onClose, isEdit }: { onClose: () => void; isEdit: boolean }) {
  const form = FormHandler.useForm();
  const { handleSubmit } = FormHandler.usePropContext();

  // Generate year options (current year and past 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i),
  }));

  // Convert month options for Select
  const monthSelectOptions = MONTH_OPTIONS.map((m) => ({
    value: String(m.value),
    label: m.label,
  }));

  return (
    <Stack gap="md" p="md">
      <Group grow>
        <Select
          label="Year"
          placeholder="Select year"
          data={yearOptions}
          required
          value={String(form.values.year)}
          onChange={(value) => form.setFieldValue("year", value ? parseInt(value) : null)}
          error={form.errors.year}
        />
        <Select
          label="Month"
          placeholder="Select month"
          data={monthSelectOptions}
          required
          value={String(form.values.month)}
          onChange={(value) => form.setFieldValue("month", value ? parseInt(value) : null)}
          error={form.errors.month}
        />
      </Group>

      <Group grow>
        <NumberInput
          label="Total Days"
          placeholder="Total days in month"
          min={1}
          max={31}
          {...form.getInputProps("total_days")}
        />
        <TextInput
          label="Class Hours"
          placeholder="e.g., 39.00"
          {...form.getInputProps("class_hours")}
        />
      </Group>

      <Group grow>
        <NumberInput
          label="Present"
          placeholder="Days present"
          min={0}
          {...form.getInputProps("present")}
        />
        <NumberInput
          label="Absent"
          placeholder="Days absent"
          min={0}
          {...form.getInputProps("absent")}
        />
      </Group>

      <TextInput
        label="Attendance Percentage"
        placeholder="e.g., 92.30"
        {...form.getInputProps("attendance_percent")}
      />

      <Group justify="flex-end" mt="md">
        <Button variant="light" onClick={onClose} leftSection={<XIcon size={14} />} size="xs">
          Cancel
        </Button>
        <Button onClick={handleSubmit} leftSection={<CheckIcon size={14} />} size="xs">
          {isEdit ? "Update" : "Add"} Marking
        </Button>
      </Group>
    </Stack>
  );
}

export function MarkingModal({
  opened,
  onClose,
  onSuccess,
  studentId,
  editRecord,
}: MarkingModalProps) {
  const isEdit = !!editRecord;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEdit ? "Edit Attendance Record" : "Add Attendance Record"}
      size="md"
    >
      <FormHandler
        initial={editRecord || { ...markingFormConfig.initial, student: studentId }}
        formType={isEdit ? "edit" : "new"}
        validation={[{}]}
        apiSubmit={async (data, id) => {
          if (isEdit && id) {
            return MARKING_API.updateMarking(String(id), data);
          }
          return MARKING_API.createMarking({ ...data, student: studentId });
        }}
        onSubmitSuccess={(res) => {
          onSuccess?.(res.data || res);
        }}
        triggerNotification={triggerNotification.form}
      >
        <MarkingForm onClose={onClose} isEdit={isEdit} />
      </FormHandler>
    </Modal>
  );
}
