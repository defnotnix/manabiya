"use client";

import { Stack, TextInput, PasswordInput } from "@mantine/core";
import { FormWrapper } from "@settle/core";
import { PollingStationMultiSelect } from "./PollingStationMultiSelect";

export function DataEntryAccountForm() {
  const form = FormWrapper.useForm();

  return (
    <Stack gap="md" p="md">
      <TextInput
        label="Name"
        placeholder="Ram Bahadur"
        {...form.getInputProps("name")}
        withAsterisk
      />
      <TextInput
        label="Email"
        placeholder="new@example.com"
        {...form.getInputProps("email")}
        withAsterisk
      />
      <TextInput
        label="Username"
        {...form.getInputProps("username")}
        withAsterisk
      />
      <PasswordInput
        label="Password"
        {...form.getInputProps("password")}
        withAsterisk
      />
      <PollingStationMultiSelect
        value={form.values.polling_stations || []}
        onChange={(val) => form.setFieldValue("polling_stations", val)}
        error={form.errors.polling_stations as string}
      />
    </Stack>
  );
}
