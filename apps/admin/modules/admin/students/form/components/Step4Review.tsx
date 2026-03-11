"use client";

import {
  Stack,
  Paper,
  Text,
  Group,
  Divider,
  SimpleGrid,
  Box,
} from "@mantine/core";
import { FormWrapper } from "@settle/core";
import { useQuery } from "@tanstack/react-query";
import { BATCH_API } from "../../module.config";

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

export function Step4Review() {
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

      {/* Enrollment Information */}
      <Paper withBorder p="md">
        <Text size="sm" fw={600} mb="sm">
          Enrollment Information
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
        </SimpleGrid>
      </Paper>
    </Stack>
  );
}
