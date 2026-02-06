"use client";

import { Stack, TextInput, NumberInput, Switch } from "@mantine/core";
import { FormWrapper } from "@settle/core";
import { NodeTreeSelector } from "./components/NodeTreeSelector";

export function ProductForm() {
  const form = FormWrapper.useForm();

  return (
    <Stack gap="md" p="md">
      <NodeTreeSelector
        value={form.values.node}
        onChange={(nodeId) => form.setFieldValue("node", nodeId)}
        error={form.errors.node as string}
      />

      <TextInput
        label="Display Name"
        placeholder="e.g. Cadbury Dairy Milk Silk Bubbly 50g"
        description="The full product display name"
        {...form.getInputProps("display_name")}
        required
      />

      <TextInput
        label="Base Unit Name"
        placeholder="e.g. g, ml, pc"
        description="The primary unit of measure"
        {...form.getInputProps("base_unit_name")}
      />

      <NumberInput
        label="Base Unit Size"
        placeholder="1.0"
        decimalScale={6}
        {...form.getInputProps("base_unit_size")}
      />

      <Switch
        label="Active"
        description="Enable this product"
        {...form.getInputProps("is_active", { type: "checkbox" })}
      />
    </Stack>
  );
}
