"use client";

import { Paper, Text, SimpleGrid, Box, Divider } from "@mantine/core";

interface BasicInfoSectionProps {
  student: any;
}

function InfoField({ label, value }: { label: string; value: any }) {
  return (
    <Box>
      <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
        {label}
      </Text>
      <Text size="sm">{value || "-"}</Text>
    </Box>
  );
}

export function BasicInfoSection({ student }: BasicInfoSectionProps) {
  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  return (
    <Paper withBorder p="md">
      <Text size="sm" fw={600} mb="sm">
        Basic Information
      </Text>
      <Divider mb="md" />
      <SimpleGrid cols={3} spacing="md">
        <InfoField label="Student Code" value={student.student_code} />
        <InfoField label="First Name" value={student.first_name} />
        <InfoField label="Middle Name" value={student.middle_name} />
        <InfoField label="Last Name" value={student.last_name} />
        <InfoField label="Date of Birth" value={formatDate(student.date_of_birth)} />
        <InfoField label="Gender" value={student.gender} />
      </SimpleGrid>
      <SimpleGrid cols={2} spacing="md" mt="md">
        <InfoField label="Current Address" value={student.current_address} />
        <InfoField label="Permanent Address" value={student.permanent_address} />
      </SimpleGrid>
      <SimpleGrid cols={2} spacing="md" mt="md">
        <InfoField label="Date of Admission" value={formatDate(student.date_of_admission)} />
        <InfoField label="Date of Completion" value={formatDate(student.date_of_completion)} />
      </SimpleGrid>
    </Paper>
  );
}
