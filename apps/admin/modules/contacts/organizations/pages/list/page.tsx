"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import { ORGANIZATION_MODULE_CONFIG, ORGANIZATION_API } from "../../module.config";
import { OrganizationForm } from "../../form/OrganizationForm";
import { columns } from "./list.column";

export function ListPage() {
    return (
        <DataTableWrapper
            queryKey="organization.list"
            queryGetFn={ORGANIZATION_API.getOrganizations}
            dataKey="results"
        >
            <DataTableModalShell
                moduleInfo={ORGANIZATION_MODULE_CONFIG}
                columns={columns}
                idAccessor="id"
                filterList={[]}

                // API Handlers
                onCreateApi={async (data) => {
                    const response = await ORGANIZATION_API.createOrganization(data);
                    return response.data;
                }}
                onEditApi={async (id, data) => {
                    const response = await ORGANIZATION_API.updateOrganization(String(id), data);
                    return response.data;
                }}
                onDeleteApi={async (id) => {
                    await ORGANIZATION_API.deleteOrganization(String(id));
                }}

                // Forms
                createFormComponent={<OrganizationForm />}
                editFormComponent={<OrganizationForm />}

                modalWidth="lg"
            />
        </DataTableWrapper>
    );
}
