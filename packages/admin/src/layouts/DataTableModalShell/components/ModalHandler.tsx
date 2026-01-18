"use client";

import {
  Modal,
  Stack,
  Text,
  LoadingOverlay,
  Button,
  Group,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { PropDataTableModalShell } from "../DataTableModalShell.type";
import { useDataTableModalShellContext } from "../DataTableModalShell.context";
import { DataTableWrapper } from "@settle/core";
import { FormWrapper } from "@settle/core";

export const useEditFormContext = FormWrapper.useForm;
export const useFormProps = FormWrapper.useFormProps;

// ─────────────────────────────────────────────
// Create Modal Content Component
// ─────────────────────────────────────────────

interface CreateModalContentProps {
  moduleTerm: string;
  idAccessor: string;
  transformOnCreate: any;
  onCreateApi: any;
  handleCreateSuccess: (res: any) => void;
  handleCreateError: (err: any) => void;
  closeCreateModal: () => void;
  createFormComponent: any;
}

function CreateModalContent({
  moduleTerm,
  idAccessor,
  transformOnCreate,
  onCreateApi,
  handleCreateSuccess,
  handleCreateError,
  closeCreateModal,
  createFormComponent,
}: CreateModalContentProps) {
  return (
    <FormWrapper
      queryKey={`create.${moduleTerm.toLowerCase()}`}
      formName={`create-${moduleTerm.toLowerCase()}`}
      mode="uncontrolled"
      initial={{}}
      steps={1}
      validation={[]}
      disabledSteps={[]}
      primaryKey={idAccessor}
      apiSubmitFn={async (data: any) => {
        const dataToSubmit = transformOnCreate ? transformOnCreate(data) : data;
        return onCreateApi?.(dataToSubmit);
      }}
      transformFnSubmit={(formdata) => formdata}
      formClearOnSuccess={true}
      submitSuccessFn={(res) => handleCreateSuccess(res)}
      submitErrorFn={(err) => handleCreateError(err)}
      notifications={{
        isLoading: () => {},
        isSuccess: () => {},
        isWarning: () => {},
        isError: () => {},
        isValidationError: () => {},
        isValidationStepError: () => {},
        isInfo: () => {},
      }}
    >
      <CreateModalBody
        createFormComponent={createFormComponent}
        closeCreateModal={closeCreateModal}
      />
    </FormWrapper>
  );
}

interface CreateModalBodyProps {
  createFormComponent: any;
  closeCreateModal: () => void;
}

function CreateModalBody({
  createFormComponent,
  closeCreateModal,
}: CreateModalBodyProps) {
  const { isLoading, handleSubmit } = FormWrapper.useFormProps();

  return (
    <Stack gap="lg">
      <div>
        {createFormComponent ? (
          typeof createFormComponent === "function" ? (
            (
              createFormComponent as (props: {
                isCreate: boolean;
              }) => React.ReactNode
            )({
              isCreate: true,
            })
          ) : (
            <div>{createFormComponent as React.ReactNode}</div>
          )
        ) : (
          <Text size="sm" color="dimmed">
            No form component provided
          </Text>
        )}
      </div>

      <Group justify="flex-end" gap="sm" p="md">
        <Button variant="light" onClick={closeCreateModal} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} loading={isLoading}>
          Create
        </Button>
      </Group>
    </Stack>
  );
}

// ─────────────────────────────────────────────
// Edit Modal Content Component
// ─────────────────────────────────────────────

interface EditModalContentProps {
  moduleTerm: string;
  idAccessor: string;
  transformOnEdit: any;
  onEditApi: any;
  handleEditSuccess: (res: any) => void;
  handleEditError: (err: any) => void;
  closeEditModal: () => void;
  editFormComponent: any;
  activeEditRecord: any;
  editLoading: boolean;
}

function EditModalContent({
  moduleTerm,
  idAccessor,
  transformOnEdit,
  onEditApi,
  handleEditSuccess,
  handleEditError,
  closeEditModal,
  editFormComponent,
  activeEditRecord,
  editLoading,
}: EditModalContentProps) {
  return (
    <Stack gap="lg" pos="relative">
      <LoadingOverlay visible={editLoading} />
      {editFormComponent && activeEditRecord ? (
        <FormWrapper
          queryKey={`edit.${moduleTerm.toLowerCase()}`}
          formName={`edit-${moduleTerm.toLowerCase()}`}
          mode="uncontrolled"
          initial={activeEditRecord}
          steps={1}
          validation={[]}
          disabledSteps={[]}
          primaryKey={idAccessor}
          apiSubmitFn={async (data: any) => {
            const dataToSubmit = transformOnEdit ? transformOnEdit(data) : data;
            return onEditApi?.(data[idAccessor], dataToSubmit);
          }}
          transformFnSubmit={(formdata) => formdata}
          formClearOnSuccess={false}
          submitSuccessFn={(res) => handleEditSuccess(res)}
          submitErrorFn={(err) => handleEditError(err)}
          notifications={{
            isLoading: () => {},
            isSuccess: () => {},
            isWarning: () => {},
            isError: () => {},
            isValidationError: () => {},
            isValidationStepError: () => {},
            isInfo: () => {},
          }}
        >
          <EditModalBody
            editFormComponent={editFormComponent}
            closeEditModal={closeEditModal}
          />
        </FormWrapper>
      ) : (
        <Text size="sm" color="dimmed">
          {activeEditRecord ? "Loading..." : "No form component provided"}
        </Text>
      )}
    </Stack>
  );
}

interface EditModalBodyProps {
  editFormComponent: any;
  closeEditModal: () => void;
}

function EditModalBody({
  editFormComponent,
  closeEditModal,
}: EditModalBodyProps) {
  const { isLoading, handleSubmit } = FormWrapper.useFormProps();

  return (
    <Stack gap="lg">
      <div>
        {typeof editFormComponent === "function"
          ? (
              editFormComponent as (props: {
                isCreate: boolean;
              }) => React.ReactNode
            )({
              isCreate: false,
            })
          : (editFormComponent as React.ReactNode)}
      </div>

      <Group justify="flex-end" gap="sm">
        <Button variant="light" onClick={closeEditModal} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} loading={isLoading}>
          Update
        </Button>
      </Group>
    </Stack>
  );
}

type ModalHandlerProps = Pick<
  PropDataTableModalShell,
  | "modalWidth"
  | "onCreateApi"
  | "onEditApi"
  | "onCreateSuccess"
  | "onEditSuccess"
  | "onEditTrigger"
  | "transformOnCreate"
  | "transformOnEdit"
  | "validator"
  | "idAccessor"
  | "createFormComponent"
  | "editFormComponent"
> & {
  moduleName?: string;
  moduleTerm?: string;
};

export function ModalHandler({
  modalWidth = "md",
  onCreateApi,
  onEditApi,
  onCreateSuccess,
  onEditSuccess,
  onEditTrigger,
  transformOnCreate,
  transformOnEdit,
  validator,
  idAccessor = "id",
  createFormComponent,
  editFormComponent,
  moduleName = "Item",
  moduleTerm = "Item",
}: ModalHandlerProps) {
  const {
    isCreateModalOpen,
    isEditModalOpen,
    activeEditRecord,
    editLoading,
    closeCreateModal,
    closeEditModal,
    setEditLoading,
  } = useDataTableModalShellContext();

  const { refetch } = DataTableWrapper.useDataTableContext();

  const handleCreateSuccess = (res: any) => {
    notifications.show({
      title: "Success",
      message: `${moduleTerm} created successfully`,
      color: "green",
    });
    onCreateSuccess?.(res);
    closeCreateModal();
    refetch();
  };

  const handleCreateError = (err: any) => {
    if (err.name === "ZodError") {
      const firstError = err.errors[0];
      notifications.show({
        title: "Validation Error",
        message: `${firstError.path.join(".")}: ${firstError.message}`,
        color: "red",
      });
    } else {
      notifications.show({
        title: "Error",
        message: `Failed to create ${moduleTerm}`,
        color: "red",
      });
    }
  };

  const handleEditSuccess = (res: any) => {
    notifications.show({
      title: "Success",
      message: `${moduleTerm} updated successfully`,
      color: "green",
    });
    onEditSuccess?.(res);
    closeEditModal();
    refetch();
  };

  const handleEditError = (err: any) => {
    if (err.name === "ZodError") {
      const firstError = err.errors[0];
      notifications.show({
        title: "Validation Error",
        message: `${firstError.path.join(".")}: ${firstError.message}`,
        color: "red",
      });
    } else {
      notifications.show({
        title: "Error",
        message: `Failed to update ${moduleTerm}`,
        color: "red",
      });
    }
  };

  return (
    <>
      {/* Create Modal */}
      <Modal
        opened={isCreateModalOpen}
        onClose={closeCreateModal}
        title={
          <Text tt="uppercase" size="xs" fw={700}>
            New {moduleTerm}
          </Text>
        }
        size={modalWidth}
      >
        <CreateModalContent
          moduleTerm={moduleTerm}
          idAccessor={idAccessor}
          transformOnCreate={transformOnCreate}
          onCreateApi={onCreateApi}
          handleCreateSuccess={handleCreateSuccess}
          handleCreateError={handleCreateError}
          closeCreateModal={closeCreateModal}
          createFormComponent={createFormComponent}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        opened={isEditModalOpen}
        onClose={closeEditModal}
        title={
          <Text tt="uppercase" size="xs" fw={700}>
            Edit {moduleTerm}
          </Text>
        }
        size={modalWidth}
      >
        <EditModalContent
          moduleTerm={moduleTerm}
          idAccessor={idAccessor}
          transformOnEdit={transformOnEdit}
          onEditApi={onEditApi}
          handleEditSuccess={handleEditSuccess}
          handleEditError={handleEditError}
          closeEditModal={closeEditModal}
          editFormComponent={editFormComponent}
          activeEditRecord={activeEditRecord}
          editLoading={editLoading}
        />
      </Modal>
    </>
  );
}
