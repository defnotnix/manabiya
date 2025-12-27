"use client";

import { useMemo, useState } from "react";
import {
  Container,
  Stack,
  SimpleGrid,
  TextInput,
  Group,
  Text,
  Box,
  Button,
} from "@mantine/core";
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import { notifications } from "@mantine/notifications";

import { DataTableWrapper } from "@settle/core";
import { autoSearch } from "@settle/core";
import { PropConfigShell } from "./ConfigShell.type";
import { ConfigShellHeader } from "./components/Header";
import { ConfigShellCard } from "./components/Card";
import { ConfigShellCardNew } from "./components/CardNew";
import { Context as ConfigShellContext } from "./ConfigShell.context";

export function ConfigShell({
  moduleInfo,
  bread,
  fields,
  idAccessor = "id",
  // API functions
  onCreateApi,
  onEditApi,
  onDeleteApi,
  // Legacy callbacks
  onEdit,
  onDelete,
  onCreate,
  // Transform functions
  transformOnCreate,
  transformOnEdit,
  transformOnDelete,
  // Custom components
  renderCard,
  renderNewCard,
  // Props
  searchPlaceholder = "Search...",
  createButtonLabel = "Create New",
  isLoading: externalIsLoading = false,
  emptyStateMessage = "No items found",
  validator,
}: PropConfigShell) {
  // * CONTEXT
  const { data, refetch } = DataTableWrapper.useDataTableContext();
  const search = DataTableWrapper.useDataTableWrapperStore(
    (state) => state.search
  );
  const setSearch = DataTableWrapper.useDataTableWrapperStore(
    (state) => state.setSearch
  );

  // * STATE
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // * FUNCTIONS
  const filteredData = useMemo(() => {
    if (!search) return data;
    return autoSearch(data, search);
  }, [data, search]);

  const handleCreate = async (newData: any) => {
    // Use new API-based approach if onCreateApi is provided
    if (onCreateApi) {
      setIsLoading(true);
      try {
        // Validate data if validator is provided
        if (validator) {
          validator.parse(newData);
        }

        // Transform data if transform function is provided
        const dataToSubmit = transformOnCreate
          ? transformOnCreate(newData)
          : newData;

        await onCreateApi(dataToSubmit);
        notifications.show({
          title: "Success",
          message: "Item created successfully",
          color: "green",
        });
        setShowNewForm(false);
        setTimeout(() => refetch(), 300);
      } catch (error: any) {
        // Handle Zod validation errors
        if (error.name === "ZodError") {
          const firstError = error.errors[0];
          notifications.show({
            title: "Validation Error",
            message: `${firstError.path.join(".")}: ${firstError.message}`,
            color: "red",
          });
        } else {
          notifications.show({
            title: "Error",
            message: "Failed to create item",
            color: "red",
          });
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // Legacy approach
      onCreate?.(newData);
      setShowNewForm(false);
      setTimeout(() => refetch(), 300);
    }
  };

  const handleEdit = async (item: any) => {
    // Use new API-based approach if onEditApi is provided
    if (onEditApi) {
      setIsLoading(true);
      try {
        // Validate data if validator is provided
        if (validator) {
          validator.parse(item);
        }

        // Transform data if transform function is provided
        const dataToSubmit = transformOnEdit ? transformOnEdit(item) : item;

        await onEditApi(item[idAccessor], dataToSubmit);
        notifications.show({
          title: "Success",
          message: "Item updated successfully",
          color: "green",
        });
        setEditingId(null);
        setTimeout(() => refetch(), 300);
      } catch (error: any) {
        // Handle Zod validation errors
        if (error.name === "ZodError") {
          const firstError = error.errors[0];
          notifications.show({
            title: "Validation Error",
            message: `${firstError.path.join(".")}: ${firstError.message}`,
            color: "red",
          });
        } else {
          notifications.show({
            title: "Error",
            message: "Failed to update item",
            color: "red",
          });
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // Legacy approach
      setEditingId(item[idAccessor]);
      onEdit?.(item);
    }
  };

  const handleDelete = async (id: string | number) => {
    // Use new API-based approach if onDeleteApi is provided
    if (onDeleteApi) {
      setIsLoading(true);
      try {
        // Transform id if transform function is provided
        const idToSubmit = transformOnDelete ? transformOnDelete(id) : id;

        await onDeleteApi(idToSubmit);
        notifications.show({
          title: "Success",
          message: "Item deleted successfully",
          color: "green",
        });
        setTimeout(() => refetch(), 300);
      } catch (error: any) {
        notifications.show({
          title: "Error",
          message: "Failed to delete item",
          color: "red",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Legacy approach
      onDelete?.(id);
      refetch();
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const contextValue = {
    selectedRecords: [],
    setSelectedRecords: () => {},
  };

  return (
    <ConfigShellContext.Provider value={contextValue}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
        {/* Sticky Header */}
        <div style={{ flexShrink: 0, position: "sticky", top: 0, zIndex: 10, backgroundColor: "white" }}>
          <Container size="sm">
            <ConfigShellHeader bread={bread} moduleInfo={moduleInfo} />
          </Container>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflow: "auto", overflowX: "auto" }}>
          <Container size="sm">
            <Box p="lg">
              <Stack gap="lg">
                {/* Search Bar & New Button */}
                <Group justify="space-between">
                  <TextInput
                    placeholder={searchPlaceholder}
                    leftSection={<MagnifyingGlassIcon size={16} />}
                    value={search || ""}
                    onChange={(e) => setSearch(e.currentTarget.value)}
                    style={{ flex: 1 }}
                  />
                  <Button
                    leftSection={<PlusIcon size={16} />}
                    onClick={() => setShowNewForm(!showNewForm)}
                    variant={showNewForm ? "filled" : "light"}
                  >
                    {showNewForm ? "Cancel" : createButtonLabel}
                  </Button>
                </Group>

                {/* New Item Form */}
                {showNewForm && (() => {
                  const NewCardComponent = renderNewCard || ConfigShellCardNew;

                  return (
                    <NewCardComponent
                      key="new-form"
                      fields={fields}
                      onCreate={handleCreate}
                      isLoading={isLoading}
                      validator={validator}
                    />
                  );
                })()}

                {/* Cards Grid */}
                {filteredData.length > 0 ? (
                  <SimpleGrid cols={1} spacing="xs">
                    {filteredData.map((item: any) => {
                      const CardComponent = renderCard || ConfigShellCard;

                      return (
                        <CardComponent
                          key={item[idAccessor]}
                          item={item}
                          fields={fields}
                          idAccessor={idAccessor}
                          isEditing={editingId === item[idAccessor]}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onSave={handleEdit}
                          onCancel={handleCancel}
                        />
                      );
                    })}
                  </SimpleGrid>
                ) : (
                  <Stack align="center" justify="center" py="xl">
                    <Text size="sm" opacity={0.6}>
                      {emptyStateMessage}
                    </Text>
                  </Stack>
                )}
              </Stack>
            </Box>
          </Container>
        </div>
      </div>
    </ConfigShellContext.Provider>
  );
}
