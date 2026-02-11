"use client";

import { TextInput, Select, Stack, Checkbox } from "@mantine/core";
import { FormWrapper } from "@settle/core";

export function OrganizationForm() {
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
                    description="Unique identifier (e.g., DAO_GORKHA)"
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
                <Select
                    label="Organization Type"
                    data={[
                        { value: "GOVERNMENT_BODY", label: "Government Body" },
                        { value: "CIVIL_SOCIETY", label: "Civil Society" },
                        { value: "OTHER", label: "Other" },
                    ]}
                    {...form.getInputProps("organization_type")}
                    required
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
