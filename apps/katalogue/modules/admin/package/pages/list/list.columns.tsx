import { Badge, Text, Group } from "@mantine/core";
import { Check, X } from "@phosphor-icons/react";

export const packageListColumns = [
  {
    accessor: "display_name",
    header: "Package Name",
    size: 300,
    render: (record: any) => (
      <Text fw={500} size="xs">
        {record.display_name}
      </Text>
    ),
  },
  {
    accessor: "product.display_name",
    header: "Product",
    size: 250,
    render: (record: any) => (
      <Text size="xs">{record.product?.display_name}</Text>
    ),
  },
  {
    accessor: "package_name",
    header: "Package Type",
    size: 120,
  },
  {
    accessor: "base_units_total",
    header: "Total Units",
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
