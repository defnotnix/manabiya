import { Card, Divider, Group, Pagination, Select, Text } from "@mantine/core";

import type { AssignmentFilters } from "../types";

const PAGE_SIZES = [12, 24, 48, 96];

interface AssignmentsPaginationProps {
  filters: AssignmentFilters;
  setFilters: React.Dispatch<React.SetStateAction<AssignmentFilters>>;
  totalCount: number;
  totalPages: number;
}

export function AssignmentsPagination({
  filters,
  setFilters,
  totalCount,
  totalPages,
}: AssignmentsPaginationProps) {
  const startItem = (filters.page - 1) * filters.page_size + 1;
  const endItem = Math.min(filters.page * filters.page_size, totalCount);

  return (
    <Card withBorder p="md">
      <Group justify="space-between" wrap="wrap" gap="md">
        <Group gap="md">
          <Text size="sm" c="dimmed">
            Showing {startItem}-{endItem} of {totalCount}
          </Text>
          <Divider orientation="vertical" />
          <Group gap="xs">
            <Text size="sm" c="dimmed">
              Per page:
            </Text>
            <Select
              size="xs"
              w={80}
              data={PAGE_SIZES.map((size) => ({ value: String(size), label: String(size) }))}
              value={String(filters.page_size)}
              onChange={(value) =>
                setFilters((f) => ({ ...f, page_size: Number(value), page: 1 }))
              }
            />
          </Group>
        </Group>
        <Pagination
          total={totalPages}
          value={filters.page}
          onChange={(page) => setFilters((f) => ({ ...f, page }))}
          withEdges
        />
      </Group>
    </Card>
  );
}
