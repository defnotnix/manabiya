import { Badge, Text } from "@mantine/core";

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
    render: (row: any) => row.geo_unit?.display_name || "-",
  },
  {
    accessor: "metric.name",
    header: "Metric",
    size: 150,
    render: (row: any) => row.metric?.name || "-",
  },
  {
    accessor: "year",
    header: "Year",
    size: 90,
  },
  {
    accessor: "value_num",
    header: "Value",
    size: 120,
    render: (row: any) => <Text fw={500}>{row.value_num}</Text>,
  },
  {
    accessor: "source",
    header: "Source",
    size: 100,
    render: (row: any) => (
      <Badge color="gray" size="sm" variant="light">
        {row.source}
      </Badge>
    ),
  },
];
