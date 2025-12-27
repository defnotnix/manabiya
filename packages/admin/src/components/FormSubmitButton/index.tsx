"use client";

import { Button, Group, GroupProps } from "@mantine/core";
import { FormWrapper } from "@settle/core";

interface FormSubmitButtonProps extends GroupProps {
  isCreate?: boolean;
  isLoading?: boolean;
}

export function FormSubmitButton({
  isCreate = true,
  isLoading,
  ...groupProps
}: FormSubmitButtonProps) {
  const { handleSubmit, isLoading: formIsLoading } = FormWrapper.useFormProps();
  const loading = isLoading ?? formIsLoading;

  const buttonText = isCreate
    ? loading
      ? "Creating..."
      : "Create"
    : loading
      ? "Updating..."
      : "Save Changes";

  return (
    <Group justify="flex-end" mt="md" {...groupProps}>
      <Button
        type="submit"
        disabled={loading}
        onClick={handleSubmit}
        loading={loading}
      >
        {buttonText}
      </Button>
    </Group>
  );
}
