"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Container,
  Group,
  Loader,
  Menu,
  Modal,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { DataTableWrapper, FormWrapper } from "@settle/core";
import { AutoBreadcrumb, triggerNotification } from "@settle/admin";
import {
  ArrowClockwiseIcon,
  CaretDownIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";

import {
  CATALOG_NODE_API,
  CATALOG_NODE_MODULE_CONFIG,
} from "../../module.config";
import { NodeForm } from "../../form/NodeForm";
import { NodeTree, CatalogNode } from "./components/NodeTree";

export function ListPage() {
  const queryClient = useQueryClient();
  const QUERY_KEY = "catalogue.nodes.tree".split("."); // Match DataTableWrapper's format

  // Modal states
  const [createOpened, { open: openCreate, close: closeCreate }] =
    useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);

  // Selection state
  const [parentId, setParentId] = useState<string | number | null>(null);
  const [selectedNode, setSelectedNode] = useState<CatalogNode | null>(null);

  // Search state
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 200);

  // Handlers
  const handleCreateRoot = () => {
    setParentId(null);
    openCreate();
  };

  const handleAddChild = (pId: string | number) => {
    setParentId(pId);
    openCreate();
  };

  const handleEdit = (node: CatalogNode) => {
    setSelectedNode(node);
    openEdit();
  };

  const handleDelete = (node: CatalogNode) => {
    setSelectedNode(node);
    openDelete();
  };

  // Delete API call
  const confirmDelete = async () => {
    if (!selectedNode) return;
    const res = await CATALOG_NODE_API.deleteNode(selectedNode.id);
    if (!res.err) {
      notifications.show({
        title: "Deleted",
        message: "Node deleted successfully",
        color: "green",
      });
      closeDelete();

      // Update cache directly instead of refetching
      queryClient.setQueryData(QUERY_KEY, (oldData: any) => {
        if (!oldData) return oldData;

        // Recursively remove the deleted node from the tree
        const removeNode = (nodes: CatalogNode[]): CatalogNode[] => {
          return nodes
            .filter((node) => node.id !== selectedNode.id)
            .map((node) => ({
              ...node,
              children: node.children ? removeNode(node.children) : [],
            }));
        };

        return removeNode(oldData);
      });
    } else {
      notifications.show({ title: "Error", message: res.error, color: "red" });
    }
  };

  return (
    <DataTableWrapper
      queryKey="catalogue.nodes.tree"
      queryGetFn={CATALOG_NODE_API.getTree}
      dataKey="data"
    >
      <NodeTreeContent
        onAddChild={handleAddChild}
        onEdit={handleEdit}
        onDelete={handleDelete}
        search={debouncedSearch}
        onSearchChange={setSearch}
        onCreateRoot={handleCreateRoot}
        moduleInfo={CATALOG_NODE_MODULE_CONFIG}
      />

      {/* MODALS */}

      {/* Create Modal */}
      <Modal
        opened={createOpened}
        onClose={closeCreate}
        title={`Create New ${parentId ? "Child " : ""}Node`}
      >
        <FormWrapper
          notifications={triggerNotification.form}
          queryKey="catalogue.node.create"
          formName="create-node-form"
          initial={{
            name: "",
            node_type: "BRAND",
            parent: parentId,
          }}
          apiSubmitFn={async (data) => {
            const res = await CATALOG_NODE_API.createNode(data);
            return res.data;
          }}
          submitSuccessFn={(newNode) => {
            closeCreate();

            // Update cache directly with the new node
            queryClient.setQueryData(QUERY_KEY, (oldData: any) => {
              if (!oldData) return [newNode];

              // If no parent, add to root
              if (!parentId) {
                return [...oldData, newNode];
              }

              // Add to parent's children
              const addToParent = (nodes: CatalogNode[]): CatalogNode[] => {
                return nodes.map((node) => {
                  if (node.id === parentId) {
                    return {
                      ...node,
                      children: [...(node.children || []), newNode],
                    };
                  }
                  return {
                    ...node,
                    children: node.children ? addToParent(node.children) : [],
                  };
                });
              };

              return addToParent(oldData);
            });
          }}
        >
          <NodeForm />
        </FormWrapper>
      </Modal>

      {/* Edit Modal */}
      <Modal opened={editOpened} onClose={closeEdit} title="Edit Node">
        {selectedNode && (
          <FormWrapper
            notifications={triggerNotification.form}
            queryKey={`catalogue.node.edit.${selectedNode.id}`}
            formName="edit-node-form"
            initial={{
              name: selectedNode.name,
              node_type: selectedNode.node_type,
              parent: null,
            }}
            primaryKey="id"
            apiSubmitFn={async (data) => {
              const res = await CATALOG_NODE_API.updateNode(
                selectedNode.id,
                data,
              );
              return res.data;
            }}
            submitSuccessFn={(updatedNode) => {
              closeEdit();

              // Update cache directly with the updated node
              queryClient.setQueryData(QUERY_KEY, (oldData: any) => {
                if (!oldData) return oldData;

                const updateNode = (nodes: CatalogNode[]): CatalogNode[] => {
                  return nodes.map((node) => {
                    if (node.id === selectedNode.id) {
                      return {
                        ...node,
                        ...updatedNode,
                        children: node.children,
                      };
                    }
                    return {
                      ...node,
                      children: node.children ? updateNode(node.children) : [],
                    };
                  });
                };

                return updateNode(oldData);
              });
            }}
          >
            <NodeForm />
          </FormWrapper>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal opened={deleteOpened} onClose={closeDelete} title="Delete Node">
        <Text size="sm">
          Are you sure you want to delete <b>{selectedNode?.name}</b>? This
          action cannot be undone.
        </Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={closeDelete}>
            Cancel
          </Button>
          <Button color="red" onClick={confirmDelete}>
            Delete
          </Button>
        </Group>
      </Modal>
    </DataTableWrapper>
  );
}

// Separate component to consume DataTableWrapper context/data
function NodeTreeContent({
  onAddChild,
  onEdit,
  onDelete,
  search,
  onSearchChange,
  onCreateRoot,
  moduleInfo,
}: any) {
  const {
    data = [],
    isLoading,
    refetch,
  } = DataTableWrapper.useDataTableContext();

  // Safe access to nodes
  const allNodes = useMemo(() => {
    return Array.isArray(data) ? data : data?.results || data?.data || [];
  }, [data]);

  // Recursive filtering logic
  const filteredNodes = useMemo(() => {
    if (!search.trim()) return allNodes;

    const filterTree = (nodes: CatalogNode[]): CatalogNode[] => {
      return nodes
        .map((node) => {
          const matches = node.name
            .toLowerCase()
            .includes(search.toLowerCase());
          const filteredChildren = filterTree(node.children || []);

          if (matches || filteredChildren.length > 0) {
            return {
              ...node,
              children: filteredChildren,
            };
          }
          return null;
        })
        .filter((n): n is CatalogNode => n !== null);
    };

    return filterTree(allNodes);
  }, [allNodes, search]);

  const totalCount = useMemo(() => {
    const countNodes = (nodes: CatalogNode[]): number => {
      return nodes.reduce(
        (acc, node) => acc + 1 + countNodes(node.children || []),
        0,
      );
    };
    return countNodes(allNodes);
  }, [allNodes]);

  return (
    <>
      <Container size="md">
        {/* Header */}
        <Stack gap="sm">
          <Group justify="space-between" h={80}>
            <div>
              <Group gap={8}>
                <Text size="xl" fw={900}>
                  {moduleInfo.label}
                </Text>
                <Badge variant="outline" color="gray" size="xs">
                  {totalCount} nodes
                </Badge>
              </Group>
              <Text size="xs" opacity={0.5}>
                {moduleInfo.description}
              </Text>
            </div>

            <Group gap={4}>
              <Menu>
                <Menu.Target>
                  <Button
                    rightSection={<CaretDownIcon />}
                    size="xs"
                    variant="subtle"
                    color="dark"
                  >
                    More Actions
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Actions</Menu.Label>
                  <Menu.Item
                    leftSection={<ArrowClockwiseIcon />}
                    onClick={() => refetch()}
                  >
                    Reload Data
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>

              <Button
                leftSection={<ArrowClockwiseIcon />}
                size="xs"
                variant="light"
                color="dark"
                onClick={() => refetch?.()}
              >
                Reload Data
              </Button>

              <Button
                onClick={onCreateRoot}
                size="xs"
                leftSection={<PlusIcon />}
              >
                New Root Node
              </Button>
            </Group>
          </Group>
        </Stack>
      </Container>

      <Container size="md">
        {/* Toolbar */}
        <Group gap="xs" justify="space-between" h={40}>
          <Button variant="light" size="xs">
            All Nodes
          </Button>

          <Group gap={4}>
            <div suppressHydrationWarning>
              <TextInput
                miw={300}
                leftSection={<MagnifyingGlassIcon />}
                size="xs"
                placeholder="Search nodes..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </Group>
        </Group>
      </Container>

      <Container size="md" mt="md">
        <Paper p={0} style={{ overflow: "hidden", minHeight: 400 }}>
          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 400,
              }}
            >
              <Loader size="md" />
            </div>
          ) : (
            <div>
              {filteredNodes.length === 0 ? (
                <Text c="dimmed" ta="center" py="xl">
                  No nodes found.
                </Text>
              ) : (
                <NodeTree
                  nodes={filteredNodes}
                  onAddChild={onAddChild}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              )}
            </div>
          )}
        </Paper>
      </Container>
    </>
  );
}
