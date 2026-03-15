"use client";

import { Stack, TextInput, Textarea, Switch } from "@mantine/core";
import { FormWrapper } from "@settle/core";

export function CustomsForm() {
  const form = FormWrapper.useForm();

  return (
    <Stack gap="md" p="md">
      <TextInput
        label="Name"
        placeholder="e.g., Embassy Batch A"
        required
        {...form.getInputProps("name")}
      />

      <Textarea
        label="Description"
        placeholder="Brief description of this custom document group"
        {...form.getInputProps("description")}
      />

      <Switch
        label="Active"
        description="Enable this custom document"
        {...form.getInputProps("is_active", { type: "checkbox" })}
      />
    </Stack>
  );
}
