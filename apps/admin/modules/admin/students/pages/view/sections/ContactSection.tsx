"use client";

import { Paper, Text, SimpleGrid, Box, Divider } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { CONTACT_API } from "../../../module.config";

interface ContactSectionProps {
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

export function ContactSection({ student }: ContactSectionProps) {
  const { data: contact } = useQuery({
    queryKey: ["contact", student.id],
    queryFn: async () => {
      const res = await CONTACT_API.getContactByStudent(String(student.id));
      return res.data;
    },
  });

  return (
    <Paper withBorder p="md">
      <Text size="sm" fw={600} mb="sm">
        Contact Information
      </Text>
      <Divider mb="md" />
      <SimpleGrid cols={3} spacing="md">
        <InfoField label="Email" value={student.email} />
        <InfoField label="Contact" value={student.contact} />
        <InfoField label="Phone Number" value={contact?.phone_number} />
      </SimpleGrid>

      <Text size="xs" fw={600} c="dimmed" mt="lg" mb="sm">
        Emergency Contact
      </Text>
      <SimpleGrid cols={3} spacing="md">
        <InfoField label="Name" value={contact?.emergency_contact_name} />
        <InfoField label="Relationship" value={contact?.emergency_contact_relation} />
        <InfoField label="Phone" value={contact?.emergency_contact_phone} />
      </SimpleGrid>
    </Paper>
  );
}
