"use client";

import { Stack, TextInput, Group, Text, Divider } from "@mantine/core";
import { FormWrapper } from "@settle/core";

interface Step2ContactInfoProps {
  disabled?: boolean;
}

export function Step2ContactInfo({ disabled = false }: Step2ContactInfoProps) {
  const form = FormWrapper.useForm();

  return (
    <Stack gap="md">
      <Text size="sm" fw={600} c="dimmed">
        Primary Contact
      </Text>

      <TextInput
        label="Email"
        placeholder="Enter email address"
        type="email"
        disabled={disabled}
        {...form.getInputProps("email")}
      />

      <Group grow>
        <TextInput
          label="Contact Number"
          placeholder="Enter primary contact"
          disabled={disabled}
          {...form.getInputProps("contact")}
        />
        <TextInput
          label="Phone Number"
          placeholder="Enter phone number"
          disabled={disabled}
          {...form.getInputProps("phone_number")}
        />
      </Group>

      <Divider my="sm" />

      <Text size="sm" fw={600} c="dimmed">
        Emergency Contact
      </Text>

      <TextInput
        label="Emergency Contact Name"
        placeholder="Enter name"
        disabled={disabled}
        {...form.getInputProps("emergency_contact_name")}
      />

      <Group grow>
        <TextInput
          label="Relationship"
          placeholder="e.g., Father, Mother, Guardian"
          disabled={disabled}
          {...form.getInputProps("emergency_contact_relation")}
        />
        <TextInput
          label="Emergency Contact Phone"
          placeholder="Enter phone number"
          disabled={disabled}
          {...form.getInputProps("emergency_contact_phone")}
        />
      </Group>
    </Stack>
  );
}
