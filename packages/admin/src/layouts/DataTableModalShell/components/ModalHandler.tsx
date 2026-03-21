"use client";

import {
  Modal,
  Stack,
  Text,
  LoadingOverlay,
  Button,
  Group,
  Divider,
  SimpleGrid,
  Paper,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  PropModalHandler,
  PropModalStepper,
  PropSharedModalBody,
  PropSharedModalContent,
} from "../DataTableModalShell.type";
import { useDataTableModalShellContext } from "../DataTableModalShell.context";
import { DataTableWrapper, FormWrapper } from "@settle/core";
import {
  CheckIcon,
  EraserIcon,
  XIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import { Step } from "../../FormShell/FormShell.type";

export const useEditFormContext = FormWrapper.useForm;
export const useFormProps = FormWrapper.useFormProps;

// ─────────────────────────────────────────────
// Modal Stepper Component
// ─────────────────────────────────────────────

function ModalStepper({ steps, currentStep }: PropModalStepper) {
  return (
    <SimpleGrid spacing={0} cols={steps.length}>
      {steps.map((step, index) => {
        // const isCompleted = index < currentStep;
        // const isActive = index === currentStep;

        const label = typeof step === "string" ? step : step.label;

        return (
          <Paper
            key={index}
            radius={0}
            px="md"
            py="xs"
            bg={
              currentStep > index
                ? "var(--mantine-color-blue-light)"
                : currentStep === index
                  ? "var(--mantine-color-brand-light)"
                  : "transparent"
            }
          >
            <Group wrap="nowrap" gap="xs">
              {currentStep > index && <CheckIcon weight="bold" size={12} />}
              <div>
                <Text size={"10px"} opacity={0.5}>
                  {index + 1} of {steps.length}
                </Text>
                <Text fw={800} size="xs">
                  {label}
                </Text>
              </div>
            </Group>
          </Paper>
        );
      })}
    </SimpleGrid>
  );
}

// ─────────────────────────────────────────────
// Shared Modal Body Component
// ─────────────────────────────────────────────

function SharedModalBody({
  formComponent,
  closeModal,
  stepLabels,
  totalSteps,
  isCreate,
}: PropSharedModalBody) {
  const { isLoading, handleSubmit, handleStepNext, handleStepBack, current } =
    FormWrapper.useFormProps();

  const isMultiStep = totalSteps > 1;
  const isFirstStep = current === 0;
  const isLastStep = current === totalSteps - 1;

  return (
    <Stack gap={0}>
      {/* Step indicator for multi-step forms */}
      {isMultiStep && stepLabels && stepLabels.length > 0 && (
        <ModalStepper steps={stepLabels} currentStep={current} />
      )}

      {isMultiStep && <Divider />}

      <div>
        {formComponent ? (
          typeof formComponent === "function" ? (
            (
              formComponent as (props: {
                isCreate: boolean;
                currentStep: number;
              }) => React.ReactNode
            )({
              isCreate,
              currentStep: current,
            })
          ) : (
            <div>{formComponent as React.ReactNode}</div>
          )
        ) : (
          <Text size="sm" c="dimmed" p="md">
            No form component provided
          </Text>
        )}
      </div>

      <Divider />

      <Group justify="space-between" p="md">
        {/* Left side - Cancel or Back button */}
        {isMultiStep && !isFirstStep ? (
          <Button
            size="xs"
            variant="light"
            onClick={handleStepBack}
            disabled={isLoading}
            leftSection={<ArrowLeftIcon />}
          >
            Previous
          </Button>
        ) : (
          <Button
            size="xs"
            variant="light"
            onClick={closeModal}
            disabled={isLoading}
            leftSection={<XIcon />}
          >
            Cancel
          </Button>
        )}

        {/* Right side - Next/Submit buttons */}
        <Group justify="flex-end" gap="xs">
          {isCreate && !isMultiStep && (
            <Button
              size="xs"
              variant="light"
              onClick={closeModal}
              disabled={isLoading}
              leftSection={<EraserIcon />}
            >
              Clear Fields
            </Button>
          )}

          {isMultiStep && !isLastStep ? (
            <Button
              size="xs"
              onClick={handleStepNext}
              loading={isLoading}
              rightSection={<ArrowRightIcon />}
            >
              Next
            </Button>
          ) : (
            <Button
              size="xs"
              onClick={handleSubmit}
              loading={isLoading}
              rightSection={<CheckIcon />}
            >
              {isCreate ? "Create" : "Update"}
            </Button>
          )}
        </Group>
      </Group>
    </Stack>
  );
}

// ─────────────────────────────────────────────
// Shared Modal Content Component
// ─────────────────────────────────────────────

function SharedModalContent({
  moduleTerm,
  idAccessor,
  apiFunction,
  onSuccessCallback,
  onErrorCallback,
  closeModal,
  formComponent,
  formConfig,
  mode,
  activeRecord,
  transformData,
  loading = false,
}: PropSharedModalContent) {
  const isCreate = mode === "create";
  const formName = `${mode}-${moduleTerm.toLowerCase()}`;
  const queryKey = `${mode}.${moduleTerm.toLowerCase()}`;

  // Merge initial values with active record if editing
  const initialValues = isCreate
    ? (formConfig?.initial ?? {})
    : { ...(formConfig?.initial ?? {}), ...activeRecord };

  // Determine form clearing
  const shouldClear = formConfig?.formClearOnSuccess ?? isCreate;

  return (
    <Stack gap="lg" pos="relative">
      <LoadingOverlay visible={loading} />

      {/* Check if we have what we need to render */}
      {!isCreate && !activeRecord ? (
        <Text size="sm" c="dimmed">
          Loading...
        </Text>
      ) : (
        <FormWrapper
          queryKey={queryKey}
          formName={formName}
          mode="uncontrolled"
          initial={initialValues}
          steps={formConfig?.steps ?? 1}
          validation={formConfig?.validation ?? []}
          disabledSteps={formConfig?.disabledSteps ?? []}
          stepValidationFn={formConfig?.stepValidationFn}
          primaryKey={idAccessor}
          apiSubmitFn={async (data: any) => {
            const dataToSubmit = transformData ? transformData(data) : data;
            if (isCreate) {
              return apiFunction?.(dataToSubmit);
            } else {
              const recordId = data instanceof FormData ? data.get(idAccessor) : data[idAccessor];
              return apiFunction?.(recordId, dataToSubmit);
            }
          }}
          transformFnSubmit={(formdata) => formdata}
          submitFormat={formConfig?.submitFormat}
          hasDirtCheck={formConfig?.hasDirtCheck}
          formatJsonSubmitConfig={formConfig?.formatJsonSubmitConfig}
          formClearOnSuccess={shouldClear}
          submitSuccessFn={onSuccessCallback}
          submitErrorFn={onErrorCallback}
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
          <SharedModalBody
            formComponent={formComponent}
            closeModal={closeModal}
            stepLabels={formConfig?.stepLabels}
            totalSteps={formConfig?.steps ?? 1}
            isCreate={isCreate}
          />
        </FormWrapper>
      )}
    </Stack>
  );
}

// ─────────────────────────────────────────────
// Main Modal Handler
// ─────────────────────────────────────────────

export function ModalHandler({
  modalWidth = "md",
  onCreateApi,
  onEditApi,
  onCreateSuccess,
  onEditSuccess,
  // onEditTrigger, // Not used in this component directly
  transformOnCreate,
  transformOnEdit,
  // validator, // Not used
  idAccessor = "id",
  createFormComponent,
  editFormComponent,
  createModalTitle,
  editModalTitle,
  createFormConfig,
  editFormConfig,
  moduleName = "Item",
  moduleTerm = "Item",
}: PropModalHandler) {
  const {
    isCreateModalOpen,
    isEditModalOpen,
    activeEditRecord,
    editLoading,
    closeCreateModal,
    closeEditModal,
  } = useDataTableModalShellContext();

  const { refetch } = DataTableWrapper.useDataTableContext();

  // ─────────────────────────────────────────────
  // Callbacks
  // ─────────────────────────────────────────────

  const handleSuccess =
    (msg: string, callback?: (res: any) => void, closeFn?: () => void) =>
    (res: any) => {
      notifications.show({
        title: "Success",
        message: msg,
        color: "green",
      });
      callback?.(res);
      closeFn?.();
      refetch();
    };

  const handleError = (msg: string) => (err: any) => {
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
        message: msg,
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
        title={createModalTitle ?? `New ${moduleTerm}`}
        size={modalWidth}
      >
        <SharedModalContent
          mode="create"
          moduleTerm={moduleTerm}
          idAccessor={idAccessor}
          apiFunction={onCreateApi}
          transformData={transformOnCreate}
          onSuccessCallback={handleSuccess(
            `${moduleTerm} created successfully`,
            onCreateSuccess,
            closeCreateModal,
          )}
          onErrorCallback={handleError(`Failed to create ${moduleTerm}`)}
          closeModal={closeCreateModal}
          formComponent={createFormComponent}
          formConfig={createFormConfig}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        opened={isEditModalOpen}
        onClose={closeEditModal}
        title={editModalTitle ?? `Edit ${moduleTerm}`}
        size={modalWidth}
      >
        <SharedModalContent
          mode="edit"
          moduleTerm={moduleTerm}
          idAccessor={idAccessor}
          apiFunction={onEditApi}
          transformData={transformOnEdit}
          onSuccessCallback={handleSuccess(
            `${moduleTerm} updated successfully`,
            onEditSuccess,
            closeEditModal,
          )}
          onErrorCallback={handleError(`Failed to update ${moduleTerm}`)}
          closeModal={closeEditModal}
          formComponent={editFormComponent}
          formConfig={editFormConfig}
          activeRecord={activeEditRecord}
          loading={editLoading}
        />
      </Modal>
    </>
  );
}
