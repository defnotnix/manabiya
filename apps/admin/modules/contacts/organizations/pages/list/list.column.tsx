import { Badge } from "@mantine/core";

export const columns = [
    {
        accessor: "key",
        title: "Key",
        width: 150,
    },
    {
        accessor: "name",
        title: "Name",
        width: 250,
    },
    {
        accessor: "organization_type",
        title: "Type",
        width: 150,
        render: (row: any) => (
            <Badge>{row.organization_type?.replace(/_/g, " ")}</Badge>
        ),
    },
    {
        accessor: "is_active",
        title: "Active",
        width: 100,
        render: (row: any) => (
            <Badge color={row.is_active ? "green" : "gray"}>
                {row.is_active ? "Yes" : "No"}
            </Badge>
        ),
    },
];
