"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import { USERS_MODULE_CONFIG, USER_API } from "../../module.config";
import { UsersForm } from "../../form/UsersForm";
import { UsersEditForm } from "../../form/UsersEditForm";
import { usersCreateFormConfig, usersEditFormConfig } from "../../form/form.config";
import { usersListColumns } from "./list.columns";

export function ListPage() {
  return (
    <DataTableWrapper
      queryKey="users.list"
      queryGetFn={async () => USER_API.getUsers()}
      dataKey="data"
    >
      <DataTableModalShell
        moduleInfo={USERS_MODULE_CONFIG}
        columns={usersListColumns}
        idAccessor="id"
        filterList={[]}
        onCreateApi={async (data) => USER_API.createUser(data)}
        onEditApi={async (id, data) => USER_API.updateUser(String(id), data)}
        onDeleteApi={async (id) => USER_API.deleteUser(String(id))}
        createFormComponent={<UsersForm />}
        editFormComponent={<UsersEditForm />}
        createFormConfig={usersCreateFormConfig}
        editFormConfig={usersEditFormConfig}
        onEditTrigger={async (row) => {
          // Fetch full user record on edit
          const response = await USER_API.getUser(String(row.id));
          return response.data;
        }}
        modalWidth="lg"
      />
    </DataTableWrapper>
  );
}
