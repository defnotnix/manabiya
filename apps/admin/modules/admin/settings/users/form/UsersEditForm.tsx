"use client";

import { Stack, TextInput, Switch } from "@mantine/core";
import { FormWrapper } from "@settle/core";

export function UsersEditForm() {
  const form = FormWrapper.useForm();

  return (
    <Stack gap="md" p="md">
      <TextInput
        label="First Name"
        placeholder="John"
        {...form.getInputProps("first_name")}
      />

      <TextInput
        label="Last Name"
        placeholder="Doe"
        {...form.getInputProps("last_name")}
      />

      <TextInput
        label="Email"
        placeholder="john@example.com"
        type="email"
        required
        {...form.getInputProps("email")}
      />

      <Switch
        label="Active"
        description="Enable this user account"
        {...form.getInputProps("is_active", { type: "checkbox" })}
      />
    </Stack>
  );
}
