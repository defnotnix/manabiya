"use client";

import { Stack, NumberInput, Switch, Select } from "@mantine/core";
import { FormWrapper } from "@settle/core";
import { PackageSelector } from "./components/PackageSelector";

export function OfferForm() {
  const form = FormWrapper.useForm();
  const { handleSubmit, isLoading } = FormWrapper.useFormProps();

  return (
    <Stack gap={0}>
      {/* Form Content */}
      <div>
        <Stack gap="md" p="md">
          <PackageSelector
            value={form.values.package}
            onChange={(packageId) => form.setFieldValue("package", packageId)}
            error={form.errors.package as string}
          />

          <NumberInput
            label="Price"
            placeholder="0.00"
            decimalScale={2}
            min={0}
            {...form.getInputProps("price")}
            required
          />

          <Select
            label="Currency"
            data={[
              { value: "NPR", label: "NPR - Nepalese Rupee" },
              { value: "USD", label: "USD - US Dollar" },
              { value: "EUR", label: "EUR - Euro" },
              { value: "INR", label: "INR - Indian Rupee" },
            ]}
            {...form.getInputProps("currency")}
            required
          />

          <Switch
            label="Available"
            description="Make this offer visible to clients"
            {...form.getInputProps("is_available", { type: "checkbox" })}
          />
        </Stack>
      </div>
    </Stack>
  );
}
