import { Badge } from "@mantine/core";

export const geoUnitListColumns = [
  {
    accessor: "id",
    header: "ID",
    size: 80,
  },
  {
    accessor: "display_name",
    header: "Name",
    size: 200,
  },
  {
    accessor: "unit_type",
    header: "Type",
    size: 150,
    render: (row: any) => <Badge color="blue">{row.unit_type}</Badge>,
  },
  {
    accessor: "official_code",
    header: "Code",
    size: 120,
  },
  {
    accessor: "ward_no",
    header: "Ward No",
    size: 100,
  },
  {
    accessor: "parent_id",
    header: "Parent ID",
    size: 100,
  },
];
