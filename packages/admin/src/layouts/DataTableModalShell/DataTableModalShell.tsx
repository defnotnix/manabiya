"use client";

import { useCallback, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { Box, ActionIcon, Group, Text, Stack } from "@mantine/core";
import { Trash, Warning, PencilIcon, WarningIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

import { DataTableWrapper } from "@settle/core";
import { DataTableShell } from "../DataTableShell";
import { PropDataTableModalShell } from "./DataTableModalShell.type";
import { Context } from "./DataTableModalShell.context";
import { ModalHandler } from "./components/ModalHandler";

export function DataTableModalShell({
  // DataTableShell props
  sustained = false,
  moduleInfo,
  tabs = [],
  idAccessor = "id",
  columns = [],
  tableActions = [],
  rowColor,
  rowBackgroundColor,
  rowStyle,
  hasServerSearch = false,
  pageSizes,
  forceFilter,
  disableActions = false,
  hideFilters,
  filterList = [],
  rowExpansion,

  // Modal-specific props
  modalWidth = "md",
  modalFormConfig,
  createFormConfig,
  editFormConfig,
  createModalTitle,
  editModalTitle,

  // API handlers
  onCreateApi,
  onEditApi,
  onDeleteApi,

  // Callbacks
  onCreateSuccess,
  onEditSuccess,
  onDeleteSuccess,
  onEditTrigger = (row) => Promise.resolve(row),

  // Transforms
  transformOnCreate,
  transformOnEdit,
  transformOnDelete,

  // Form components
  createFormComponent,
  editFormComponent,

  // Review
  onReviewClick,
  hasReviewPage = false,
  disableReviewButton = false,

  // Validator
  validator,
}: PropDataTableModalShell) {
  // * STATE
  const [isCreateModalOpen, handlersCreateModal] = useDisclosure(false);
  const [isEditModalOpen, handlersEditModal] = useDisclosure(false);
  const [activeEditRecord, setActiveEditRecord] = useState<any>(null);
  const [editLoading, setEditLoading] = useState(false);

  // * CONTEXT DATA
  const { refetch } = DataTableWrapper.useDataTableContext();

  // * CONTEXT VALUE
  const contextValue = {
    isCreateModalOpen,
    isEditModalOpen,
    activeEditRecord,
    editLoading,
    openCreateModal: handlersCreateModal.open,
    closeCreateModal: handlersCreateModal.close,
    openEditModal: async (record: any) => {
      setEditLoading(true);
      try {
        // If onEditTrigger is provided, use it to fetch/transform the record
        const finalRecord = onEditTrigger ? await onEditTrigger(record) : record;
        setActiveEditRecord(finalRecord);
        handlersEditModal.open();
      } catch (error) {
        console.error("Error in onEditTrigger:", error);
        notifications.show({
          title: "Error",
          message: "Failed to load record details",
          color: "red",
        });
        // Still set the original record if fetch fails
        setActiveEditRecord(record);
        handlersEditModal.open();
      } finally {
        setEditLoading(false);
      }
    },
    closeEditModal: handlersEditModal.close,
    setEditLoading,
    setActiveEditRecord,
  };

  // * MUTATIONS

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      const idToSubmit = transformOnDelete ? transformOnDelete(id) : id;
      return onDeleteApi?.(idToSubmit);
    },
    onMutate: () => {
      return notifications.show({
        loading: true,
        title: "Deleting",
        message: "Please wait...",
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: (res, id, notificationId) => {
      notifications.update({
        id: notificationId,
        loading: false,
        title: "Success",
        message: "Item deleted successfully",
        color: "green",
        autoClose: 3000,
        withCloseButton: true,
      });
      onDeleteSuccess?.(id);
      refetch();
    },
    onError: (_error, _id, notificationId) => {
      notifications.update({
        id: notificationId,
        loading: false,
        title: "Error",
        message: "Failed to delete item",
        color: "red",
        autoClose: 5000,
        withCloseButton: true,
      });
    },
  });

  // * FUNCTIONS

  const handleDelete = useCallback(
    (id: string | number) => {
      modals.openConfirmModal({
        title: (
          <Group>
            <ActionIcon size="sm" color="red" variant="light">
              <WarningIcon size={12} />
            </ActionIcon>
            <Text size="sm" fw={600}>
              Confirm deletion
            </Text>
          </Group>
        ),
        children: (
          <Stack py="md">
            <Text size="xs">This action cannot be undone.</Text>
            <Text size="xs" fw={600}>
              Are you sure?
            </Text>
          </Stack>
        ),
        labels: { confirm: "Delete", cancel: "Cancel" },
        confirmProps: { color: "red", size: "xs" },
        cancelProps: { size: "xs" },
        onConfirm: () => {
          deleteMutation.mutate(id);
        },
        styles: {
          header: {
            background: "var(--mantine-color-red-1)",
          },
        },
        size: "sm",
      });
    },
    [deleteMutation]
  );

  const handleBulkDelete = useCallback(
    (ids: (string | number)[]) => {
      modals.openConfirmModal({
        title: (
          <Group>
            <ActionIcon size="sm" color="red" variant="light">
              <WarningIcon size={12} />
            </ActionIcon>
            <Text size="sm" fw={600}>
              Confirm deletion
            </Text>
          </Group>
        ),
        children: (
          <Stack py="md">
            <Text size="xs">This action cannot be undone.</Text>
            <Text size="xs" fw={600}>
              Are you sure you want to delete {ids.length} item{ids.length === 1 ? "" : "s"}?
            </Text>
          </Stack>
        ),
        labels: { confirm: "Delete", cancel: "Cancel" },
        confirmProps: { color: "red", size: "xs" },
        cancelProps: { size: "xs" },
        onConfirm: () => {
          const notificationId = notifications.show({
            loading: true,
            title: "Deleting",
            message: `Deleting ${ids.length} item${ids.length === 1 ? "" : "s"}...`,
            autoClose: false,
            withCloseButton: false,
          });

          Promise.allSettled(
            ids.map((id) => {
              const idToSubmit = transformOnDelete ? transformOnDelete(id) : id;
              return onDeleteApi!(idToSubmit);
            })
          ).then((results) => {
            const failed = results.filter((r) => r.status === "rejected");
            const succeeded = results.filter((r) => r.status === "fulfilled");

            if (failed.length === 0) {
              notifications.update({
                id: notificationId,
                loading: false,
                title: "Success",
                message: `${succeeded.length} item${succeeded.length === 1 ? "" : "s"} deleted successfully`,
                color: "green",
                autoClose: 3000,
                withCloseButton: true,
              });
              onDeleteSuccess?.(ids[0]);
              refetch();
            } else if (succeeded.length === 0) {
              notifications.update({
                id: notificationId,
                loading: false,
                title: "Error",
                message: `Failed to delete ${failed.length} item${failed.length === 1 ? "" : "s"}`,
                color: "red",
                autoClose: 5000,
                withCloseButton: true,
              });
            } else {
              notifications.update({
                id: notificationId,
                loading: false,
                title: "Partial Success",
                message: `${succeeded.length} deleted, ${failed.length} failed`,
                color: "yellow",
                autoClose: 5000,
                withCloseButton: true,
              });
              refetch();
            }
          });
        },
        styles: {
          header: {
            background: "var(--mantine-color-red-light)",
          },
        },
        size: "sm",
      });
    },
    [onDeleteApi, transformOnDelete, onDeleteSuccess, refetch]
  );

  // * ENHANCED COLUMNS WITH ACTIONS

  return (
    <Context.Provider value={contextValue}>
      <DataTableShell
        sustained={true}
        moduleInfo={moduleInfo}
        tabs={tabs}
        idAccessor={idAccessor}
        columns={columns}
        tableActions={tableActions}
        rowColor={rowColor}
        rowBackgroundColor={rowBackgroundColor}
        rowStyle={rowStyle}
        hasServerSearch={hasServerSearch}
        pageSizes={pageSizes}
        forceFilter={forceFilter}
        disableActions={true}
        hideFilters={hideFilters}
        filterList={filterList}
        rowExpansion={rowExpansion}

        onNewClick={contextValue.openCreateModal}
        onEditClick={(record: any) => contextValue.openEditModal(record)}
        onDeleteClick={handleBulkDelete}
        onReviewClick={onReviewClick}

        disableCreateButton={!onCreateApi}
        disableEditButton={!onEditApi}
        disableDeleteButton={!onDeleteApi}
        disableReviewButton={disableReviewButton}
      />

      {onCreateApi || onEditApi ? (
        <ModalHandler
          modalWidth={modalWidth}
          onCreateApi={onCreateApi}
          onEditApi={onEditApi}
          onCreateSuccess={onCreateSuccess}
          onEditSuccess={onEditSuccess}
          onEditTrigger={onEditTrigger}
          transformOnCreate={transformOnCreate}
          transformOnEdit={transformOnEdit}
          validator={validator}
          idAccessor={idAccessor}
          createFormComponent={createFormComponent}
          editFormComponent={editFormComponent}
          createModalTitle={createModalTitle}
          editModalTitle={editModalTitle}
          createFormConfig={createFormConfig ?? modalFormConfig}
          editFormConfig={editFormConfig ?? modalFormConfig}
          moduleName={moduleInfo?.name || "Item"}
          moduleTerm={moduleInfo?.term || "Item"}
        />
      ) : null}
    </Context.Provider>
  );
}
