"use client";

import { Box, Button, Divider, Group, Paper, SimpleGrid, Text, ActionIcon, Menu, Center, Loader, Stack, useMantineColorScheme, useMantineTheme, Badge } from "@mantine/core";
import { ArrowRightIcon, PlusIcon, DotsThreeVerticalIcon, TrashIcon, PencilIcon } from "@phosphor-icons/react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useBatches } from "../hooks/useBatches";
import { BatchModal } from "../../students/modals/BatchModal";
import { BATCH_API } from "../../students/module.config";

export function ActiveIntakesSection() {
  const router = useRouter();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { batches, isLoading, refetch } = useBatches();
  const [modalOpened, modalHandlers] = useDisclosure(false);
  const [editRecord, setEditRecord] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [newBatchId, setNewBatchId] = useState<string | null>(null);
  const [isInactivating, setIsInactivating] = useState(false);

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
      setIsInactivating(true);
      await BATCH_API.inactivateBatch(id);
      setDeleteConfirm(null);
      await refetch();
      notifications.show({
        title: "Success",
        message: "Batch inactivated successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to inactivate batch",
        color: "red",
      });
    } finally {
      setIsInactivating(false);
    }
  };

  const handleModalSuccess = async (batchData?: any) => {
    setEditRecord(null);
    modalHandlers.close();
    await refetch();

    // Track newly created batch and show "NEW" indicator (persists until page refresh)
    if (batchData?.id && !editRecord) {
      setNewBatchId(batchData.id);
    }
  };

  return (
    <>
      <Divider my="xl" label="Active Batches" />

      {isLoading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xs">
          {/* New Intake Button Card */}
          <Paper
            opacity={.5}
            withBorder
            p="md"
            onClick={handleNewBatch}
            bg={colorScheme === "dark" ? "dark.7" : "white"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 200,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = colorScheme === "dark" ? "0 4px 12px rgba(255, 255, 255, 0.1)" : "0 4px 12px rgba(0, 0, 0, 0.15)";
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
          {batches
            .filter((batch: any) => batch.is_active)
            .sort((a: any, b: any) => {
              // Sort by id in descending order to show newer batches first
              return Number(b.id) - Number(a.id);
            })
            .map((batch: any) => (
            <Paper
              key={batch.id}
              withBorder
              pos="relative"
              bg={colorScheme === "dark" ? "dark.7" : "white"}
              onClick={() =>
                router.push(
                  `/admin/students?batch=${batch.id}&batch_name=${encodeURIComponent(batch.name)}`
                )
              }
              style={{
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = colorScheme === "dark" ? "0 4px 12px rgba(255, 255, 255, 0.1)" : "0 4px 12px rgba(0, 0, 0, 0.15)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "";
                e.currentTarget.style.transform = "";
              }}
            >
              <Box p="md">
                <Group justify="space-between" mb="xs">
                  <Group gap="xs">
                    <Text size="sm" c="dimmed">
                      {batch.course}
                    </Text>
                    {newBatchId === batch.id && (
                      <Badge size="xs" variant="filled" color="green">
                        NEW
                      </Badge>
                    )}
                  </Group>
                  <Menu shadow="md" position="bottom-end">
                    <Menu.Target>
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DotsThreeVerticalIcon size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<PencilIcon size={14} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditBatch(batch);
                        }}
                      >
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<TrashIcon size={14} />}
                        color="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm(batch.id);
                        }}
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

              <Box px="md" py="xs">
                <Group justify="flex-end">
                  <ArrowRightIcon size={18} color={colorScheme === "dark" ? "var(--mantine-color-gray-0)" : "var(--mantine-color-gray-9)"} />
                </Group>
              </Box>

              {/* Delete Confirmation Modal */}
              {deleteConfirm === batch.id && (
                <Paper
                  pos="absolute"
                  inset={0}
                  bg={colorScheme === "dark" ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.5)"}
                  p="md"
                  radius="md"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <Text size="sm" c={colorScheme === "dark" ? "gray.0" : "white"} mb="md" ta="center">
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
                      loading={isInactivating}
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
