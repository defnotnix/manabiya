"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import { USERS_MODULE_CONFIG, USER_API } from "../../module.config";
import { UsersForm } from "../../form/UsersForm";
import { UsersEditForm } from "../../form/UsersEditForm";
import { usersCreateFormConfig, usersEditFormConfig } from "../../form/form.config";
import { usersListColumns } from "./list.columns";
import { useIsAdmin } from "@/context/UserContext";
import { Alert, Center } from "@mantine/core";
import { WarningIcon } from "@phosphor-icons/react";

export function ListPage() {
  const isAdmin = useIsAdmin();

  if (!isAdmin) {
    return (
      <Center h="60vh">
        <Alert
          icon={<WarningIcon />}
          title="Access Denied"
          color="red"
          style={{ maxWidth: "500px" }}
        >
          You do not have permission to manage user accounts. Only administrators can create, edit, or delete users.
        </Alert>
      </Center>
    );
  }

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
        onCreateApi={isAdmin ? async (data) => USER_API.createUser(data) : undefined}
        onEditApi={isAdmin ? async (id, data) => USER_API.updateUser(String(id), data) : undefined}
        onDeleteApi={isAdmin ? async (id) => USER_API.deleteUser(String(id)) : undefined}
        createFormComponent={<UsersForm />}
        editFormComponent={<UsersEditForm />}
        createFormConfig={usersCreateFormConfig}
        editFormConfig={usersEditFormConfig}
        onEditTrigger={isAdmin ? async (row) => {
          // Fetch full user record on edit
          const response = await USER_API.getUser(String(row.id));
          return response.data;
        } : undefined}
        modalWidth="lg"
        disableReviewButton={true}
      />
    </DataTableWrapper>
  );
}
