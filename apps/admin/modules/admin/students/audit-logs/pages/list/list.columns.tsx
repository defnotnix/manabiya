import { Badge } from "@mantine/core";

export const auditLogColumns = [
  {
    accessor: "id",
    title: "ID",
    width: 60,
  },
  {
    accessor: "created_at",
    title: "Date",
    width: 180,
    render: (record: any) => new Date(record.created_at).toLocaleString(),
  },
  {
    accessor: "student_code",
    title: "Student Code",
    width: 130,
  },
  {
    accessor: "action",
    title: "Action",
    width: 100,
    render: (record: any) => (
      <Badge size="sm" color={getActionColor(record.action)}>
        {record.action}
      </Badge>
    ),
  },
  {
    accessor: "entity_type",
    title: "Entity Type",
    width: 140,
  },
  {
    accessor: "entity_id",
    title: "Entity ID",
    width: 100,
  },
  {
    accessor: "actor_username",
    title: "Actor",
    width: 140,
  },
];

export const filterList = [
  {
    key: "action",
    label: "Action",
    type: "select" as const,
    options: [
      { value: "create", label: "Create" },
      { value: "update", label: "Update" },
      { value: "delete", label: "Delete" },
      { value: "lock", label: "Lock" },
      { value: "unlock", label: "Unlock" },
    ],
  },
  {
    key: "entity_type",
    label: "Entity Type",
    type: "text" as const,
  },
  {
    key: "student",
    label: "Student",
    type: "text" as const,
  },
  {
    key: "actor",
    label: "Actor",
    type: "text" as const,
  },
];

function getActionColor(action: string): string {
  switch (action?.toLowerCase()) {
    case "create":
      return "green";
    case "update":
      return "blue";
    case "delete":
      return "red";
    case "lock":
      return "orange";
    case "unlock":
      return "teal";
    default:
      return "gray";
  }
}
