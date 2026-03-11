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
import { FAMILY_MEMBER_API } from "../../../module.config";
import { FamilyMemberModal } from "../../../modals/FamilyMemberModal";

interface FamilySectionProps {
  studentId: string;
  isLocked?: boolean;
}

export function FamilySection({
  studentId,
  isLocked = false,
}: FamilySectionProps) {
  const queryClient = useQueryClient();
  const [modalOpened, modalHandlers] = useDisclosure(false);
  const [editRecord, setEditRecord] = useState<any>(null);

  const { data: familyMembers, isLoading } = useQuery({
    queryKey: ["familyMembers", studentId],
    queryFn: async () => {
      const res = await FAMILY_MEMBER_API.getFamilyMembers(studentId);
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
      await FAMILY_MEMBER_API.deleteFamilyMember(id);
      queryClient.invalidateQueries({ queryKey: ["familyMembers", studentId] });
      notifications.show({
        title: "Deleted",
        message: "Family member record deleted.",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to delete family member.",
        color: "red",
      });
    }
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["familyMembers", studentId] });
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
            Family Members
          </Text>
          <Button
            size="xs"
            leftSection={<PlusIcon size={14} />}
            onClick={handleAdd}
            disabled={isLocked}
          >
            Add Family Member
          </Button>
        </Group>

        {familyMembers && familyMembers.length > 0 ? (
          <Paper withBorder>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Relationship</Table.Th>
                  <Table.Th>Age</Table.Th>
                  <Table.Th>Occupation</Table.Th>
                  <Table.Th>Contact</Table.Th>
                  <Table.Th w={100}>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {familyMembers.map((member: any) => (
                  <Table.Tr key={member.id}>
                    <Table.Td>{member.name}</Table.Td>
                    <Table.Td>{member.relationship}</Table.Td>
                    <Table.Td>{member.age}</Table.Td>
                    <Table.Td>{member.occupation}</Table.Td>
                    <Table.Td>{member.contact}</Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          onClick={() => handleEdit(member)}
                          disabled={isLocked}
                        >
                          <PencilIcon size={14} />
                        </ActionIcon>
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          color="red"
                          onClick={() => handleDelete(String(member.id))}
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
              No family members found.
            </Text>
          </Paper>
        )}
      </Stack>

      <FamilyMemberModal
        opened={modalOpened}
        onClose={modalHandlers.close}
        onSuccess={handleSuccess}
        studentId={studentId}
        editRecord={editRecord}
      />
    </>
  );
}
