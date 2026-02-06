import { Badge, Avatar, Text, Group } from "@mantine/core";
import { Check, X } from "@phosphor-icons/react";

export const productListColumns = [
  {
    accessor: "display_name",
    header: "Product Name",
    size: 250,
    render: (record: any) => (
      <Group gap="sm">
        <Text fw={500} size="xs">
          {record.display_name}
        </Text>
      </Group>
    ),
  },
  {
    accessor: "node.name",
    header: "Category",
    size: 150,
    render: (record: any) => <Text size="xs">{record.node?.name}</Text>,
  },
  {
    accessor: "base_unit_name",
    header: "Unit",
    size: 100,
  },
  {
    accessor: "base_unit_size",
    header: "Size",
    size: 100,
  },
  {
    accessor: "is_active",
    header: "Active",
    size: 100,
    render: (record: any) => (
      <Badge
        color={record.is_active ? "green" : "gray"}
        variant="light"
        leftSection={record.is_active ? <Check size={12} /> : <X size={12} />}
      >
        {record.is_active ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    accessor: "created_at",
    header: "Created At",
    size: 150,
    render: (record: any) => new Date(record.created_at).toLocaleDateString(),
  },
];
