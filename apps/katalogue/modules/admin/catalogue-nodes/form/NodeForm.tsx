"use client";

import {
  TextInput,
  Select,
  Stack,
  Divider,
  Button,
  Group,
} from "@mantine/core";
import { CheckIcon } from "@phosphor-icons/react";
import { FormWrapper } from "@settle/core";

export function NodeForm() {
  const form = FormWrapper.useForm();
  const { handleSubmit, isLoading } = FormWrapper.useFormProps();

  return (
    <Stack gap={0}>
      {/* Form Content */}
      <div>
        <Stack gap="md" p="md">
          <TextInput
            label="Name"
            placeholder="e.g., Cadbury, Dairy Milk"
            {...form.getInputProps("name")}
            required
          />

          <Select
            label="Node Type"
            placeholder="Select type"
            data={[
              { value: "BRAND", label: "Brand" },
              { value: "PRODUCT_GROUP", label: "Product Group" },
              { value: "CATEGORY", label: "Category" },
            ]}
            {...form.getInputProps("node_type")}
            required
          />
        </Stack>
      </div>

      <Divider />

      {/* Footer Actions */}
      <Group justify="space-between" p="md">
        <div /> {/* Spacer for layout consistency */}
        <Button
          size="xs"
          onClick={handleSubmit}
          loading={isLoading}
          rightSection={<CheckIcon />}
        >
          Save Node
        </Button>
      </Group>
    </Stack>
  );
}
