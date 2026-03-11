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
  Badge,
} from "@mantine/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import { PlusIcon, PencilIcon, TrashIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { GRADING_API } from "../../../module.config";
import { GradingModal } from "../../../modals/GradingModal";

interface GradingSectionProps {
  studentId: string;
  isLocked?: boolean;
}

function GradeBadge({ grade }: { grade: string }) {
  const colors: Record<string, string> = {
    A: "green",
    B: "blue",
    C: "yellow",
    D: "red",
  };
  return (
    <Badge size="sm" color={colors[grade] || "gray"}>
      {grade}
    </Badge>
  );
}

export function GradingSection({
  studentId,
  isLocked = false,
}: GradingSectionProps) {
  const queryClient = useQueryClient();
  const [modalOpened, modalHandlers] = useDisclosure(false);
  const [editRecord, setEditRecord] = useState<any>(null);

  const { data: gradings, isLoading } = useQuery({
    queryKey: ["gradings", studentId],
    queryFn: async () => {
      const res = await GRADING_API.getGradings(studentId);
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
      await GRADING_API.deleteGrading(id);
      queryClient.invalidateQueries({ queryKey: ["gradings", studentId] });
      notifications.show({
        title: "Deleted",
        message: "Grading record deleted.",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to delete grading.",
        color: "red",
      });
    }
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["gradings", studentId] });
    modalHandlers.close();
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
            Grading Records
          </Text>
          <Button
            size="xs"
            leftSection={<PlusIcon size={14} />}
            onClick={handleAdd}
            disabled={isLocked}
          >
            Add Grading
          </Button>
        </Group>

        {gradings && gradings.length > 0 ? (
          <Paper withBorder>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Grammar</Table.Th>
                  <Table.Th>Conversation</Table.Th>
                  <Table.Th>Composition</Table.Th>
                  <Table.Th>Listening</Table.Th>
                  <Table.Th>Reading</Table.Th>
                  <Table.Th>Remarks</Table.Th>
                  <Table.Th>Date</Table.Th>
                  <Table.Th w={100}>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {gradings.map((grading: any) => (
                  <Table.Tr key={grading.id}>
                    <Table.Td>
                      <GradeBadge grade={grading.grammar} />
                    </Table.Td>
                    <Table.Td>
                      <GradeBadge grade={grading.conversation} />
                    </Table.Td>
                    <Table.Td>
                      <GradeBadge grade={grading.composition} />
                    </Table.Td>
                    <Table.Td>
                      <GradeBadge grade={grading.listening} />
                    </Table.Td>
                    <Table.Td>
                      <GradeBadge grade={grading.reading} />
                    </Table.Td>
                    <Table.Td>{grading.remarks}</Table.Td>
                    <Table.Td>
                      {new Date(grading.created_at).toLocaleDateString()}
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          onClick={() => handleEdit(grading)}
                          disabled={isLocked}
                        >
                          <PencilIcon size={14} />
                        </ActionIcon>
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          color="red"
                          onClick={() => handleDelete(String(grading.id))}
                          disabled={isLocked}
                        >
                          <TrashIcon size={14} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        ) : (
          <Paper withBorder p="xl">
            <Text c="dimmed" ta="center">
              No grading records found.
            </Text>
          </Paper>
        )}
      </Stack>

      <GradingModal
        opened={modalOpened}
        onClose={modalHandlers.close}
        onSuccess={handleSuccess}
        studentId={studentId}
        editRecord={editRecord}
      />
    </>
  );
}
