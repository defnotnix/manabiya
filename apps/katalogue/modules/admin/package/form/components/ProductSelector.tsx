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
import { PRODUCT_API } from "../../../product/module.api";
import { Check, MagnifyingGlass } from "@phosphor-icons/react";

interface ProductSelectorProps {
  value: string | null;
  onChange: (productId: string) => void;
  error?: string;
}

export function ProductSelector({
  value,
  onChange,
  error,
}: ProductSelectorProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch] = useDebouncedValue(search, 300);

  // Fetch products with pagination and search
  const { data, isLoading } = useQuery({
    queryKey: ["products", "list", page, debouncedSearch],
    queryFn: async () => {
      const res = await PRODUCT_API.getProducts({
        page,
        page_size: 10,
        search: debouncedSearch,
      });
      return res;
    },
  });

  const products = data?.results || [];
  const totalPages = data?.pagination?.total_pages || 1;

  if (isLoading && !data) {
    return (
      <Stack gap="xs">
        <Text size="xs" fw={800}>
          Select Product
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
        Select Product
      </Text>

      {/* Search input */}
      <TextInput
        placeholder="Search products..."
        leftSection={<MagnifyingGlass size={16} />}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // Reset to first page on search
        }}
        size="xs"
      />

      {/* Product list */}
      <ScrollArea
        h={300}
        style={{
          border: "1px solid var(--mantine-color-gray-3)",
          borderRadius: 4,
        }}
      >
        <Stack gap={0}>
          {products.length === 0 ? (
            <Text size="xs" c="dimmed" p="md" ta="center">
              No products found
            </Text>
          ) : (
            products.map((product: any) => {
              const isSelected = value === String(product.id);

              return (
                <Box
                  key={product.id}
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
                      onClick={() => onChange(String(product.id))}
                      leftSection={
                        isSelected ? <Check size={14} weight="bold" /> : null
                      }
                    >
                      {isSelected ? "Selected" : "Select"}
                    </Button>

                    {/* Product info */}
                    <Stack gap={2} style={{ flex: 1 }}>
                      <Text size="xs" fw={800}>
                        {product.display_name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {product.base_unit_name} • {product.node?.name}
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
