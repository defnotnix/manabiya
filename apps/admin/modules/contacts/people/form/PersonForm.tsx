"use client";

import { TextInput, Textarea, Stack, Checkbox, SimpleGrid } from "@mantine/core";
import { FormWrapper } from "@settle/core";

export function PersonForm() {
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
                <SimpleGrid cols={2}>
                    <TextInput
                        label="Name (Nepali)"
                        {...form.getInputProps("name")}
                        required
                    />
                    <TextInput
                        label="Name (English)"
                        {...form.getInputProps("name_en")}
                    />
                </SimpleGrid>

                <SimpleGrid cols={2}>
                    <TextInput
                        label="Primary Phone"
                        {...form.getInputProps("primary_phone")}
                        required
                    />
                    <TextInput
                        label="Secondary Phone"
                        {...form.getInputProps("secondary_phone")}
                    />
                </SimpleGrid>

                <TextInput
                    label="Email"
                    type="email"
                    {...form.getInputProps("email")}
                />

                <Textarea
                    label="Notes"
                    {...form.getInputProps("notes")}
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
