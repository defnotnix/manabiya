"use client";

import { Stack, TextInput, PasswordInput, Switch } from "@mantine/core";
import { FormWrapper } from "@settle/core";

export function UsersForm() {
  const form = FormWrapper.useForm();
  const hasPasswordField = "password" in form.values;

  return (
    <Stack gap="md" p="md">
      <TextInput
        label="Username"
        placeholder="e.g., john.doe"
        required
        {...form.getInputProps("username")}
      />

      <TextInput
        label="Email"
        placeholder="john@example.com"
        type="email"
        required
        {...form.getInputProps("email")}
      />

      {hasPasswordField && (
        <PasswordInput
          label="Password"
          placeholder="Enter a strong password"
          required
          {...form.getInputProps("password")}
        />
      )}

      <Switch
        label="Active"
        description="Enable this user account"
        {...form.getInputProps("is_active", { type: "checkbox" })}
      />
    </Stack>
  );
}
