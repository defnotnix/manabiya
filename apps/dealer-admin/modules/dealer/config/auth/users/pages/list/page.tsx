"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import { USERS_MODULE_CONFIG, USERS_API } from "../../module.config";
import { UserForm, USER_TYPES } from "../../form/UserForm";
import { UserFormConfig } from "../../form/form.config";
import { columns } from "./list.column";

export function ListPage() {
  return (
    <DataTableWrapper
      queryKey="users.list"
      queryGetFn={USERS_API.getUsers}
      dataKey="results"
    >
      <DataTableModalShell
        moduleInfo={USERS_MODULE_CONFIG}
        columns={columns}
        idAccessor="id"
        filterList={[]}
        // API Handlers - route based on user type
        onCreateApi={async (data) => {
          const { userType, ...userData } = data;

          // Staff and Superuser use the default users API
          const payload = {
            ...userData,
            is_staff:
              userType === USER_TYPES.STAFF ||
              userType === USER_TYPES.SUPERUSER,
            is_superuser: userType === USER_TYPES.SUPERUSER,
            groups: userData.groups?.map((g: string) => Number(g)) || [],
            user_permissions:
              userData.user_permissions?.map((p: string) => Number(p)) || [],
          };
          const response = await USERS_API.createUser(payload);
          return response.data;
        }}
        onEditApi={async (id, data) => {
          const payload = {
            ...data,
            groups: data.groups?.map((g: string) => Number(g)) || [],
            user_permissions:
              data.user_permissions?.map((p: string) => Number(p)) || [],
          };
          const response = await USERS_API.updateUser(String(id), payload);
          return response.data;
        }}
        onDeleteApi={async (id) => {
          await USERS_API.deleteUser(String(id));
        }}
        // Forms
        createFormComponent={<UserForm isCreate={true} />}
        editFormComponent={<UserForm isCreate={false} />}
        createFormConfig={UserFormConfig}
        editFormConfig={UserFormConfig}
        modalWidth="lg"
        createModalTitle="Create New User"
        editModalTitle="Edit User"
      />
    </DataTableWrapper>
  );
}
