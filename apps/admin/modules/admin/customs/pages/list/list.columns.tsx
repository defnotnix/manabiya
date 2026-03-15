import { Badge } from "@mantine/core";

export const customsListColumns = [
  {
    accessor: "id",
    title: "ID",
    width: 80,
  },
  {
    accessor: "name",
    title: "Name",
    width: 200,
  },
  {
    accessor: "description",
    title: "Description",
    width: 300,
  },
  {
    accessor: "is_active",
    title: "Status",
    width: 120,
    render: (record: any) => (
      <Badge color={record.is_active ? "green" : "gray"}>
        {record.is_active ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    accessor: "documents",
    title: "Documents",
    width: 120,
  },
];
