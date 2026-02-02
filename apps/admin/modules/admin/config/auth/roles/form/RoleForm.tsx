"use client";

import {
  Stack,
  TextInput,
  Checkbox,
  Divider,
  Group,
  Text,
  Loader,
} from "@mantine/core";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { FormWrapper } from "@settle/core";
import { ROLES_API } from "../module.api";
import { useMemo, useState } from "react";

interface RoleFormProps {
  currentStep?: number;
  isCreate?: boolean;
}

interface Permission {
  id: number;
  name: string;
  codename: string;
  content_type: number;
}

export function RoleForm({ currentStep = 0, isCreate = true }: RoleFormProps) {
  const form = FormWrapper.useForm();
  const [search, setSearch] = useState("");

  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const response = await ROLES_API.getPermissions();
      return (response.data as Permission[]) || [];
    },
  });

  // Filter and group permissions
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
    const currentPermissions = (form.values.permissions || []).map((p: any) =>
      String(p),
    );
    const idStr = String(permissionId);

    let newPermissions;
    if (checked) {
      newPermissions = [...currentPermissions, idStr];
    } else {
      newPermissions = currentPermissions.filter((id: string) => id !== idStr);
    }

    form.setFieldValue("permissions", newPermissions);
  };

  return (
    <Stack gap="sm" p="sm">
      <TextInput
        label="Name"
        placeholder="Role Name"
        {...form.getInputProps("name")}
        required
        size="xs"
      />

      <TextInput
        placeholder="Search permissions..."
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        leftSection={<MagnifyingGlassIcon />}
        size="xs"
      />

      {isLoading ? (
        <Loader size="xs" />
      ) : (
        <Stack gap="xs" mah={400} style={{ overflowY: "auto" }}>
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
                      const isChecked = (form.values.permissions || []).some(
                        (p: any) => String(p) === String(permission.id),
                      );
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
