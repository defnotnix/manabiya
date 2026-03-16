"use client";

import { Stack, Button, Group, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";

interface CategoryFormProps {
  onSubmit: (data: { name: string; description: string }) => Promise<void>;
  onCancel: () => void;
}

export function CategoryForm({ onSubmit, onCancel }: CategoryFormProps) {
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
    },
    validate: {
      name: (value) => (!value.trim() ? "Category name is required" : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    await onSubmit(values);
    form.reset();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Category Name"
          placeholder="e.g., Visa Application"
          {...form.getInputProps("name")}
          autoFocus
          required
        />
        <Textarea
          label="Description (Optional)"
          placeholder="Describe what this category is for"
          {...form.getInputProps("description")}
          rows={3}
        />
        <Group justify="flex-end">
          <Button variant="light" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Create Category</Button>
        </Group>
      </Stack>
    </form>
  );
}
