import { Badge, Image, Group } from "@mantine/core";

export const signaturesListColumns = [
  {
    accessor: "name",
    title: "Name",
    width: 150,
  },
  {
    accessor: "signature_image",
    title: "Preview",
    width: 120,
    render: (record: any) => (
      <Group gap="xs">
        {record.signature_image ? (
          <Image
            src={record.signature_image}
            alt={record.name}
            width={80}
            height={60}
            fit="contain"
          />
        ) : (
          <span style={{ color: "#999" }}>No image</span>
        )}
      </Group>
    ),
  },
  {
    accessor: "is_active",
    title: "Status",
    width: 100,
    render: (record: any) => (
      <Badge color={record.is_active ? "green" : "gray"} size="sm">
        {record.is_active ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    accessor: "created_at",
    title: "Created",
    width: 120,
    render: (record: any) =>
      new Date(record.created_at).toLocaleDateString(),
  },
];
