"use client";

import { useState } from "react";
import {
  Text,
  Group,
  Box,
  ScrollArea,
  Button,
  Stack,
  TextInput,
  Pagination,
  Loader,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { PACKAGE_API } from "../../../package/module.api";
import { Check, MagnifyingGlass } from "@phosphor-icons/react";

interface PackageSelectorProps {
  value: string | null;
  onChange: (packageId: string) => void;
  error?: string;
}

export function PackageSelector({
  value,
  onChange,
  error,
}: PackageSelectorProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch] = useDebouncedValue(search, 300);

  // Fetch packages with pagination and search
  const { data, isLoading } = useQuery({
    queryKey: ["packages", "list", page, debouncedSearch],
    queryFn: async () => {
      const res = await PACKAGE_API.getPackages({
        page,
        page_size: 10,
        search: debouncedSearch,
      });
      return res;
    },
  });

  const packages = data?.results || [];
  const totalPages = data?.pagination?.total_pages || 1;

  if (isLoading && !data) {
    return (
      <Stack gap="xs">
        <Text size="xs" fw={800}>
          Select Package
        </Text>
        <Box
          p="md"
          style={{
            border: "1px solid var(--mantine-color-gray-3)",
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <Loader size="sm" />
        </Box>
      </Stack>
    );
  }

  return (
    <Stack gap="xs">
      <Text size="xs" fw={800}>
        Select Package
      </Text>

      {/* Search input */}
      <TextInput
        placeholder="Search packages..."
        leftSection={<MagnifyingGlass size={16} />}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // Reset to first page on search
        }}
        size="xs"
      />

      {/* Package list */}
      <ScrollArea
        h={300}
        style={{
          border: "1px solid var(--mantine-color-gray-3)",
          borderRadius: 4,
        }}
      >
        <Stack gap={0}>
          {packages.length === 0 ? (
            <Text size="xs" c="dimmed" p="md" ta="center">
              No packages found
            </Text>
          ) : (
            packages.map((pkg: any) => {
              const isSelected = value === String(pkg.id);

              return (
                <Box
                  key={pkg.id}
                  p="sm"
                  style={{
                    backgroundColor: isSelected
                      ? "var(--mantine-color-blue-light)"
                      : "transparent",
                    borderBottom: "1px solid var(--mantine-color-gray-2)",
                  }}
                >
                  <Group justify="space-between" wrap="nowrap">
                    {/* Select button */}
                    <Button
                      size="xs"
                      variant={isSelected ? "filled" : "light"}
                      onClick={() => onChange(String(pkg.id))}
                      leftSection={
                        isSelected ? <Check size={14} weight="bold" /> : null
                      }
                    >
                      {isSelected ? "Selected" : "Select"}
                    </Button>

                    {/* Package info */}
                    <Stack gap={2} style={{ flex: 1 }}>
                      <Text size="xs" fw={800}>
                        {pkg.display_name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {pkg.package_name} • {pkg.base_units_total} units
                      </Text>
                    </Stack>
                  </Group>
                </Box>
              );
            })
          )}
        </Stack>
      </ScrollArea>

      {/* Pagination */}
      {totalPages > 1 && (
        <Group justify="center">
          <Pagination
            total={totalPages}
            value={page}
            onChange={setPage}
            size="sm"
          />
        </Group>
      )}

      {error && (
        <Text size="xs" fw={800} c="red">
          {error}
        </Text>
      )}
    </Stack>
  );
}
