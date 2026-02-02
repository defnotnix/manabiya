import { Badge, Group } from "@mantine/core";

export const columns = [
  {
    accessor: "id",
    header: "ID",
    size: 60,
  },
  {
    accessor: "username",
    header: "Username",
    size: 150,
  },
  {
    accessor: "email",
    header: "Email",
    size: 200,
  },
  {
    accessor: "first_name",
    header: "Name",
    size: 180,
    render: (row: any) => {
      const full = [row.first_name, row.last_name].filter(Boolean).join(" ");
      return full || "-";
    },
  },
  {
    accessor: "is_active",
    header: "Status",
    size: 100,
    render: (row: any) => (
      <Group gap="xs">
        {row.is_active && (
          <Badge size="sm" color="green">
            Active
          </Badge>
        )}
        {row.is_staff && (
          <Badge size="sm" color="blue">
            Staff
          </Badge>
        )}
        {row.is_superuser && (
          <Badge size="sm" color="violet">
            Super
          </Badge>
        )}
        {row.is_disabled && (
          <Badge size="sm" color="red">
            Disabled
          </Badge>
        )}
      </Group>
    ),
  },
  {
    accessor: "groups",
    header: "Roles",
    size: 100,
    render: (row: any) => (
      <Badge variant="outline" color="gray">
        {Array.isArray(row.groups) ? row.groups.length : 0} Groups
      </Badge>
    ),
  },
  {
    accessor: "user_permissions",
    header: "Permissions",
    size: 150,
    render: (row: any) => {
      const permCount = Array.isArray(row.user_permissions) ? row.user_permissions.length : 0;
      if (permCount > 0) {
        return (
          <Badge size="sm" color="cyan" variant="light">
            Polling Station ({permCount})
          </Badge>
        );
      }
      return <span style={{ color: "var(--mantine-color-dimmed)" }}>-</span>;
    },
  },
];
