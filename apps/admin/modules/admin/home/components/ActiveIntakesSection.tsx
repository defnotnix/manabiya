"use client";

import { Box, Button, Divider, Group, Paper, SimpleGrid, Text, ActionIcon, Menu, Center, Loader, Stack } from "@mantine/core";
import { ArrowRightIcon, CircleIcon, PlusIcon, DotsThreeVerticalIcon, TrashIcon, PencilIcon } from "@phosphor-icons/react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useBatches } from "../hooks/useBatches";
import { BatchModal } from "../../students/modals/BatchModal";

export function ActiveIntakesSection() {
  const router = useRouter();
  const { batches, isLoading, isDeleting, deleteBatch, refetch } = useBatches();
  const [modalOpened, modalHandlers] = useDisclosure(false);
  const [editRecord, setEditRecord] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleNewBatch = () => {
    setEditRecord(null);
    modalHandlers.open();
  };

  const handleEditBatch = (batch: any) => {
    setEditRecord(batch);
    modalHandlers.open();
  };

  const handleDeleteBatch = async (id: string) => {
    try {
      await deleteBatch(id);
      setDeleteConfirm(null);
      notifications.show({
        title: "Success",
        message: "Batch deleted successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to delete batch",
        color: "red",
      });
    }
  };

  const handleModalSuccess = async () => {
    setEditRecord(null);
    modalHandlers.close();
    await refetch();
  };

  return (
    <>
      <Divider my="xl" label="Active Batches" />

      {isLoading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {/* New Intake Button Card */}
          <Paper
            withBorder
            p="md"
            onClick={handleNewBatch}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 200,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "";
              e.currentTarget.style.transform = "";
            }}
          >
            <Stack align="center" gap="sm">
              <PlusIcon size={32} />
              <Text size="xs" fw={600}>
                Add a new batch
              </Text>
            </Stack>
          </Paper>

          {/* Batch Cards */}
          {batches.map((batch: any) => (
            <Paper key={batch.id} withBorder pos="relative">
              <Box p="md">
                <Group justify="space-between" mb="xs">
                  <Text size="sm" c="dimmed">
                    {batch.course}
                  </Text>
                  <Menu shadow="md" position="bottom-end">
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray" size="sm">
                        <DotsThreeVerticalIcon size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<PencilIcon size={14} />}
                        onClick={() => handleEditBatch(batch)}
                      >
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<TrashIcon size={14} />}
                        color="red"
                        onClick={() => setDeleteConfirm(batch.id)}
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>

                <Text size="md" fw={800} mb="xs">
                  {batch.name}
                </Text>

                <Group gap="xs" mb="xs">
                  <Text size="xs" c="dimmed">
                    Shift: <strong>{batch.shift}</strong>
                  </Text>
                  <Text size="xs" c="dimmed">
                    Instructor: <strong>{batch.instructor}</strong>
                  </Text>
                </Group>

                <Text size="xs" c="dimmed">
                  {batch.total_days} days • {batch.per_class_hours}h/class
                </Text>
              </Box>

              <Paper
                bg={batch.is_active ? "teal.0" : "gray.1"}
                p="md"
                radius={0}
                onClick={() =>
                  router.push(
                    `/admin/students?batch=${batch.id}&batch_name=${encodeURIComponent(batch.name)}`
                  )
                }
                style={{ cursor: "pointer" }}
              >
                <Group justify="space-between">
                  <Group gap={8}>
                    <CircleIcon
                      size={8}
                      weight="fill"
                      color={
                        batch.is_active
                          ? "var(--mantine-color-teal-7)"
                          : "var(--mantine-color-gray-5)"
                      }
                    />
                    <Text size="xs">{batch.is_active ? "ACTIVE" : "INACTIVE"}</Text>
                  </Group>
                  <ArrowRightIcon />
                </Group>
              </Paper>

              {/* Delete Confirmation Modal */}
              {deleteConfirm === batch.id && (
                <Paper
                  pos="absolute"
                  inset={0}
                  bg="rgba(0, 0, 0, 0.5)"
                  p="md"
                  radius="md"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <Text size="sm" c="white" mb="md" ta="center">
                    Delete "{batch.name}"?
                  </Text>
                  <Group gap="xs">
                    <Button
                      size="xs"
                      variant="light"
                      onClick={() => setDeleteConfirm(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="xs"
                      color="red"
                      loading={isDeleting}
                      onClick={() => handleDeleteBatch(batch.id)}
                    >
                      Delete
                    </Button>
                  </Group>
                </Paper>
              )}
            </Paper>
          ))}
        </SimpleGrid>
      )}

      <BatchModal
        opened={modalOpened}
        onClose={modalHandlers.close}
        onSuccess={handleModalSuccess}
        editRecord={editRecord}
      />
    </>
  );
}
