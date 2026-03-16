"use client";

import { Stack, TextInput, FileInput, Switch } from "@mantine/core";
import { SignatureIcon } from "@phosphor-icons/react";
import { FormWrapper } from "@settle/core";

export function SignaturesForm() {
  const form = FormWrapper.useForm();

  return (
    <Stack gap="md" p="md">
      <TextInput
        label="Signature Name"
        placeholder="e.g., Principal"
        required
        {...form.getInputProps("name")}
      />

      <FileInput
        label="Signature Image"
        placeholder="Upload signature image"
        accept="image/*"
        icon={<SignatureIcon size={16} />}
        {...form.getInputProps("signature_image")}
      />

      <Switch
        label="Active"
        description="Enable this signature"
        {...form.getInputProps("is_active", { type: "checkbox" })}
      />
    </Stack>
  );
}
