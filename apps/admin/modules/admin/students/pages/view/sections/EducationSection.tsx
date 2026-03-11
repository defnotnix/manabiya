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
import { EDUCATION_API } from "../../../module.config";
import { EducationModal } from "../../../modals/EducationModal";

interface EducationSectionProps {
  studentId: string;
  isLocked?: boolean;
}

export function EducationSection({
  studentId,
  isLocked = false,
}: EducationSectionProps) {
  const queryClient = useQueryClient();
  const [modalOpened, modalHandlers] = useDisclosure(false);
  const [editRecord, setEditRecord] = useState<any>(null);

  const { data: educations, isLoading } = useQuery({
    queryKey: ["educations", studentId],
    queryFn: async () => {
      const res = await EDUCATION_API.getEducations(studentId);
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
      await EDUCATION_API.deleteEducation(id);
      queryClient.invalidateQueries({ queryKey: ["educations", studentId] });
      notifications.show({
        title: "Deleted",
        message: "Education record deleted.",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to delete education.",
        color: "red",
      });
    }
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["educations", studentId] });
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
            Education History
          </Text>
          <Button
            size="xs"
            leftSection={<PlusIcon size={14} />}
            onClick={handleAdd}
            disabled={isLocked}
          >
            Add Education
          </Button>
        </Group>

        {educations && educations.length > 0 ? (
          <Paper withBorder>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Institution</Table.Th>
                  <Table.Th>Degree</Table.Th>
                  <Table.Th>Field of Study</Table.Th>
                  <Table.Th>Period</Table.Th>
                  <Table.Th w={100}>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {educations.map((edu: any) => (
                  <Table.Tr key={edu.id}>
                    <Table.Td>{edu.institution}</Table.Td>
                    <Table.Td>{edu.degree}</Table.Td>
                    <Table.Td>{edu.field_of_study}</Table.Td>
                    <Table.Td>
                      {edu.start_period} - {edu.end_period || "Present"}
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          onClick={() => handleEdit(edu)}
                          disabled={isLocked}
                        >
                          <PencilIcon size={14} />
                        </ActionIcon>
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          color="red"
                          onClick={() => handleDelete(String(edu.id))}
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
              No education records found.
            </Text>
          </Paper>
        )}
      </Stack>

      <EducationModal
        opened={modalOpened}
        onClose={modalHandlers.close}
        onSuccess={handleSuccess}
        studentId={studentId}
        editRecord={editRecord}
      />
    </>
  );
}
