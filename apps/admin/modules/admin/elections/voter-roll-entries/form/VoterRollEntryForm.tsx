"use client";

import { Stack, TextInput, Textarea } from "@mantine/core";
import { FormWrapper } from "@settle/core";

export function VoterRollEntryForm() {
  const form = FormWrapper.useForm();

  return (
    <Stack gap="md" p="md">
      {/* Read Only Info */}
      <TextInput
        label="Voter Name"
        value={form.values.name_en || ""}
        readOnly
        variant="filled"
      />
      <TextInput
        label="Voter No"
        value={form.values.voter_no || ""}
        readOnly
        variant="filled"
      />

      {/* Editable Fields */}
      <TextInput label="Phone Number" {...form.getInputProps("phone_number")} />
      <TextInput label="Occupation" {...form.getInputProps("occupation")} />
      <TextInput label="Education" {...form.getInputProps("education")} />
      <TextInput label="Religion" {...form.getInputProps("religion")} />
      <TextInput label="Address (EN)" {...form.getInputProps("address_en")} />
      <Textarea label="Remarks" {...form.getInputProps("remarks")} />
    </Stack>
  );
}
