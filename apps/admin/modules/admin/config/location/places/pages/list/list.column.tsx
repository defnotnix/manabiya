import { Badge, Text } from "@mantine/core";

export const columns = [
  {
    accessor: "place_type.name",
    header: "Type",
    size: 150,
    render: (row: any) => row.place_type?.name || "-",
  },
  {
    accessor: "name",
    header: "Name",
    size: 200,
  },
  {
    accessor: "geo_unit.display_name", // Nested accessor support assumed or render needed
    header: "Geo Unit",
    size: 200,
    render: (row: any) => row.geo_unit?.display_name || "-",
  },
  {
    accessor: "coordinates",
    header: "Coordinates",
    size: 150,
    render: (row: any) => {
      if (!row.point) return "-";
      return `${row.point.lat.toFixed(4)}, ${row.point.lng.toFixed(4)}`;
    },
  },
];
