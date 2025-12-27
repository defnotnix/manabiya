"use client";

import { useState } from "react";
import {
  Card,
  Group,
  Button,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import {
  CheckIcon,
  XIcon,
} from "@phosphor-icons/react";
import { PropConfigShellCardNew, PropConfigField } from "../../ConfigShell.type";

export function ConfigShellCardNew({
  fields = [],
  onCreate,
  isLoading = false,
  validator,
}: PropConfigShellCardNew) {
  const [formData, setFormData] = useState<any>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [fieldName]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Use Zod validator if provided
    if (validator) {
      try {
        validator.parse(formData);
      } catch (error: any) {
        if (error.errors) {
          error.errors.forEach((err: any) => {
            const fieldName = err.path.join(".");
            newErrors[fieldName] = err.message;
          });
        }
      }
    } else {
      // Fallback to basic validation
      fields.forEach((field) => {
        if (field.required && !formData[field.name]?.trim()) {
          newErrors[field.name] = `${field.label} is required`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (validateForm()) {
      onCreate?.(formData);
      setFormData(
        fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
      );
    }
  };

  const isFormEmpty = fields.every((field) => !formData[field.name]?.trim());

  return (
    <Card p="md" radius="md" withBorder style={{ borderStyle: "dashed" }}>
      <Card.Section withBorder inheritPadding py="md">
        <Stack gap="sm">
          {fields.map((field) => {
            const value = formData[field.name] || "";
            const error = errors[field.name];

            if (field.type === "textarea") {
              return (
                <Textarea
                  key={field.name}
                  label={field.label}
                  placeholder={field.placeholder}
                  value={value}
                  onChange={(e) =>
                    handleFieldChange(field.name, e.currentTarget.value)
                  }
                  required={field.required}
                  error={error}
                />
              );
            }

            return (
              <TextInput
                key={field.name}
                label={field.label}
                placeholder={field.placeholder}
                type={field.type || "text"}
                value={value}
                onChange={(e) =>
                  handleFieldChange(field.name, e.currentTarget.value)
                }
                required={field.required}
                error={error}
              />
            );
          })}
        </Stack>
      </Card.Section>

      <Group justify="flex-end" mt="md" gap={4}>
        <Button
          size="xs"
          variant="light"
          color="green"
          leftSection={<CheckIcon size={14} />}
          onClick={handleCreate}
          disabled={isFormEmpty || isLoading}
          loading={isLoading}
        >
          Create
        </Button>
      </Group>
    </Card>
  );
}
