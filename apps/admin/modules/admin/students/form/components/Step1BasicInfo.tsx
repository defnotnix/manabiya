"use client";

import { Stack, TextInput, Select, Group, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { FormWrapper } from "@settle/core";
import { GENDER_OPTIONS } from "../../module.config";

interface Step1BasicInfoProps {
  disabled?: boolean;
}

export function Step1BasicInfo({ disabled = false }: Step1BasicInfoProps) {
  const form = FormWrapper.useForm();

  return (
    <Stack gap="md">
      <TextInput
        label="Student Code"
        placeholder="Auto-generated if left empty"
        disabled={disabled}
        {...form.getInputProps("student_code")}
      />

      <Group grow>
        <TextInput
          label="First Name"
          placeholder="Enter first name"
          required
          disabled={disabled}
          {...form.getInputProps("first_name")}
        />
        <TextInput
          label="Middle Name"
          placeholder="Enter middle name"
          disabled={disabled}
          {...form.getInputProps("middle_name")}
        />
        <TextInput
          label="Last Name"
          placeholder="Enter last name"
          required
          disabled={disabled}
          {...form.getInputProps("last_name")}
        />
      </Group>

      <Group grow>
        <DateInput
          label="Date of Birth"
          placeholder="Select date"
          disabled={disabled}
          valueFormat="YYYY-MM-DD"
          {...form.getInputProps("date_of_birth")}
        />
        <Select
          label="Gender"
          placeholder="Select gender"
          data={GENDER_OPTIONS}
          disabled={disabled}
          {...form.getInputProps("gender")}
        />
      </Group>

      <TextInput
        label="Current Address"
        placeholder="Enter current address"
        disabled={disabled}
        {...form.getInputProps("current_address")}
      />

      <TextInput
        label="Permanent Address"
        placeholder="Enter permanent address"
        disabled={disabled}
        {...form.getInputProps("permanent_address")}
      />
    </Stack>
  );
}
