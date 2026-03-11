"use client";

import {
  Paper,
  Text,
  Stack,
  Group,
  Button,
  Table,
  ActionIcon,
  Loader,
  Center,
  Progress,
} from "@mantine/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import { PlusIcon, PencilIcon, TrashIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { MARKING_API, MONTH_OPTIONS } from "../../../module.config";
import { MarkingModal } from "../../../modals/MarkingModal";

interface MarkingSectionProps {
  studentId: string;
  isLocked?: boolean;
}

export function MarkingSection({
  studentId,
  isLocked = false,
}: MarkingSectionProps) {
  const queryClient = useQueryClient();
  const [modalOpened, modalHandlers] = useDisclosure(false);
  const [editRecord, setEditRecord] = useState<any>(null);

  const { data: markings, isLoading } = useQuery({
    queryKey: ["markings", studentId],
    queryFn: async () => {
      const res = await MARKING_API.getMarkings(studentId);
      return res.data;
    },
  });

  const handleAdd = () => {
    setEditRecord(null);
    modalHandlers.open();
  };

  const handleEdit = (record: any) => {
    setEditRecord(record);
    modalHandlers.open();
  };

  const handleDelete = async (id: string) => {
    try {
      await MARKING_API.deleteMarking(id);
      queryClient.invalidateQueries({ queryKey: ["markings", studentId] });
      notifications.show({
        title: "Deleted",
        message: "Attendance record deleted.",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to delete attendance record.",
        color: "red",
      });
    }
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["markings", studentId] });
    modalHandlers.close();
  };

  const getMonthName = (month: number) => {
    const found = MONTH_OPTIONS.find((m) => m.value === month);
    return found?.label || month;
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 90) return "green";
    if (percent >= 75) return "blue";
    if (percent >= 60) return "yellow";
    return "red";
  };

  if (isLoading) {
    return (
      <Center p="xl">
        <Loader />
      </Center>
    );
  }

  return (
    <>
      <Stack gap="md">
        <Group justify="space-between">
          <Text size="sm" fw={600}>
            Attendance Records
          </Text>
          <Button
            size="xs"
            leftSection={<PlusIcon size={14} />}
            onClick={handleAdd}
            disabled={isLocked}
          >
            Add Attendance
          </Button>
        </Group>

        {markings && markings.length > 0 ? (
          <Paper withBorder>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Period</Table.Th>
                  <Table.Th>Total Days</Table.Th>
                  <Table.Th>Class Hours</Table.Th>
                  <Table.Th>Present</Table.Th>
                  <Table.Th>Absent</Table.Th>
                  <Table.Th>Attendance %</Table.Th>
                  <Table.Th w={100}>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {markings.map((marking: any) => {
                  const percent = parseFloat(marking.attendance_percent) || 0;
                  return (
                    <Table.Tr key={marking.id}>
                      <Table.Td>
                        {getMonthName(marking.month)} {marking.year}
                      </Table.Td>
                      <Table.Td>{marking.total_days}</Table.Td>
                      <Table.Td>{marking.class_hours}</Table.Td>
                      <Table.Td>{marking.present}</Table.Td>
                      <Table.Td>{marking.absent}</Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Progress
                            value={percent}
                            color={getProgressColor(percent)}
                            size="sm"
                            w={60}
                          />
                          <Text size="xs">{percent.toFixed(1)}%</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4}>
                          <ActionIcon
                            size="sm"
                            variant="subtle"
                            onClick={() => handleEdit(marking)}
                            disabled={isLocked}
                          >
                            <PencilIcon size={14} />
                          </ActionIcon>
                          <ActionIcon
                            size="sm"
                            variant="subtle"
                            color="red"
                            onClick={() => handleDelete(String(marking.id))}
                            disabled={isLocked}
                          >
                            <TrashIcon size={14} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </Paper>
        ) : (
          <Paper withBorder p="xl">
            <Text c="dimmed" ta="center">
              No attendance records found.
            </Text>
          </Paper>
        )}
      </Stack>

      <MarkingModal
        opened={modalOpened}
        onClose={modalHandlers.close}
        onSuccess={handleSuccess}
        studentId={studentId}
        editRecord={editRecord}
      />
    </>
  );
}
