export const columns = [
  {
    accessorKey: "student_code",
    header: "Code",
    size: 120,
  },
  {
    accessorKey: "full_name",
    header: "Full Name",
    size: 200,
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 200,
  },
  {
    accessorKey: "contact",
    header: "Contact",
    size: 150,
  },
  {
    accessorKey: "date_of_admission",
    header: "Admission Date",
    size: 130,
  },
  {
    accessorKey: "actions",
    header: "Document",
    size: 100,
    
  },
];

export const filterList = [
  {
    key: "batch",
    label: "Batch",
    type: "select" as const,
  },
  {
    key: "locked",
    label: "Locked",
    type: "select" as const,
    options: [
      { value: "true", label: "Locked" },
      { value: "false", label: "Unlocked" },
    ],
  },
];

export const tabs = [
  { label: "All Students", filter: {} },
];
