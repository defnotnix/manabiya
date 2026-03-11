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
} from "@mantine/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import { PlusIcon, PencilIcon, TrashIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { EXPERIENCE_API } from "../../../module.config";
import { ExperienceModal } from "../../../modals/ExperienceModal";

interface ExperienceSectionProps {
  studentId: string;
  isLocked?: boolean;
}

export function ExperienceSection({
  studentId,
  isLocked = false,
}: ExperienceSectionProps) {
  const queryClient = useQueryClient();
  const [modalOpened, modalHandlers] = useDisclosure(false);
  const [editRecord, setEditRecord] = useState<any>(null);

  const { data: experiences, isLoading } = useQuery({
    queryKey: ["experiences", studentId],
    queryFn: async () => {
      const res = await EXPERIENCE_API.getExperiences(studentId);
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
      await EXPERIENCE_API.deleteExperience(id);
      queryClient.invalidateQueries({ queryKey: ["experiences", studentId] });
      notifications.show({
        title: "Deleted",
        message: "Experience record deleted.",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to delete experience.",
        color: "red",
      });
    }
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["experiences", studentId] });
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
            Work Experience
          </Text>
          <Button
            size="xs"
            leftSection={<PlusIcon size={14} />}
            onClick={handleAdd}
            disabled={isLocked}
          >
            Add Experience
          </Button>
        </Group>

        {experiences && experiences.length > 0 ? (
          <Paper withBorder>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Company</Table.Th>
                  <Table.Th>Role</Table.Th>
                  <Table.Th>Period</Table.Th>
                  <Table.Th>Notes</Table.Th>
                  <Table.Th w={100}>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {experiences.map((exp: any) => (
                  <Table.Tr key={exp.id}>
                    <Table.Td>{exp.company}</Table.Td>
                    <Table.Td>{exp.role}</Table.Td>
                    <Table.Td>
                      {exp.start_period} - {exp.end_period || "Present"}
                    </Table.Td>
                    <Table.Td>{exp.notes}</Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          onClick={() => handleEdit(exp)}
                          disabled={isLocked}
                        >
                          <PencilIcon size={14} />
                        </ActionIcon>
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          color="red"
                          onClick={() => handleDelete(String(exp.id))}
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
              No experience records found.
            </Text>
          </Paper>
        )}
      </Stack>

      <ExperienceModal
        opened={modalOpened}
        onClose={modalHandlers.close}
        onSuccess={handleSuccess}
        studentId={studentId}
        editRecord={editRecord}
      />
    </>
  );
}
