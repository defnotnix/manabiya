"use client";

import {
  Stack,
  TextInput,
  PasswordInput,
  Checkbox,
  Divider,
  Group,
  Text,
  Loader,
  MultiSelect,
  SimpleGrid,
  Select,
  Card,
  ThemeIcon,
} from "@mantine/core";
import { MagnifyingGlassIcon, User, UserGear, Database } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { FormWrapper } from "@settle/core";
import { USERS_API } from "../module.api";
import { useMemo, useState } from "react";
import { PollingStationMultiSelect } from "@/modules/admin/elections/data-entry-accounts/form/PollingStationMultiSelect";

// User Type Constants
export const USER_TYPES = {
  STAFF: "staff",
  SUPERUSER: "superuser",
  DATA_ENTRY: "data_entry",
} as const;

export type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];

interface UserFormProps {
  currentStep?: number;
  isCreate?: boolean;
}

interface Permission {
  id: number;
  name: string;
  codename: string;
  content_type: number;
}

interface Role {
  id: number;
  name: string;
}

// User Type Card Component
function UserTypeCard({
  title,
  description,
  icon,
  selected,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Card
      withBorder
      padding="md"
      style={{
        cursor: "pointer",
        borderColor: selected ? "var(--mantine-color-blue-6)" : undefined,
        backgroundColor: selected ? "var(--mantine-color-blue-0)" : undefined,
      }}
      onClick={onClick}
    >
      <Stack align="center" gap="xs">
        <ThemeIcon size="lg" variant={selected ? "filled" : "light"} color="blue">
          {icon}
        </ThemeIcon>
        <Text fw={600} size="xs">
          {title}
        </Text>
        <Text size="xs" c="dimmed" ta="center">
          {description}
        </Text>
      </Stack>
    </Card>
  );
}

// Account status options
const ACCOUNT_STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "disabled", label: "Disabled" },
];

export function UserForm({ currentStep = 0, isCreate = true }: UserFormProps) {
  const form = FormWrapper.useForm();
  const [search, setSearch] = useState("");
  const userType = form.values.userType as UserType;

  // Get current status value for Select
  const currentStatus = form.values.is_disabled ? "disabled" : "active";

  // Handle status change from Select
  const handleStatusChange = (value: string | null) => {
    if (value === "disabled") {
      form.setFieldValue("is_active", false);
      form.setFieldValue("is_disabled", true);
    } else {
      form.setFieldValue("is_active", true);
      form.setFieldValue("is_disabled", false);
    }
  };

  // Fetch Permissions
  const { data: permissions = [], isLoading: loadingPermissions } = useQuery({
    queryKey: ["users", "permissions"],
    queryFn: async () => {
      const response = await USERS_API.getPermissions();
      return (response.data as Permission[]) || [];
    },
  });

  // Fetch Roles (Groups)
  const { data: roles = [], isLoading: loadingRoles } = useQuery({
    queryKey: ["users", "roles"],
    queryFn: async () => {
      const response = await USERS_API.getRoles();
      return (response.data as Role[]) || [];
    },
  });

  const roleOptions = useMemo(() => {
    return roles.map((r) => ({
      value: String(r.id),
      label: r.name,
    }));
  }, [roles]);

  // Filter and group permissions (Reused from RoleForm)
  const groupedPermissions = useMemo(() => {
    const filtered = permissions.filter(
      (p) =>
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.codename.toLowerCase().includes(search.toLowerCase()),
    );

    return filtered.reduce(
      (acc, permission) => {
        const type = permission.content_type;
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(permission);
        return acc;
      },
      {} as Record<number, Permission[]>,
    );
  }, [permissions, search]);

  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    // Note: Field name is 'user_permissions' in API payload, let's assume form uses 'user_permissions'
    const currentPermissions = (form.values.user_permissions || []).map(
      (p: any) => String(p),
    );
    const idStr = String(permissionId);

    let newPermissions;
    if (checked) {
      newPermissions = [...currentPermissions, idStr];
    } else {
      newPermissions = currentPermissions.filter((id: string) => id !== idStr);
    }

    form.setFieldValue("user_permissions", newPermissions);
  };

  // If user type not selected (only for create mode), show user type selection
  if (isCreate && !userType) {
    return (
      <Stack gap="sm" p="sm">
        <Text fw={600} size="sm" c="dimmed">
          Select User Type
        </Text>
        <Text size="xs" c="dimmed">
          Choose the type of user account you want to create
        </Text>
        <SimpleGrid cols={3} spacing="sm" mt="sm">
          <UserTypeCard
            title="Staff"
            description="Regular staff member"
            icon={<User size={20} />}
            selected={userType === USER_TYPES.STAFF}
            onClick={() => form.setFieldValue("userType", USER_TYPES.STAFF)}
          />
          <UserTypeCard
            title="Superuser"
            description="Full system access"
            icon={<UserGear size={20} />}
            selected={userType === USER_TYPES.SUPERUSER}
            onClick={() => form.setFieldValue("userType", USER_TYPES.SUPERUSER)}
          />
          <UserTypeCard
            title="Data Entry"
            description="Data entry with polling station access"
            icon={<Database size={20} />}
            selected={userType === USER_TYPES.DATA_ENTRY}
            onClick={() => form.setFieldValue("userType", USER_TYPES.DATA_ENTRY)}
          />
        </SimpleGrid>
        {form.errors.userType && (
          <Text size="xs" c="red">
            {form.errors.userType}
          </Text>
        )}
      </Stack>
    );
  }

  // Data Entry User Form
  if (userType === USER_TYPES.DATA_ENTRY) {
    return (
      <Stack gap="sm" p="sm">
        <Text fw={600} size="sm" c="dimmed">
          Data Entry Account
        </Text>
        <TextInput
          label="Username"
          placeholder="username"
          {...form.getInputProps("username")}
          required
          size="xs"
        />
        <PasswordInput
          label="Password"
          placeholder="Password"
          {...form.getInputProps("password")}
          required
          size="xs"
        />
        <PollingStationMultiSelect
          value={form.values.polling_stations || []}
          onChange={(val) => form.setFieldValue("polling_stations", val)}
          error={form.errors.polling_stations as string}
        />
        <Select
          label="Account Status"
          data={ACCOUNT_STATUS_OPTIONS}
          value={currentStatus}
          onChange={handleStatusChange}
          size="xs"
        />
      </Stack>
    );
  }

  // Staff/Superuser Form
  return (
    <Stack gap="sm" p="sm">
      <SimpleGrid cols={2}>
        <TextInput
          label="Username"
          placeholder="username"
          {...form.getInputProps("username")}
          required
          size="xs"
        />
        <TextInput
          label="Email"
          placeholder="email@example.com"
          {...form.getInputProps("email")}
          required
          size="xs"
        />
      </SimpleGrid>

      <SimpleGrid cols={2}>
        <TextInput
          label="First Name"
          placeholder="First Name"
          {...form.getInputProps("first_name")}
          size="xs"
        />
        <TextInput
          label="Last Name"
          placeholder="Last Name"
          {...form.getInputProps("last_name")}
          size="xs"
        />
      </SimpleGrid>

      {isCreate && (
        <PasswordInput
          label="Password"
          placeholder="Password"
          {...form.getInputProps("password")}
          required
          size="xs"
        />
      )}

      <Select
        label="Account Status"
        data={ACCOUNT_STATUS_OPTIONS}
        value={currentStatus}
        onChange={handleStatusChange}
        size="xs"
      />

      <MultiSelect
        label="Groups (Roles)"
        placeholder="Select roles"
        data={roleOptions}
        {...form.getInputProps("groups")}
        searchable
        clearable
        disabled={loadingRoles}
        size="xs"
      />

      <TextInput
        placeholder="Search permissions..."
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        leftSection={<MagnifyingGlassIcon />}
        size="xs"
        mt="sm"
      />

      {loadingPermissions ? (
        <Loader size="xs" />
      ) : (
        <Stack gap="xs" mah={300} style={{ overflowY: "auto" }}>
          {Object.entries(groupedPermissions).length === 0 ? (
            <Text size="xs" c="dimmed" ta="center" py="md">
              No permissions found
            </Text>
          ) : (
            Object.entries(groupedPermissions).map(
              ([contentType, groupPerms], index) => (
                <div key={contentType}>
                  {index > 0 && <Divider my="xs" />}
                  <Stack gap="xs">
                    {groupPerms.map((permission) => {
                      const isChecked = (
                        form.values.user_permissions || []
                      ).some((p: any) => String(p) === String(permission.id));
                      return (
                        <Group
                          key={permission.id}
                          justify="space-between"
                          align="center"
                          py={2}
                        >
                          <Text size="xs">
                            {permission.name || permission.codename}
                          </Text>
                          <Checkbox
                            checked={isChecked}
                            onChange={(event) =>
                              handlePermissionChange(
                                permission.id,
                                event.currentTarget.checked,
                              )
                            }
                            size="xs"
                          />
                        </Group>
                      );
                    })}
                  </Stack>
                </div>
              ),
            )
          )}
        </Stack>
      )}
    </Stack>
  );
}
