"use client";

import { TextInput, Stack, Checkbox } from "@mantine/core";
import { FormWrapper } from "@settle/core";

export function RoleForm() {
    const form = FormWrapper.useForm();
    const { handleSubmit, isLoading } = FormWrapper.useFormProps();

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
        >
            <Stack gap="md" p="md">
                <TextInput
                    label="Key"
                    description="Unique identifier (e.g., WARD_CHAIR)"
                    {...form.getInputProps("key")}
                    required
                />
                <TextInput
                    label="Name (Nepali)"
                    {...form.getInputProps("name")}
                    required
                />
                <TextInput
                    label="Name (English)"
                    {...form.getInputProps("name_en")}
                />
                <Checkbox
                    label="Is Active"
                    {...form.getInputProps("is_active", { type: "checkbox" })}
                />
                <button type="submit" disabled={isLoading} style={{ display: "none" }}>
                    Submit
                </button>
            </Stack>
        </form>
    );
}
