import { Badge } from "@mantine/core";

export const columns = [
  {
    accessor: "id",
    header: "ID",
    size: 70,
  },
  {
    accessor: "key",
    header: "Key",
    size: 150,
  },
  {
    accessor: "name",
    header: "Name",
    size: 200,
  },
  {
    accessor: "unit",
    header: "Unit",
    size: 100,
    render: (row: any) => <Badge variant="outline">{row.unit || "-"}</Badge>,
  },
];
