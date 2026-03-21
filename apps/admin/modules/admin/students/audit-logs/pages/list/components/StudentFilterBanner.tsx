"use client";

import { Group, Button, Text, Container, Paper, useMantineColorScheme } from "@mantine/core";
import { useRouter } from "next/navigation";
import { XIcon, ArrowLeftIcon } from "@phosphor-icons/react";

interface StudentFilterBannerProps {
  studentId: string | null;
  studentCode: string;
  studentName: string;
}

export function StudentFilterBanner({
  studentId,
  studentCode,
  studentName,
}: StudentFilterBannerProps) {
  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();

  if (!studentId) return null;

  return (
    <Paper bg={colorScheme === "dark" ? "gray.9" : "brand.0"}>
      <Container size="xl">
        <Group gap="xs" justify="space-between">
          <Button
            variant="subtle"
            size="xs"
            leftSection={<ArrowLeftIcon size={14} />}
            onClick={() => router.push("/admin/students")}
          >
            Back to Students
          </Button>
          <Text size="sm">Activities for {studentName}</Text>
        </Group>
      </Container>
    </Paper>
  );
}
