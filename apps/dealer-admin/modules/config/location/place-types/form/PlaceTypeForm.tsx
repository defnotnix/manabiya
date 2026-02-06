"use client";

import { Stack, TextInput } from "@mantine/core";
import { FormWrapper } from "@settle/core";

export function PlaceTypeForm() {
  const form = FormWrapper.useForm();

  return (
    <Stack gap="md" p="md">
      <TextInput
        label="Name"
        description="The name of the place type (e.g., School, Polling Center)"
        placeholder="e.g. School"
        {...form.getInputProps("name")}
        required
      />
    </Stack>
  );
}
