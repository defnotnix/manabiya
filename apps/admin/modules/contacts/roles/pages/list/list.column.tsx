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
