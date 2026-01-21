import { MantineTheme, Select } from "@mantine/core";

export const agendaListColumns = [
  {
    accessor: "title",
    header: "Title",
    size: 250,
  },
  {
    accessor: "district.name",
    header: "District",
    size: 150,
    render: (row: any) => row.district?.name || "-",
  },
  {
    accessor: "status",
    header: "Status",
    size: 120,
    cellsStyle: (record: any) => ({
      background:
        record.status === "approved"
          ? "var(--mantine-color-blue-0)"
          : "var(--mantine-color-red-0)",
    }),
    render: (row: any) => (
      <Select
        variant="unstyled"
        radius={0}
        size="xs"
        px="sm"
        fw={800}
        mt={-11}
        mb={-11}
        ml={-11}
        mr={-11}
        data={[
          { value: "pending", label: "Pending" },
          { value: "approved", label: "Approved" },
          { value: "rejected", label: "Rejected" },
        ]}
        value={row.status}
      />
    ),
  },
  {
    accessor: "submitted_by.full_name",
    header: "Submitted By",
    size: 150,
    render: (row: any) => row.submitted_by?.full_name || "-",
  },
  {
    accessor: "view_count",
    header: "Views",
    size: 100,
    render: (row: any) => row.view_count || 0,
  },
  {
    accessor: "solution_count",
    header: "Solutions",
    size: 100,
    render: (row: any) => row.solution_count || 0,
  },
  {
    accessor: "created_at",
    header: "Created",
    size: 150,
    render: (row: any) => {
      if (!row.created_at) return "-";
      return new Date(row.created_at).toLocaleDateString();
    },
  },
];
