"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import { ASSIGNMENT_MODULE_CONFIG, ASSIGNMENT_API } from "../../module.config";
import { PERSON_API } from "../../../people/module.api";
import { AssignmentForm } from "../../form/AssignmentForm";
import { columns } from "./list.column";

export function ListPage() {
    return (
        <DataTableWrapper
            queryKey="assignment.list"
            queryGetFn={ASSIGNMENT_API.getAssignments}
            dataKey="results"
        >
            <DataTableModalShell
                moduleInfo={ASSIGNMENT_MODULE_CONFIG}
                columns={columns}
                idAccessor="id"
                filterList={[
                    { label: "Role", value: "role" },
                    { label: "Party", value: "party" },
                    { label: "Organization", value: "organization" },
                ]}

                // API Handlers
                onCreateApi={async (data) => {
                    // Step 1: Extract person data and create person
                    const personData = {
                        name: data.person_name,
                        name_en: data.person_name_en,
                        primary_phone: data.person_primary_phone,
                        secondary_phone: data.person_secondary_phone,
                        email: data.person_email,
                        address: data.person_address || null,
                        is_active: true,
                    };

                    const personResponse = await PERSON_API.createPerson(personData);
                    const personId = personResponse.data?.id;

                    if (!personId) {
                        throw new Error("Failed to create person");
                    }

                    // Step 2: Create assignment with person ID
                    const assignmentData = {
                        contact: personId,
                        role: data.role,
                        organization: data.organization || null,
                        party: data.party || null,
                        geo_unit: data.geo_unit,
                        place: data.place || null,
                        label: data.label,
                        priority: data.priority,
                        experience_remarks: data.experience_remarks,
                        notes: data.notes,
                        is_primary: data.is_primary || false,
                        is_active: data.is_active !== false,
                    };

                    const response = await ASSIGNMENT_API.createAssignment(assignmentData);
                    return response.data;
                }}
                onEditApi={async (id, data) => {
                    const response = await ASSIGNMENT_API.updateAssignment(String(id), data);
                    return response.data;
                }}
                onDeleteApi={async (id) => {
                    await ASSIGNMENT_API.deleteAssignment(String(id));
                }}

                // Forms
                createFormComponent={<AssignmentForm />}
                editFormComponent={<AssignmentForm />}

                modalWidth="lg"
            />
        </DataTableWrapper>
    );
}
