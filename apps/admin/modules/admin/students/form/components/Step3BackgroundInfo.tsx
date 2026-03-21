"use client";

import { Stack, Text, Group, Button } from "@mantine/core";
import { FormWrapper } from "@settle/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { FormListRender } from "./FormListRender";
import { ExperienceModal } from "../../modals/ExperienceModal";
import { EducationModal } from "../../modals/EducationModal";
import { FamilyMemberModal } from "../../modals/FamilyMemberModal";
import { FloppyDiskIcon } from "@phosphor-icons/react";

interface Step3BackgroundInfoProps {
    disabled?: boolean;
    onSave?: () => void;
    isSaving?: boolean;
}

export function Step3BackgroundInfo({ disabled = false, onSave, isSaving = false }: Step3BackgroundInfoProps) {
    const form = FormWrapper.useForm();
    const [, forceUpdate] = useState({});

    // Experience State
    const [expOpened, { open: openExp, close: closeExp }] = useDisclosure(false);
    const [editExp, setEditExp] = useState<{ item: any; index: number } | null>(null);

    // Education State
    const [eduOpened, { open: openEdu, close: closeEdu }] = useDisclosure(false);
    const [editEdu, setEditEdu] = useState<{ item: any; index: number } | null>(null);

    // Family Member State
    const [famOpened, { open: openFam, close: closeFam }] = useDisclosure(false);
    const [editFam, setEditFam] = useState<{ item: any; index: number } | null>(null);

    const handleSuccess = (field: string, data: any, editState: { item: any; index: number } | null) => {
        const currentList = [...(form.getValues()[field] || [])];
        if (editState !== null) {
            currentList[editState.index] = data;
        } else {
            currentList.push(data);
        }
        form.setFieldValue(field, currentList);
        forceUpdate({});
    };

    const handleRemove = (field: string, index: number) => {
        const currentList = [...(form.getValues()[field] || [])];
        currentList.splice(index, 1);
        form.setFieldValue(field, currentList);
        forceUpdate({});
    };

    const values = form.getValues();

    return (
        <Stack gap="xl">
            {onSave && (
                <Group justify="flex-end">
                    <Button
                        size="xs"
                        loading={isSaving}
                        onClick={onSave}
                        leftSection={<FloppyDiskIcon size={14} />}
                        disabled={disabled}
                    >
                        Save Changes
                    </Button>
                </Group>
            )}

            <FormListRender
                title="Experiences"
                items={values.experiences || []}
                disabled={disabled}
                onAdd={() => {
                    setEditExp(null);
                    openExp();
                }}
                onEdit={(item, index) => {
                    setEditExp({ item, index });
                    openExp();
                }}
                onRemove={(index) => handleRemove("experiences", index)}
                renderItem={(item) => (
                    <Stack gap={0}>
                        <Text size="sm" fw={600}>
                            {item.company}
                        </Text>
                        <Text size="xs" c="dimmed">
                            {item.role} | {item.start_period} to {item.end_period || "Present"}
                        </Text>
                    </Stack>
                )}
            />

            <FormListRender
                title="Educations"
                items={values.educations || []}
                disabled={disabled}
                onAdd={() => {
                    setEditEdu(null);
                    openEdu();
                }}
                onEdit={(item, index) => {
                    setEditEdu({ item, index });
                    openEdu();
                }}
                onRemove={(index) => handleRemove("educations", index)}
                renderItem={(item) => (
                    <Stack gap={0}>
                        <Text size="sm" fw={600}>
                            {item.institution}
                        </Text>
                        <Text size="xs" c="dimmed">
                            {item.degree} in {item.field_of_study} | {item.start_period} to {item.end_period || "Present"}
                        </Text>
                    </Stack>
                )}
            />

            <FormListRender
                title="Family Members"
                items={values.family_members || []}
                disabled={disabled}
                onAdd={() => {
                    setEditFam(null);
                    openFam();
                }}
                onEdit={(item, index) => {
                    setEditFam({ item, index });
                    openFam();
                }}
                onRemove={(index) => handleRemove("family_members", index)}
                renderItem={(item) => (
                    <Stack gap={0}>
                        <Text size="sm" fw={600}>
                            {item.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                            {item.relationship} | Contact: {item.contact || "N/A"}
                        </Text>
                    </Stack>
                )}
            />

            {/* Modals */}
            <ExperienceModal
                opened={expOpened}
                onClose={closeExp}
                localMode={true}
                editRecord={editExp?.item}
                onSuccess={(data) => {
                    handleSuccess("experiences", data, editExp);
                    closeExp();
                }}
            />

            <EducationModal
                opened={eduOpened}
                onClose={closeEdu}
                localMode={true}
                editRecord={editEdu?.item}
                onSuccess={(data) => {
                    handleSuccess("educations", data, editEdu);
                    closeEdu();
                }}
            />

            <FamilyMemberModal
                opened={famOpened}
                onClose={closeFam}
                localMode={true}
                editRecord={editFam?.item}
                onSuccess={(data) => {
                    handleSuccess("family_members", data, editFam);
                    closeFam();
                }}
            />
        </Stack>
    );
}
