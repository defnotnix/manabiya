"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import { ROLES_MODULE_CONFIG, ROLES_API } from "../../module.config";
import { RoleForm } from "../../form/RoleForm";
import { columns } from "./list.column";

export function ListPage() {
  return (
    <DataTableWrapper
      queryKey="roles.list"
      queryGetFn={ROLES_API.getRoles}
      dataKey="results"
    >
      <DataTableModalShell
        moduleInfo={ROLES_MODULE_CONFIG}
        columns={columns}
        idAccessor="id"
        filterList={[]}
        // API Handlers
        onCreateApi={async (data) => {
          // Transform permissions from ["1", "2"] (strings from MultiSelect) to [1, 2] (numbers) because the API likely expects numbers
          const payload = {
            ...data,
            permissions: data.permissions?.map((p: string) => Number(p)) || [],
          };
          const response = await ROLES_API.createRole(payload);
          return response.data;
        }}
        onEditApi={async (id, data) => {
          const payload = {
            ...data,
            permissions: data.permissions?.map((p: string) => Number(p)) || [],
          };
          const response = await ROLES_API.updateRole(String(id), payload);
          return response.data;
        }}
        onDeleteApi={async (id) => {
          await ROLES_API.deleteRole(String(id));
        }}
        // Forms
        createFormComponent={<RoleForm isCreate={true} />}
        editFormComponent={<RoleForm isCreate={false} />}
        modalWidth="md"
        createModalTitle="Create New Role"
        editModalTitle="Edit Role"
      />
    </DataTableWrapper>
  );
}
