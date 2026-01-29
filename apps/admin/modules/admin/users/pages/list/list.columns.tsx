import { Badge, Text, Avatar, Group } from "@mantine/core";

export const usersListColumns = [
  {
    accessor: "id",
    header: "ID",
    size: 60,
  },
  {
    accessor: "firstName",
    header: "User",
    size: 200,
    render: (row: any) => (
      <Group gap="sm">
        <Avatar src={row.image} radius="xl" size="sm" />
        <Text size="sm" fw={500}>
          {row.firstName} {row.lastName}
        </Text>
      </Group>
    ),
  },
  {
    accessor: "email",
    header: "Email",
    size: 200,
  },
  {
    accessor: "age",
    header: "Age",
    size: 80,
  },
  {
    accessor: "gender",
    header: "Gender",
    size: 100,
    render: (row: any) => (
      <Text size="sm" tt="capitalize">
        {row.gender}
      </Text>
    ),
  },
  {
    accessor: "company.name",
    header: "Company",
    size: 180,
    render: (row: any) => <Text size="sm">{row.company?.name || "-"}</Text>,
  },
  {
    accessor: "role",
    header: "Role",
    size: 100,
    render: (row: any) => (
      <Badge
        variant="light"
        color={
          row.role === "admin"
            ? "blue"
            : row.role === "moderator"
              ? "cyan"
              : "gray"
        }
      >
        {row.role || "user"}
      </Badge>
    ),
  },
];
