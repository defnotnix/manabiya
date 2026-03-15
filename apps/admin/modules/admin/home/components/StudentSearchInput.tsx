"use client";

import { Autocomplete, Loader, ActionIcon } from "@mantine/core";
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";

interface StudentSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

export function StudentSearchInput({
  value,
  onChange,
  isLoading = false,
}: StudentSearchInputProps) {
  return (
    <Autocomplete
      value={value}
      onChange={onChange}
      rightSection={
        isLoading ? (
          <Loader size="xs" />
        ) : value ? (
          <ActionIcon
            variant="transparent"
            size="xs"
            onClick={() => onChange("")}
          >
            <XIcon size={16} />
          </ActionIcon>
        ) : (
          <MagnifyingGlassIcon />
        )
      }
      placeholder="Search Student"
      size="lg"
      styles={{
        input: {
          fontSize: "var(--mantine-font-size-xs)",
        },
      }}
    />
  );
}
