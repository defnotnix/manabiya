import { Badge } from "@mantine/core";

export const columns = [
  {
    accessor: "id",
    header: "ID",
  },
  {
    accessor: "name",
    header: "Name",
  },
  {
    accessor: "permissions",
    header: "Permissions",

    render: (row: any) => (
      <Badge variant="light" color="blue">
        {Array.isArray(row.permissions) ? row.permissions.length : 0}{" "}
        Permissions
      </Badge>
    ),
  },
];
