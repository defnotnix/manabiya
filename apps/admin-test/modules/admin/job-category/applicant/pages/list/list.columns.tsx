/**
 * Applicant List Table Columns Configuration
 *
 * Column definition format:
 * - accessor: The data field key from the record
 * - header: The column header label to display
 * - size: Column width in pixels (optional)
 * - render: Custom render function (optional) - receives (row, index) parameters
 */

export const applicantListColumns = [
  {
    accessor: "id",
    header: "ID",
    size: 100,
  },
  {
    accessor: "fullName",
    header: "Full Name",
    size: 200,
  },
  {
    accessor: "email",
    header: "Email",
    size: 200,
  },
  {
    accessor: "status",
    header: "Status",
    size: 120,
    // Example custom render:
    // render: (row: any) => <Badge>{row.status}</Badge>,
  },
  {
    accessor: "createdAt",
    header: "Created At",
    size: 150,
    // Example custom render for dates:
    // render: (row: any) => new Date(row.createdAt).toLocaleDateString(),
  },
];
