"use client";

import { useEffect, useState } from "react";
import { TextInput, Select, NumberInput, Textarea, Stack, Checkbox, SimpleGrid, Paper, Text, Divider } from "@mantine/core";
import { FormWrapper } from "@settle/core";
import { ORGANIZATION_API } from "../../organizations/module.api";
import { ROLE_API } from "../../roles/module.api";
import { PARTY_API } from "../../../elections/parties/module.api";
import { useLocationSelector } from "@/components/LocationSelector";

// Helper to extract results from API response
const extractResults = (response: any): any[] => {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (response.results) return response.results;
    if (response.data?.results) return response.data.results;
    return [];
};

// Helper to get display name (prefer English)
const getDisplayName = (item: any): string => {
    return item.name_en || item.name || "-";
};

export function AssignmentForm() {
    const form = FormWrapper.useForm();

    const [organizations, setOrganizations] = useState<{ value: string; label: string }[]>([]);
    const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);
    const [parties, setParties] = useState<{ value: string; label: string }[]>([]);

    // Location selector hook
    const {
        selectedProvince,
        selectedDistrict,
        selectedLocalBody,
        selectedWard,
        setSelectedProvince,
        setSelectedDistrict,
        setSelectedLocalBody,
        setSelectedWard,
        provinceOptions,
        districtOptions,
        localBodyOptions,
        wardOptions,
        placeOptions,
        loadingProvinces,
        loadingDistricts,
        loadingLocalBodies,
        loadingWards,
        loadingPlaces,
    } = useLocationSelector({ fetchPlaces: true });

    // Sync ward selection to form's geo_unit field
    useEffect(() => {
        if (selectedWard) {
            form.setFieldValue("geo_unit", Number(selectedWard));
        } else if (selectedLocalBody) {
            form.setFieldValue("geo_unit", Number(selectedLocalBody));
        } else if (selectedDistrict) {
            form.setFieldValue("geo_unit", Number(selectedDistrict));
        } else if (selectedProvince) {
            form.setFieldValue("geo_unit", Number(selectedProvince));
        } else {
            form.setFieldValue("geo_unit", null);
        }
    }, [selectedWard, selectedLocalBody, selectedDistrict, selectedProvince]);

    // Fetch dropdown options
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [orgsRes, rolesRes, partiesRes] = await Promise.all([
                    ORGANIZATION_API.getOrganizations({ page_size: 100 }),
                    ROLE_API.getRoles({ page_size: 100 }),
                    PARTY_API.getParties({ page_size: 100 }),
                ]);

                const orgs = extractResults(orgsRes);
                const rolesData = extractResults(rolesRes);
                const partiesData = extractResults(partiesRes);

                setOrganizations(orgs.map((item: any) => ({
                    value: String(item.id),
                    label: getDisplayName(item)
                })));
                setRoles(rolesData.map((item: any) => ({
                    value: String(item.id),
                    label: getDisplayName(item)
                })));
                setParties(partiesData.map((item: any) => ({
                    value: String(item.id),
                    label: item.name || item.abbrev || "-"
                })));
            } catch (error) {
                console.error("Failed to fetch options", error);
            }
        };
        fetchOptions();
    }, []);

    return (
        <Stack gap="md" p="md">
                {/* Section 1: Location */}
                <Paper withBorder p="md">
                    <Text size="sm" fw={600} mb="sm">Location</Text>
                    <SimpleGrid cols={2}>
                        <Select
                            label="Province"
                            data={provinceOptions}
                            value={selectedProvince}
                            onChange={setSelectedProvince}
                            searchable
                            clearable
                            disabled={loadingProvinces}
                        />
                        <Select
                            label="District"
                            data={districtOptions}
                            value={selectedDistrict}
                            onChange={setSelectedDistrict}
                            searchable
                            clearable
                            disabled={!selectedProvince || loadingDistricts}
                        />
                        <Select
                            label="Local Body"
                            data={localBodyOptions}
                            value={selectedLocalBody}
                            onChange={setSelectedLocalBody}
                            searchable
                            clearable
                            disabled={!selectedDistrict || loadingLocalBodies}
                        />
                        <Select
                            label="Ward"
                            data={wardOptions}
                            value={selectedWard}
                            onChange={setSelectedWard}
                            searchable
                            clearable
                            disabled={!selectedLocalBody || loadingWards}
                        />
                    </SimpleGrid>
                    <Select
                        label="Place (Optional)"
                        data={placeOptions}
                        {...form.getInputProps("place")}
                        searchable
                        clearable
                        disabled={!selectedWard || loadingPlaces}
                        mt="sm"
                    />
                </Paper>

                {/* Section 2: Person Details */}
                <Paper withBorder p="md">
                    <Text size="sm" fw={600} mb="sm">Person Details</Text>
                    <Stack gap="sm">
                        <SimpleGrid cols={2}>
                            <TextInput
                                label="Name (Nepali)"
                                placeholder="e.g. राम बहादुर"
                                {...form.getInputProps("person_name")}
                                required
                            />
                            <TextInput
                                label="Name (English)"
                                placeholder="e.g. Ram Bahadur"
                                {...form.getInputProps("person_name_en")}
                            />
                        </SimpleGrid>
                        <SimpleGrid cols={2}>
                            <TextInput
                                label="Primary Phone"
                                placeholder="e.g. 9800000000"
                                {...form.getInputProps("person_primary_phone")}
                                required
                            />
                            <TextInput
                                label="Secondary Phone"
                                placeholder="Optional"
                                {...form.getInputProps("person_secondary_phone")}
                            />
                        </SimpleGrid>
                        <TextInput
                            label="Email"
                            type="email"
                            placeholder="Optional"
                            {...form.getInputProps("person_email")}
                        />
                        <TextInput
                            label="Address"
                            placeholder="e.g. Ward 1, Aarughat, Gorkha"
                            {...form.getInputProps("person_address")}
                        />
                    </Stack>
                </Paper>

                {/* Section 3: Assignment Details */}
                <Paper withBorder p="md">
                    <Text size="sm" fw={600} mb="sm">Assignment Details</Text>
                    <Stack gap="sm">
                        <Select
                            label="Role"
                            data={roles}
                            {...form.getInputProps("role")}
                            searchable
                            required
                        />

                        <SimpleGrid cols={2}>
                            <Select
                                label="Organization"
                                data={organizations}
                                {...form.getInputProps("organization")}
                                searchable
                                clearable
                            />
                            <Select
                                label="Party"
                                data={parties}
                                {...form.getInputProps("party")}
                                searchable
                                clearable
                            />
                        </SimpleGrid>

                        <TextInput
                            label="Label"
                            placeholder="e.g. Ward Representative"
                            {...form.getInputProps("label")}
                        />

                        <NumberInput
                            label="Priority"
                            {...form.getInputProps("priority")}
                        />

                        <Textarea
                            label="Experience Remarks"
                            placeholder="Notes about working with this contact"
                            {...form.getInputProps("experience_remarks")}
                        />

                        <Textarea
                            label="Notes"
                            {...form.getInputProps("notes")}
                        />

                        <SimpleGrid cols={2}>
                            <Checkbox
                                label="Is Primary"
                                {...form.getInputProps("is_primary", { type: "checkbox" })}
                            />
                            <Checkbox
                                label="Is Active"
                                {...form.getInputProps("is_active", { type: "checkbox" })}
                            />
                        </SimpleGrid>
                    </Stack>
                </Paper>
            </Stack>
    );
}
