"use client";

import { Stack, TextInput } from "@mantine/core";
import { FormWrapper } from "@settle/core";

export function GeoUnitTypeForm() {
  const form = FormWrapper.useForm();

  return (
    <Stack gap="md" p="md">
      <TextInput
        label="Name"
        description="The name of the geographic unit type (e.g., Province, District)"
        placeholder="e.g. District"
        {...form.getInputProps("name")}
        required
      />
    </Stack>
  );
}
