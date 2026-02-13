import { Badge } from "@mantine/core";

export const columns = [
    {
        accessor: "name",
        title: "Name",
        width: 200,
    },
    {
        accessor: "primary_phone",
        title: "Phone",
        width: 150,
    },
    {
        accessor: "email",
        title: "Email",
        width: 200,
    },
    {
        accessor: "address",
        title: "Address",
        width: 200,
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
