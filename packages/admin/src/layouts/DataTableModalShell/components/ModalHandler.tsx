"use client";

import { Modal, Stack, Text, LoadingOverlay } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { PropDataTableModalShell } from "../DataTableModalShell.type";
import { useDataTableModalShellContext } from "../DataTableModalShell.context";
import { DataTableWrapper } from "@settle/core";
import { FormWrapper } from "@settle/core";

export const useEditFormContext = FormWrapper.useForm;

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
          <Stack gap="lg">
            {createFormComponent ? (
              typeof createFormComponent === "function" ? (
                (createFormComponent as (props: { isCreate: boolean }) => React.ReactNode)({
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
          </Stack>
        </FormWrapper>
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
              <Stack gap="lg">
                {typeof editFormComponent === "function"
                  ? (editFormComponent as (props: { isCreate: boolean }) => React.ReactNode)({
                      isCreate: false,
                    })
                  : (editFormComponent as React.ReactNode)}
              </Stack>
            </FormWrapper>
          ) : (
            <Text size="sm" color="dimmed">
              {activeEditRecord ? "Loading..." : "No form component provided"}
            </Text>
          )}
        </Stack>
      </Modal>
    </>
  );
}
