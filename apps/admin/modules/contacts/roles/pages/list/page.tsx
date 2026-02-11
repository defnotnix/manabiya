"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import { ROLE_MODULE_CONFIG, ROLE_API } from "../../module.config";
import { RoleForm } from "../../form/RoleForm";
import { columns } from "./list.column";

export function ListPage() {
    return (
        <DataTableWrapper
            queryKey="role.list"
            queryGetFn={ROLE_API.getRoles}
            dataKey="results"
        >
            <DataTableModalShell
                moduleInfo={ROLE_MODULE_CONFIG}
                columns={columns}
                idAccessor="id"
                filterList={[]}

                // API Handlers
                onCreateApi={async (data) => {
                    const response = await ROLE_API.createRole(data);
                    return response.data;
                }}
                onEditApi={async (id, data) => {
                    const response = await ROLE_API.updateRole(String(id), data);
                    return response.data;
                }}
                onDeleteApi={async (id) => {
                    await ROLE_API.deleteRole(String(id));
                }}

                // Forms
                createFormComponent={<RoleForm />}
                editFormComponent={<RoleForm />}

                modalWidth="md"
            />
        </DataTableWrapper>
    );
}
