"use client";

import {
  Stack,
  Paper,
  Text,
  Group,
  Divider,
  SimpleGrid,
  Box,
  Table,
  ScrollArea,
} from "@mantine/core";
import { FormWrapper } from "@settle/core";
import { useQuery } from "@tanstack/react-query";
import { BATCH_API } from "../../module.config";
import dayjs from "dayjs";

interface ReviewFieldProps {
  label: string;
  value: string | number | null | undefined;
}

function ReviewField({ label, value }: ReviewFieldProps) {
  return (
    <Box>
      <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
        {label}
      </Text>
      <Text size="sm">{value || "-"}</Text>
    </Box>
  );
}

export function Step5Review() {
  const form = FormWrapper.useForm();
  const values = form.getValues();

  // Fetch batch name for display
  const { data: batchData } = useQuery({
    queryKey: ["batch", values.batch],
    queryFn: async () => {
      if (!values.batch) return null;
      const res = await BATCH_API.getBatch(String(values.batch));
      return res.data;
    },
    enabled: !!values.batch,
  });

  const formatDate = (date: any) => {
    if (!date) return "-";
    if (typeof date === "string") return date;
    return date.toLocaleDateString();
  };

  return (
    <Stack gap="lg">
      <Text size="lg" fw={600}>
        Review Student Information
      </Text>

      {/* Basic Information */}
      <Paper withBorder p="md">
        <Text size="sm" fw={600} mb="sm">
          Basic Information
        </Text>
        <Divider mb="md" />
        <SimpleGrid cols={3} spacing="md">
          <ReviewField label="Student Code" value={values.student_code} />
          <ReviewField label="First Name" value={values.first_name} />
          <ReviewField label="Middle Name" value={values.middle_name} />
          <ReviewField label="Last Name" value={values.last_name} />
          <ReviewField
            label="Date of Birth"
            value={formatDate(values.date_of_birth)}
          />
          <ReviewField label="Gender" value={values.gender} />
        </SimpleGrid>
        <SimpleGrid cols={2} spacing="md" mt="md">
          <ReviewField label="Current Address" value={values.current_address} />
          <ReviewField
            label="Permanent Address"
            value={values.permanent_address}
          />
        </SimpleGrid>
      </Paper>

      {/* Contact Information */}
      <Paper withBorder p="md">
        <Text size="sm" fw={600} mb="sm">
          Contact Information
        </Text>
        <Divider mb="md" />
        <SimpleGrid cols={3} spacing="md">
          <ReviewField label="Email" value={values.email} />
          <ReviewField label="Contact" value={values.contact} />
          <ReviewField label="Phone Number" value={values.phone_number} />
        </SimpleGrid>
        <Text size="xs" fw={600} c="dimmed" mt="md" mb="sm">
          Emergency Contact
        </Text>
        <SimpleGrid cols={3} spacing="md">
          <ReviewField
            label="Name"
            value={values.emergency_contact_name}
          />
          <ReviewField
            label="Relationship"
            value={values.emergency_contact_relation}
          />
          <ReviewField
            label="Phone"
            value={values.emergency_contact_phone}
          />
        </SimpleGrid>
      </Paper>

      {/* Background Information */}
      <Paper withBorder p="md">
        <Text size="sm" fw={600} mb="sm">
          Background Information
        </Text>
        <Divider mb="md" />
        <SimpleGrid cols={3} spacing="md">
          <ReviewField label="Experiences" value={values.experiences?.length ? `${values.experiences.length} records` : "None"} />
          <ReviewField label="Educations" value={values.educations?.length ? `${values.educations.length} records` : "None"} />
          <ReviewField label="Family Members" value={values.family_members?.length ? `${values.family_members.length} members` : "None"} />
        </SimpleGrid>

        {/* Render actual Experience records if any */}
        {values.experiences && values.experiences.length > 0 && (
          <Box mt="md">
            <Text size="xs" fw={600} c="dimmed" mb="xs">EXPERIENCE DETAILS</Text>
            <Table striped withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Company</Table.Th>
                  <Table.Th>Role</Table.Th>
                  <Table.Th>Start</Table.Th>
                  <Table.Th>End</Table.Th>
                  <Table.Th>Notes</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {values.experiences.map((exp: any, i: number) => (
                  <Table.Tr key={i}>
                    <Table.Td>{exp.company}</Table.Td>
                    <Table.Td>{exp.role}</Table.Td>
                    <Table.Td>{formatDate(exp.start_period)}</Table.Td>
                    <Table.Td>{formatDate(exp.end_period) || "Present"}</Table.Td>
                    <Table.Td>{exp.notes || "-"}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Box>
        )}
      </Paper>

      {/* Enrollment Information */}
      <Paper withBorder p="md">
        <Text size="sm" fw={600} mb="sm">
          Enrollment & Academic Information
        </Text>
        <Divider mb="md" />
        <SimpleGrid cols={3} spacing="md">
          <ReviewField label="Batch" value={batchData?.name} />
          <ReviewField
            label="Date of Admission"
            value={formatDate(values.date_of_admission)}
          />
          <ReviewField
            label="Date of Completion"
            value={formatDate(values.date_of_completion)}
          />
          <ReviewField label="Grading" value={(values.grading_grammar || values.grading_conversation || values.grading_composition || values.grading_listening || values.grading_reading || values.grading_remarks) ? "Recorded" : "None"} />
          <ReviewField label="Markings" value={values.markings?.length ? `${values.markings.length} records` : "None"} />
        </SimpleGrid>

        {/* Render actual Marking table if any */}
        {(values.markings && values.markings.filter((m: any) => m.total_days !== null || m.class_hours || m.present !== null || m.absent !== null || m.attendance_percent).length > 0) && (
          <Box mt="md">
            <Text size="xs" fw={600} c="dimmed" mb="xs">CLASS MARKING SUMMARY</Text>
            <ScrollArea type="auto" offsetScrollbars>
              <Table striped withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Month/Year</Table.Th>
                    <Table.Th>Total Days</Table.Th>
                    <Table.Th>Class Hrs</Table.Th>
                    <Table.Th>Present</Table.Th>
                    <Table.Th>Absent</Table.Th>
                    <Table.Th>Attend. %</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {values.markings.filter((m: any) => m.total_days !== null || m.class_hours || m.present !== null || m.absent !== null || m.attendance_percent).map((mark: any, i: number) => (
                    <Table.Tr key={i}>
                      <Table.Td>{dayjs().year(mark.year).month(mark.month - 1).format("MMM YYYY")}</Table.Td>
                      <Table.Td>{mark.total_days || "-"}</Table.Td>
                      <Table.Td>{mark.class_hours || "-"}</Table.Td>
                      <Table.Td>{mark.present ?? "-"}</Table.Td>
                      <Table.Td>{mark.absent ?? "-"}</Table.Td>
                      <Table.Td>{mark.attendance_percent ? `${mark.attendance_percent}%` : "-"}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Box>
        )}
      </Paper>
    </Stack>
  );
}
