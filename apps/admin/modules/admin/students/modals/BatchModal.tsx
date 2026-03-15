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
  LoadingOverlay,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { BATCH_API, SHIFT_OPTIONS } from "../module.config";
import { batchFormConfig } from "../form/form.config";
import { CheckIcon, XIcon } from "@phosphor-icons/react";
import { notifications } from "@mantine/notifications";
import { z } from "zod";
import { useState, useEffect } from "react";

// Batch validation schema - all fields required
const batchValidationSchema = z.object({
  name: z.string().min(1, "Batch name is required"),
  shift: z.string().min(1, "Shift is required"),
  course: z.string().min(1, "Course is required"),
  books: z.string().min(1, "Books is required"),
  instructor: z.string().min(1, "Instructor is required"),
  total_days: z.coerce.number().min(1, "Total days must be at least 1"),
  per_class_hours: z.string().min(1, "Per class hours is required"),
  is_active: z.boolean().default(true),
});

interface BatchModalProps {
  opened: boolean;
  onClose: () => void;
  onSuccess?: (batch: any) => void;
  editRecord?: any;
}

export function BatchModal({
  opened,
  onClose,
  onSuccess,
  editRecord,
}: BatchModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = !!editRecord;

  const form = useForm({
    initialValues: editRecord || batchFormConfig.initial,
    validate: zodResolver(batchValidationSchema),
  });

  // Reset form when modal opens or editRecord changes
  useEffect(() => {
    if (opened) {
      form.setValues(editRecord || batchFormConfig.initial);
    }
  }, [opened, editRecord]);

  const handleSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      let result;

      if (isEdit) {
        result = await BATCH_API.updateBatch(String(editRecord.id), values);
      } else {
        result = await BATCH_API.createBatch(values);
      }

      const batchData = result?.data || result;
      onSuccess?.(batchData);

      notifications.show({
        title: "Success",
        message: isEdit ? "Batch updated successfully" : "Batch created successfully",
        color: "green",
      });

      form.reset();
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error?.message || "Failed to save batch",
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEdit ? "Edit Batch" : "New Batch"}
      size="md"
    >
      <LoadingOverlay visible={isSubmitting} zIndex={1000} />
      <form onSubmit={form.onSubmit(handleSubmit)}>
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
              required
              {...form.getInputProps("shift")}
            />
            <TextInput
              label="Course"
              placeholder="e.g., Japanese N5"
              required
              {...form.getInputProps("course")}
            />
          </Group>

          <TextInput
            label="Books"
            placeholder="e.g., Minna no Nihongo"
            required
            {...form.getInputProps("books")}
          />

          <TextInput
            label="Instructor"
            placeholder="e.g., Sato Sensei"
            required
            {...form.getInputProps("instructor")}
          />

          <Group grow>
            <NumberInput
              label="Total Days"
              placeholder="e.g., 120"
              min={1}
              required
              {...form.getInputProps("total_days")}
            />
            <TextInput
              label="Per Class Hours"
              placeholder="e.g., 1.50"
              required
              {...form.getInputProps("per_class_hours")}
            />
          </Group>

          <Switch
            label="Active"
            {...form.getInputProps("is_active", { type: "checkbox" })}
          />

          <Group justify="flex-end" mt="md">
            <Button
              variant="light"
              onClick={onClose}
              leftSection={<XIcon size={14} />}
              size="xs"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              leftSection={<CheckIcon size={14} />}
              size="xs"
              loading={isSubmitting}
            >
              {isEdit ? "Update" : "Create"} Batch
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
