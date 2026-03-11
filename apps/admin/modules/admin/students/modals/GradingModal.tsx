"use client";

import {
  Modal,
  Stack,
  Select,
  Textarea,
  Group,
  Button,
  SimpleGrid,
} from "@mantine/core";
import { FormHandler } from "@settle/core";
import { triggerNotification } from "@settle/admin";
import { GRADING_API, GRADE_OPTIONS } from "../module.config";
import { gradingFormConfig } from "../form/form.config";
import { CheckIcon, XIcon } from "@phosphor-icons/react";

interface GradingModalProps {
  opened: boolean;
  onClose: () => void;
  onSuccess?: (grading: any) => void;
  studentId?: string | number; // Make studentId optional for local mode
  editRecord?: any;
  localMode?: boolean; // When true, skip API calls and just return data
}

function GradingForm({ onClose, isEdit }: { onClose: () => void; isEdit: boolean }) {
  const form = FormHandler.useForm();
  const { handleSubmit } = FormHandler.usePropContext();

  return (
    <Stack gap="md" p="md">
      <SimpleGrid cols={2}>
        <Select
          label="Grammar"
          placeholder="Select grade"
          data={GRADE_OPTIONS}
          {...form.getInputProps("grammar")}
        />
        <Select
          label="Conversation"
          placeholder="Select grade"
          data={GRADE_OPTIONS}
          {...form.getInputProps("conversation")}
        />
        <Select
          label="Composition"
          placeholder="Select grade"
          data={GRADE_OPTIONS}
          {...form.getInputProps("composition")}
        />
        <Select
          label="Listening"
          placeholder="Select grade"
          data={GRADE_OPTIONS}
          {...form.getInputProps("listening")}
        />
        <Select
          label="Reading"
          placeholder="Select grade"
          data={GRADE_OPTIONS}
          {...form.getInputProps("reading")}
        />
      </SimpleGrid>

      <Textarea
        label="Remarks"
        placeholder="Additional remarks"
        rows={3}
        {...form.getInputProps("remarks")}
      />

      <Group justify="flex-end" mt="md">
        <Button variant="light" onClick={onClose} leftSection={<XIcon size={14} />} size="xs">
          Cancel
        </Button>
        <Button onClick={handleSubmit} leftSection={<CheckIcon size={14} />} size="xs">
          {isEdit ? "Update" : "Add"} Grading
        </Button>
      </Group>
    </Stack>
  );
}

export function GradingModal({
  opened,
  onClose,
  onSuccess,
  studentId,
  editRecord,
  localMode = false,
}: GradingModalProps) {
  const isEdit = !!editRecord;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEdit ? "Edit Grading" : "Add Grading"}
      size="md"
    >
      <FormHandler
        initial={editRecord || { ...gradingFormConfig.initial, student: studentId }}
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
            return GRADING_API.updateGrading(String(id), data);
          }
          return GRADING_API.createGrading({ ...data, student: studentId });
        }}
        onSubmitSuccess={(res) => {
          onSuccess?.(res.data || res);
        }}
        triggerNotification={triggerNotification}
      >
        <GradingForm onClose={onClose} isEdit={isEdit} />
      </FormHandler>
    </Modal>
  );
}
