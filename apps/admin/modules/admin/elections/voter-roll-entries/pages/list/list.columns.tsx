import { Stack, Text } from "@mantine/core";

export const voterRollEntryListColumns = [
  { accessor: "serial_no", header: "S.N.", size: 60 },
  { accessor: "voter_no", header: "Voter No", size: 120 },
  {
    accessor: "name_ne",
    header: "Name",
    size: 200,
    render: (record: any) => (
      <Stack gap={0}>
        <Text size="sm" fw={500}>
          {record.name_ne}
        </Text>
        {record.name_en && (
          <Text size="xs" c="dimmed">
            {record.name_en}
          </Text>
        )}
      </Stack>
    ),
  },
  { accessor: "age", header: "Age", size: 60 },
  {
    accessor: "gender_ne",
    header: "Gender",
    size: 100,
    render: (record: any) => (
      <Stack gap={0}>
        <Text size="sm">{record.gender_ne || "-"}</Text>
        {record.gender_en && (
          <Text size="xs" c="dimmed">
            {record.gender_en}
          </Text>
        )}
      </Stack>
    ),
  },
  {
    accessor: "parents",
    header: "Parents",
    size: 250,
    render: (record: any) => (
      <Stack gap={2}>
        {record.father_name_ne && (
          <Text size="xs">
            <Text span c="dimmed">
              Father:{" "}
            </Text>
            {record.father_name_ne}
            {record.father_name_en && (
              <Text span c="dimmed">
                {" "}
                ({record.father_name_en})
              </Text>
            )}
          </Text>
        )}
        {record.mother_name_ne && (
          <Text size="xs">
            <Text span c="dimmed">
              Mother:{" "}
            </Text>
            {record.mother_name_ne}
            {record.mother_name_en && (
              <Text span c="dimmed">
                {" "}
                ({record.mother_name_en})
              </Text>
            )}
          </Text>
        )}
        {!record.father_name_ne && !record.mother_name_ne && (
          <Text size="xs" c="dimmed">
            -
          </Text>
        )}
      </Stack>
    ),
  },
  {
    accessor: "spouse_name_ne",
    header: "Spouse",
    size: 150,
    render: (record: any) => (
      <Stack gap={0}>
        <Text size="sm">{record.spouse_name_ne || "-"}</Text>
        {record.spouse_name_en && (
          <Text size="xs" c="dimmed">
            {record.spouse_name_en}
          </Text>
        )}
      </Stack>
    ),
  },
];
