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
  Switch,
  Paper,
} from "@mantine/core";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { FormWrapper } from "@settle/core";
import { USERS_API } from "../module.api";
import { useMemo, useState } from "react";

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

export function UserForm({ currentStep = 0, isCreate = true }: UserFormProps) {
  const form = FormWrapper.useForm();
  const [search, setSearch] = useState("");

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
      // The Roles API returns { data: [...] } or just array depending on implementation
      // Based on implementation of roles/module.api.ts, getRoles returns { data: [...] }
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

      <Divider label="Access Control" labelPosition="left" />

      <Group grow>
        <Switch
          label="Active"
          {...form.getInputProps("is_active", { type: "checkbox" })}
        />
        <Switch
          label="Staff"
          {...form.getInputProps("is_staff", { type: "checkbox" })}
        />
        <Switch
          label="Superuser"
          {...form.getInputProps("is_superuser", { type: "checkbox" })}
        />
        <Switch
          label="Disabled"
          {...form.getInputProps("is_disabled", { type: "checkbox" })}
          color="red"
        />
      </Group>

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
