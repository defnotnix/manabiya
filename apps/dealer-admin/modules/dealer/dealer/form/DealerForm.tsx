"use client";

import { Button, Stack, TextInput } from "@mantine/core";
import { FormWrapper } from "@settle/core";

export function DealerForm() {
  const form = FormWrapper.useForm();
  const { handleSubmit, isLoading } = FormWrapper.useFormProps();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Stack>
        <TextInput
          label="Dealer Name"
          placeholder="Enter dealer name"
          {...form.getInputProps("name")}
          required
        />

        <Button type="submit" loading={isLoading}>
          Submit
        </Button>
      </Stack>
    </form>
  );
}
