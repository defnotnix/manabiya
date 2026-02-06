import { Badge, Text, Group } from "@mantine/core";
import { Check, X } from "@phosphor-icons/react";

export const offerListColumns = [
  {
    accessor: "display_name",
    header: "Offer",
    size: 350,
    render: (record: any) => (
      <Text fw={500} size="xs">
        {record.display_name}
      </Text>
    ),
  },
  {
    accessor: "package.display_name",
    header: "Package",
    size: 250,
    render: (record: any) => (
      <Text size="xs">{record.package?.display_name}</Text>
    ),
  },
  {
    accessor: "product.display_name",
    header: "Product",
    size: 200,
    render: (record: any) => (
      <Text size="xs">{record.product?.display_name}</Text>
    ),
  },
  {
    accessor: "price",
    header: "Price",
    size: 120,
    render: (record: any) => (
      <Text size="xs" fw={600}>
        {record.price} {record.currency}
      </Text>
    ),
  },
  {
    accessor: "is_available",
    header: "Available",
    size: 100,
    render: (record: any) => (
      <Badge
        color={record.is_available ? "green" : "gray"}
        variant="light"
        leftSection={
          record.is_available ? <Check size={12} /> : <X size={12} />
        }
      >
        {record.is_available ? "Yes" : "No"}
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
