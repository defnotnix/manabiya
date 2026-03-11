"use client";

import {
  Paper,
  Group,
  Avatar,
  Stack,
  Text,
  Badge,
  ActionIcon,
  Menu,
} from "@mantine/core";
import {
  DotsThreeVerticalIcon,
  LockIcon,
  LockOpenIcon,
  PencilIcon,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { STUDENT_API } from "../../../module.config";

interface ProfileHeaderProps {
  student: any;
}

export function ProfileHeader({ student }: ProfileHeaderProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const lockMutation = useMutation({
    mutationFn: () => STUDENT_API.lockStudent(String(student.id)),
    onSuccess: () => {
      notifications.show({
        title: "Student Locked",
        message: "The student record has been locked.",
        color: "orange",
      });
      queryClient.invalidateQueries({ queryKey: ["student", String(student.id)] });
    },
    onError: () => {
      notifications.show({
        title: "Error",
        message: "Failed to lock student record.",
        color: "red",
      });
    },
  });

  const unlockMutation = useMutation({
    mutationFn: () => STUDENT_API.unlockStudent(String(student.id)),
    onSuccess: () => {
      notifications.show({
        title: "Student Unlocked",
        message: "The student record has been unlocked.",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["student", String(student.id)] });
    },
    onError: () => {
      notifications.show({
        title: "Error",
        message: "Failed to unlock student record.",
        color: "red",
      });
    },
  });

  const fullName = [student.first_name, student.middle_name, student.last_name]
    .filter(Boolean)
    .join(" ");

  return (
    <Paper withBorder p="lg">
      <Group justify="space-between" align="flex-start">
        <Group>
          <Avatar size="xl" radius="xl" color="blue">
            {student.first_name?.charAt(0)}
            {student.last_name?.charAt(0)}
          </Avatar>
          <Stack gap={4}>
            <Group gap="xs">
              <Text size="xl" fw={600}>
                {fullName}
              </Text>
              {student.locked && (
                <Badge color="orange" leftSection={<LockIcon size={12} />}>
                  Locked
                </Badge>
              )}
            </Group>
            <Text size="sm" c="dimmed">
              {student.student_code || "No code assigned"}
            </Text>
            <Text size="sm" c="dimmed">
              {student.email}
            </Text>
          </Stack>
        </Group>

        <Menu position="bottom-end" withinPortal>
          <Menu.Target>
            <ActionIcon variant="subtle" size="lg">
              <DotsThreeVerticalIcon size={20} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<PencilIcon size={14} />}
              onClick={() => router.push(`/admin/students/${student.id}/edit`)}
              disabled={student.locked}
            >
              Edit Student
            </Menu.Item>
            <Menu.Divider />
            {student.locked ? (
              <Menu.Item
                leftSection={<LockOpenIcon size={14} />}
                onClick={() => unlockMutation.mutate()}
                disabled={unlockMutation.isPending}
              >
                Unlock Record
              </Menu.Item>
            ) : (
              <Menu.Item
                leftSection={<LockIcon size={14} />}
                onClick={() => lockMutation.mutate()}
                disabled={lockMutation.isPending}
                color="orange"
              >
                Lock Record
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Paper>
  );
}
