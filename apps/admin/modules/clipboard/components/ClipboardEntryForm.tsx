"use client";

import { Stack, Button, Group, TextInput, Textarea, Checkbox } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Category, ClipboardEntry } from "../hooks/useClipboardApi";

interface ClipboardEntryFormProps {
  category: Category;
  entry?: ClipboardEntry | null;
  onSubmit: (data: {
    title: string;
    content: string;
    notes: string;
    is_pinned: boolean;
  }) => Promise<void>;
  onCancel: () => void;
}

export function ClipboardEntryForm({
  category,
  entry,
  onSubmit,
  onCancel,
}: ClipboardEntryFormProps) {
  const form = useForm({
    initialValues: {
      title: entry?.title || "",
      content: entry?.content || "",
      notes: entry?.notes || "",
      is_pinned: entry?.is_pinned || false,
    },
    validate: {
      title: (value) => (!value.trim() ? "Title is required" : null),
      content: (value) => (!value.trim() ? "Content is required" : null),
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
          label="Title"
          placeholder="e.g., Home Address (Japanese)"
          {...form.getInputProps("title")}
          autoFocus
          required
        />

        <Textarea
          label="Content"
          placeholder="The actual text to clipboard"
          {...form.getInputProps("content")}
          rows={6}
          required
        />

        <Textarea
          label="Notes (Optional)"
          placeholder="Add notes for this entry"
          {...form.getInputProps("notes")}
          rows={2}
        />

        <Checkbox
          label="Pin this entry (appears at top)"
          {...form.getInputProps("is_pinned", { type: "checkbox" })}
        />

        <Group justify="flex-end">
          <Button variant="light" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{entry ? "Update Entry" : "Create Entry"}</Button>
        </Group>
      </Stack>
    </form>
  );
}
