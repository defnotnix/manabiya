"use client";

import { Stack, TextInput, Group, Text, Divider, Button } from "@mantine/core";
import { FormWrapper } from "@settle/core";
import { FloppyDiskIcon } from "@phosphor-icons/react";

interface Step2ContactInfoProps {
  disabled?: boolean;
  onSave?: () => void;
  isSaving?: boolean;
}

export function Step2ContactInfo({ disabled = false, onSave, isSaving = false }: Step2ContactInfoProps) {
  const form = FormWrapper.useForm();

  return (
    <Stack gap="md">
      {onSave && (
        <Group justify="flex-end">
          <Button
            size="xs"
            loading={isSaving}
            onClick={onSave}
            leftSection={<FloppyDiskIcon size={14} />}
            disabled={disabled}
          >
            Save Changes
          </Button>
        </Group>
      )}

      <Text size="sm" fw={600} c="dimmed">
        Primary Contact
      </Text>

      <TextInput
        label="Email"
        placeholder="Enter email address"
        type="email"
        required
        disabled={disabled}
        {...form.getInputProps("email")}
      />

      <TextInput
        label="Contact Number"
        placeholder="Enter primary contact"
        required
        disabled={disabled}
        {...form.getInputProps("contact")}
      />

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
