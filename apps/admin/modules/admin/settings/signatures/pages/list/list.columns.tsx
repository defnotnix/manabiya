import { Image, Group } from "@mantine/core";

export const signaturesListColumns = [
  {
    accessor: "name",
    title: "Name",
    width: 150,
  },
  {
    accessor: "role",
    title: "Role (EN)",
    width: 150,
  },
  {
    accessor: "jp_role",
    title: "Role (JP)",
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
    accessor: "created_at",
    title: "Created",
    width: 120,
    render: (record: any) =>
      new Date(record.created_at).toLocaleDateString(),
  },
];
