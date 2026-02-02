import { Badge } from "@mantine/core";

export const placeListColumns = [
  {
    accessor: "id",
    header: "ID",
    size: 80,
  },
  {
    accessor: "name",
    header: "Name",
    size: 200,
  },
  {
    accessor: "place_type",
    header: "Type",
    size: 150,
    render: (row: any) => <Badge color="teal">{row.place_type}</Badge>,
  },
  {
    accessor: "geo_unit_id", // Or expanded object if available
    header: "Geo Unit",
    size: 100,
  },
  {
    accessor: "point",
    header: "Location",
    size: 150,
    render: (row: any) =>
      row.point ? `${row.point.lat}, ${row.point.lng}` : "N/A",
  },
];
