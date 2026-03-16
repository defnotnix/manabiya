import { Badge, Group } from "@mantine/core";

export const usersListColumns = [
  {
    accessor: "username",
    title: "Username",
    width: 150,
  },
  {
    accessor: "email",
    title: "Email",
    width: 200,
  },
  {
    accessor: "first_name",
    title: "First Name",
    width: 130,
  },
  {
    accessor: "last_name",
    title: "Last Name",
    width: 130,
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
];
