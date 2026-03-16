"use client";

import { Stack, TextInput, Select, NumberInput, Switch } from "@mantine/core";
import { FormWrapper } from "@settle/core";
import { SHIFT_OPTIONS } from "./form.config";

export function BatchesForm() {
  const form = FormWrapper.useForm();

  return (
    <Stack gap="md" p="md">
      <TextInput
        label="Batch Name"
        placeholder="e.g., N5-2026-A"
        required
        {...form.getInputProps("name")}
      />

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

      <TextInput
        label="Books"
        placeholder="e.g., Minna no Nihongo"
        {...form.getInputProps("books")}
      />

      <TextInput
        label="Instructor"
        placeholder="e.g., Sato Sensei"
        required
        {...form.getInputProps("instructor")}
      />

      <NumberInput
        label="Total Days"
        placeholder="120"
        required
        min={1}
        {...form.getInputProps("total_days")}
      />

      <TextInput
        label="Class Hours Per Session"
        placeholder="1.50"
        required
        {...form.getInputProps("per_class_hours")}
      />

      <Switch
        label="Active"
        description="Enable this batch"
        {...form.getInputProps("is_active", { type: "checkbox" })}
      />
    </Stack>
  );
}
