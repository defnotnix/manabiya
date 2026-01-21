"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Box, Stack, Title, Text, Badge, Button, Group, Loader, Center } from "@mantine/core";
import { APPLICANT_MODULE_CONFIG, APPLICANT_API } from "../../module.config";

export function ViewPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data: applicant, isLoading } = useQuery({
    queryKey: ["applicant", id],
    queryFn: async () => {
      const response = await APPLICANT_API.getApplicant(id);
      return response?.data;
    },
  });

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  if (!applicant) {
    return (
      <Center h="100vh">
        <Text>Applicant not found</Text>
      </Center>
    );
  }

  return (
    <Box p="lg">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={1}>{applicant.fullName}</Title>
            <Text c="dimmed" size="sm">
              ID: {applicant.id}
            </Text>
          </div>
          <Group>
            <Badge>{applicant.status}</Badge>
            <Button
              variant="default"
              onClick={() => router.push(`/admin/applicant/${id}/edit`)}
            >
              Edit
            </Button>
            <Button variant="default" onClick={() => router.back()}>
              Back
            </Button>
          </Group>
        </Group>

        {/* Profile Information */}
        <Box p="md" style={{ border: "1px solid #ddd", borderRadius: "8px" }}>
          <Title order={3} mb="md">
            Profile Information
          </Title>
          <Stack gap="md">
            <div>
              <Text size="sm" c="dimmed">
                Email
              </Text>
              <Text>{applicant.email}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                Phone
              </Text>
              <Text>{applicant.phone || "N/A"}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                Status
              </Text>
              <Text>{applicant.status}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                Created At
              </Text>
              <Text>{new Date(applicant.createdAt).toLocaleDateString()}</Text>
            </div>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
