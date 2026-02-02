import { Badge } from "@mantine/core";

export const columns = [
  {
    accessor: "id",
    header: "ID",
    size: 70,
  },
  {
    accessor: "geo_unit.display_name", // Nested accessor support assumed or render needed
    header: "Geo Unit",
    size: 200,
    render: (row: any) => row.geo_unit?.display_name || row.geo_unit?.id || "-",
  },
  {
    accessor: "source",
    header: "Source",
    size: 100,
  },
  {
    accessor: "accuracy_m",
    header: "Accuracy (m)",
    size: 100,
  },
  {
    accessor: "created_at",
    header: "Created At",
    size: 150,
    render: (row: any) => new Date(row.created_at).toLocaleDateString(),
  },
];
