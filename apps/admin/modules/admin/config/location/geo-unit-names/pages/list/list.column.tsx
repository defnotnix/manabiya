import { Badge } from "@mantine/core";

export const columns = [
  {
    accessor: "geo_unit",
    header: "Geo Unit ID",
    size: 100,
    render: (row: any) => row.geo_unit || "-",
  },
  {
    accessor: "language",
    header: "Language",
    size: 90,
    render: (row: any) => (
      <Badge color="blue" size="sm">
        {row.language}
      </Badge>
    ),
  },
  {
    accessor: "name",
    header: "Name",
    size: 200,
  },
  {
    accessor: "kind",
    header: "Kind",
    size: 100,
  },
  {
    accessor: "normalized",
    header: "Normalized",
    size: 200,
  },
];
