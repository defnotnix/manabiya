"use client";

import { Alert, Button, Group, Text } from "@mantine/core";
import { LockIcon, LockOpenIcon } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { STUDENT_API } from "../module.config";

interface LockedStudentBannerProps {
  studentId: string;
  lockedBy?: string | null;
  lockedAt?: string | null;
  onUnlock?: () => void;
}

export function LockedStudentBanner({
  studentId,
  lockedBy,
  lockedAt,
  onUnlock,
}: LockedStudentBannerProps) {
  const queryClient = useQueryClient();

  const unlockMutation = useMutation({
    mutationFn: () => STUDENT_API.unlockStudent(studentId),
    onSuccess: () => {
      notifications.show({
        title: "Student Unlocked",
        message: "The student record is now editable.",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["student", studentId] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      onUnlock?.();
    },
    onError: () => {
      notifications.show({
        title: "Error",
        message: "Failed to unlock student record. Only admins can unlock.",
        color: "red",
      });
    },
  });

  return (
    <Alert
      icon={<LockIcon size={20} />}
      title="This student record is locked"
      color="orange"
      mb="md"
    >
      <Group justify="space-between" align="center" wrap="wrap">
        <Text size="sm">
          Editing is disabled.
          {lockedBy && ` Locked by: ${lockedBy}`}
          {lockedAt && ` on ${new Date(lockedAt).toLocaleDateString()}`}
        </Text>
        <Button
          size="xs"
          variant="light"
          leftSection={<LockOpenIcon size={14} />}
          loading={unlockMutation.isPending}
          onClick={() => unlockMutation.mutate()}
        >
          Unlock Record
        </Button>
      </Group>
    </Alert>
  );
}
