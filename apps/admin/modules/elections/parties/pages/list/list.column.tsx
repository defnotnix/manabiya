import { Badge } from "@mantine/core";

export const columns = [
    {
        accessor: "name",
        title: "Name",
        width: 200,
    },
    {
        accessor: "abbrev",
        title: "Abbrev",
        width: 80,
        render: (row: any) => row.abbrev ? <Badge variant="light">{row.abbrev}</Badge> : "-",
    },
    {
        accessor: "leader_name",
        title: "Leader",
        width: 150,
        render: (row: any) => row.leader_name || "-",
    },
    {
        accessor: "founded_year",
        title: "Founded",
        width: 100,
        render: (row: any) => row.founded_year || "-",
    },
    {
        accessor: "political_position",
        title: "Position",
        width: 150,
        render: (row: any) => row.political_position || "-",
    },
    {
        accessor: "ideology",
        title: "Ideology",
        width: 200,
        render: (row: any) => row.ideology || "-",
    },
];
