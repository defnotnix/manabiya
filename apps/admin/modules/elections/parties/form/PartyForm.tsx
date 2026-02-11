"use client";

import { TextInput, NumberInput, Textarea, Stack, SimpleGrid } from "@mantine/core";
import { FormWrapper } from "@settle/core";

export function PartyForm() {
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
                        label="Name (English)"
                        placeholder="e.g. Nepali Congress"
                        {...form.getInputProps("name")}
                        required
                    />
                    <TextInput
                        label="Name (Nepali)"
                        placeholder="e.g. नेपाली कांग्रेस"
                        {...form.getInputProps("name_ne")}
                    />
                </SimpleGrid>

                <SimpleGrid cols={2}>
                    <TextInput
                        label="Abbreviation"
                        placeholder="e.g. NC"
                        {...form.getInputProps("abbrev")}
                    />
                    <NumberInput
                        label="Founded Year"
                        placeholder="e.g. 1950"
                        {...form.getInputProps("founded_year")}
                    />
                </SimpleGrid>

                <TextInput
                    label="Leader Name"
                    placeholder="Current party leader"
                    {...form.getInputProps("leader_name")}
                />

                <SimpleGrid cols={2}>
                    <TextInput
                        label="Political Position"
                        placeholder="e.g. Centre to centre-left"
                        {...form.getInputProps("political_position")}
                    />
                    <TextInput
                        label="Ideology"
                        placeholder="e.g. Social democracy"
                        {...form.getInputProps("ideology")}
                    />
                </SimpleGrid>

                <button type="submit" disabled={isLoading} style={{ display: "none" }}>
                    Submit
                </button>
            </Stack>
        </form>
    );
}
