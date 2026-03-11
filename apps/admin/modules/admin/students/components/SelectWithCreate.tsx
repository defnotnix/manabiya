"use client";

import { Select, Group, Text } from "@mantine/core";
import { PlusIcon } from "@phosphor-icons/react";
import { forwardRef } from "react";

interface SelectWithCreateProps {
  label: string;
  placeholder?: string;
  data: { value: string; label: string }[];
  disabled?: boolean;
  required?: boolean;
  onAddNew: () => void;
  value?: string | null;
  onChange?: (value: string | null) => void;
  error?: string;
}

export const SelectWithCreate = forwardRef<
  HTMLInputElement,
  SelectWithCreateProps
>(
  (
    { label, placeholder, data, disabled, required, onAddNew, error, ...rest },
    ref
  ) => {
    // Add "Create new" option at the end
    const dataWithCreate = [
      ...data,
      { value: "__create_new__", label: "+ Add New..." },
    ];

    const handleChange = (value: string | null) => {
      if (value === "__create_new__") {
        onAddNew();
        return;
      }
      rest.onChange?.(value);
    };

    return (
      <Select
        ref={ref}
        label={label}
        placeholder={placeholder}
        data={dataWithCreate}
        disabled={disabled}
        required={required}
        searchable
        clearable
        error={error}
        value={rest.value}
        onChange={handleChange}
        renderOption={({ option }) => {
          if (option.value === "__create_new__") {
            return (
              <Group gap="xs" c="blue">
                <PlusIcon size={14} />
                <Text size="sm" fw={500}>
                  Add New
                </Text>
              </Group>
            );
          }
          return <Text size="sm">{option.label}</Text>;
        }}
      />
    );
  }
);

SelectWithCreate.displayName = "SelectWithCreate";
