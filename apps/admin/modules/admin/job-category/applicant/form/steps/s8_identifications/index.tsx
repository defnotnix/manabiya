"use client";

import { Stack, Text, TextInput } from "@mantine/core";
import { FormHandler } from "@settle/core";

export function StepIdentifications() {
  const form = FormHandler.useForm();

  return (
    <Stack gap="md">
      <div>
        <Text size="2rem" lh="2.3rem">
          <b>Identifications</b>
          <br />
        </Text>
        <Text size="xs">
          Upload your official identification documents.
        </Text>
      </div>

      <TextInput
        label="License Number"
        placeholder="e.g. ABC123456"
        description="Your license or identification number"
        {...form.getInputProps("license_number")}
      />

      <Text size="sm" c="dimmed">
        Passport, Certificate, and other documents can be uploaded here.
      </Text>
    </Stack>
  );
}
