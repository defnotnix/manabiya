import { Badge } from "@mantine/core";

export const batchesListColumns = [
  {
    accessor: "name",
    title: "Batch Name",
    width: 150,
  },
  {
    accessor: "shift",
    title: "Shift",
    width: 100,
    render: (record: any) => (
      <Badge size="sm" variant="light">
        {record.shift?.charAt(0).toUpperCase() + record.shift?.slice(1) || "-"}
      </Badge>
    ),
  },
  {
    accessor: "course",
    title: "Course",
    width: 150,
  },
  {
    accessor: "instructor",
    title: "Instructor",
    width: 130,
  },
  {
    accessor: "total_days",
    title: "Total Days",
    width: 100,
  },
  {
    accessor: "per_class_hours",
    title: "Hours/Session",
    width: 100,
  },
  {
    accessor: "is_active",
    title: "Status",
    width: 80,
    render: (record: any) => (
      <Badge color={record.is_active ? "green" : "gray"} size="sm">
        {record.is_active ? "Active" : "Inactive"}
      </Badge>
    ),
  },
];
