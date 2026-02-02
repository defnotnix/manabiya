import { Badge, Text } from "@mantine/core";

export const columns = [
  {
    accessor: "official_code",
    header: "Code",
    size: 90,
  },
  {
    accessor: "display_name",
    header: "Display Name",
    size: 200,
  },
  {
    accessor: "unit_type.name",
    header: "Type",
    size: 100,
    render: (row: any) => row.unit_type?.name || "-",
  },
  {
    accessor: "parent",
    header: "Parent",
    size: 180,
    render: (row: any) => row.parent?.display_name || "-",
  },
  {
    accessor: "ward_no",
    header: "Ward No",
    size: 90,
    render: (row: any) => row.ward_no ?? "-",
  },
  {
    accessor: "is_active",
    header: "Active",
    size: 80,
    render: (row: any) =>
      row.is_active ? (
        <Badge color="teal" size="xs">
          Yes
        </Badge>
      ) : (
        <Badge color="red" size="xs">
          No
        </Badge>
      ),
  },
];
