export const voterRollEntryListColumns = [
  { accessor: "voter_no", header: "Voter No", size: 120 },
  { accessor: "name_en", header: "Name", size: 180 },
  { accessor: "age", header: "Age", size: 80 },
  { accessor: "gender", header: "Gender", size: 80 },
  { accessor: "father_name_en", header: "Father's Name", size: 180 },
  { accessor: "polling_station_id", header: "Polling ID", size: 100 },
  {
    accessor: "phone_number",
    header: "Phone",
    size: 150,
    render: (record: any) => record.phone_number || "-",
  },
];
