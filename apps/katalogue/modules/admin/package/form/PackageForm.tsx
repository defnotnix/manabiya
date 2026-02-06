"use client";

import {
  Stack,
  TextInput,
  NumberInput,
  Switch,
  Select,
  Button,
  Group,
  Divider,
  Paper,
  Text,
  ActionIcon,
} from "@mantine/core";
import { FormWrapper } from "@settle/core";
import { useState } from "react";
import { PlusIcon, TrashIcon, CheckIcon } from "@phosphor-icons/react";
import { ProductSelector } from "./components/ProductSelector";

export function PackageForm() {
  const form = FormWrapper.useForm();
  const { handleSubmit, isLoading } = FormWrapper.useFormProps();

  const components = form.values.components || [];

  const addComponent = () => {
    form.setFieldValue("components", [
      ...components,
      {
        component_type: "BASE_UNIT",
        quantity: 1,
        component_package: null,
      },
    ]);
  };

  const removeComponent = (index: number) => {
    const updated = components.filter((_: any, i: number) => i !== index);
    form.setFieldValue("components", updated);
  };

  return (
    <Stack gap={0}>
      {/* Form Content */}
      <div>
        <Stack gap="md" p="md">
          <ProductSelector
            value={form.values.product}
            onChange={(productId) => form.setFieldValue("product", productId)}
            error={form.errors.product as string}
          />

          <TextInput
            label="Package Name"
            placeholder="e.g. Pack 6, Box 12, Carton 24"
            description="The package type identifier"
            {...form.getInputProps("package_name")}
            required
          />

          <NumberInput
            label="Base Units Total"
            placeholder="1.0"
            description="Total base units in this package"
            precision={6}
            {...form.getInputProps("base_units_total")}
            required
          />

          <Switch
            label="Active"
            description="Enable this package"
            {...form.getInputProps("is_active", { type: "checkbox" })}
          />

          <Divider label="Package Components" labelPosition="center" />

          <Stack gap="sm">
            {components.length === 0 ? (
              <Text size="sm" c="dimmed" ta="center" py="md">
                No components added yet. Click "Add Component" to start.
              </Text>
            ) : (
              components.map((component: any, index: number) => (
                <Paper key={index} withBorder p="md">
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Text size="sm" fw={500}>
                        Component {index + 1}
                      </Text>
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        onClick={() => removeComponent(index)}
                      >
                        <TrashIcon size={16} />
                      </ActionIcon>
                    </Group>

                    <Select
                      label="Component Type"
                      data={[
                        { value: "BASE_UNIT", label: "Base Unit" },
                        { value: "PACKAGE", label: "Package" },
                      ]}
                      {...form.getInputProps(
                        `components.${index}.component_type`,
                      )}
                      required
                    />

                    <NumberInput
                      label="Quantity"
                      precision={6}
                      min={0.01}
                      {...form.getInputProps(`components.${index}.quantity`)}
                      required
                    />

                    {component.component_type === "PACKAGE" && (
                      <Text size="xs" c="dimmed">
                        Note: Package-based components require manual package ID
                        entry or will be added in a future update.
                      </Text>
                    )}
                  </Stack>
                </Paper>
              ))
            )}

            <Button
              variant="light"
              leftSection={<PlusIcon size={16} />}
              onClick={addComponent}
              size="sm"
            >
              Add Component
            </Button>
          </Stack>
        </Stack>
      </div>
    </Stack>
  );
}
