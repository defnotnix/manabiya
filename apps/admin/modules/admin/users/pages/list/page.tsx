"use client";

import { useState, useCallback } from "react";
import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import { USERS_MODULE_CONFIG, USERS_API } from "../../module.config";
import { UsersForm } from "../../form/UsersForm";
import { UsersFormConfig, USER_TYPES } from "../../form/form.config";
import { usersListColumns } from "./list.columns";
import { UsersProfileModal } from "./components/UsersProfileModal";
import { DATA_ENTRY_ACCOUNTS_API } from "../../../elections/data-entry-accounts/module.api";

export function ListPage() {
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const handleReviewClick = useCallback((row: any) => {
    setSelectedRecord(row);
    setProfileModalOpen(true);
  }, []);

  return (
    <>
      <DataTableWrapper
        queryKey="users.list"
        queryGetFn={async ({ params }) => {
          return USERS_API.getUsers(params);
        }}
        dataKey="users"
      >
        <DataTableModalShell
          moduleInfo={USERS_MODULE_CONFIG}
          columns={usersListColumns}
          idAccessor="id"
          hasServerSearch={true}
          filterList={[
            {
              label: "Eye Color",
              field: "eyeColor", // This will be passed as { eyeColor: 'Green' } to API
              type: "select",
              options: [
                { value: "Green", label: "Green" },
                { value: "Blue", label: "Blue" },
                { value: "Brown", label: "Brown" },
                { value: "Hazel", label: "Hazel" },
                { value: "Gray", label: "Gray" },
              ],
            },
            {
              label: "Gender",
              field: "gender",
              type: "select",
              options: [
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ],
            },
          ]}
          // Modal API handlers - route based on user type
          onCreateApi={async (data) => {
            const { userType, ...userData } = data;

            // Data entry users use the data entry accounts API
            if (userType === USER_TYPES.DATA_ENTRY) {
              return DATA_ENTRY_ACCOUNTS_API.createAccount({
                username: userData.username,
                password: userData.password,
                polling_stations: userData.polling_stations,
                is_active: userData.is_active,
                is_disabled: userData.is_disabled,
              });
            }

            // Staff and Superuser use the default users API
            return USERS_API.createUser({
              ...userData,
              is_superuser: userType === USER_TYPES.SUPERUSER,
              is_staff: userType === USER_TYPES.STAFF || userType === USER_TYPES.SUPERUSER,
            });
          }}
          onEditApi={async (id, data) => {
            return USERS_API.updateUser(String(id), data);
          }}
          onDeleteApi={async (id) => {
            await USERS_API.deleteUser(String(id));
          }}
          // Form components
          createFormComponent={({ currentStep }) => (
            <UsersForm currentStep={currentStep} isCreate={true} />
          )}
          editFormComponent={({ currentStep }) => (
            <UsersForm currentStep={currentStep} isCreate={false} />
          )}
          // Form configs
          createFormConfig={UsersFormConfig}
          editFormConfig={UsersFormConfig}
          // Modal configuration
          modalWidth="lg"
          createModalTitle="Add New User"
          editModalTitle="Edit User"
          onReviewClick={handleReviewClick}
        />
      </DataTableWrapper>

      <UsersProfileModal
        opened={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        record={selectedRecord}
      />
    </>
  );
}
