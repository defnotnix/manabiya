"use client";

import { Stack, TextInput, PasswordInput, Switch, Select, Loader, SimpleGrid } from "@mantine/core";
import { FormWrapper } from "@settle/core";
import { useEffect, useState } from "react";
import { apiDispatch } from "@settle/core";

interface Role {
  id: number;
  name: string;
}

export function UsersForm() {
  const form = FormWrapper.useForm();
  const hasPasswordField = "password" in form.values;
  const isDisabled = form.values.is_disabled;
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await apiDispatch.get({
          endpoint: "/api/auth/roles/",
        });
        if (!response.err && response.data) {
          // Handle both array and object responses
          const rolesData = Array.isArray(response.data) ? response.data : response.data.results || [];
          setRoles(rolesData);
        }
      } catch (error) {
        console.error("Failed to fetch roles:", error);
        setRoles([]);
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  const roleOptions = Array.isArray(roles) ? roles.map((role) => ({
    label: role.name.charAt(0).toUpperCase() + role.name.slice(1),
    value: String(role.id),
  })) : [];

  return (
    <Stack gap="md" p="md">



      <SimpleGrid cols={2} spacing={"xs"}>
        <TextInput
          label="Username"
          placeholder="e.g., john.doe"
          required
          {...form.getInputProps("username")}
        />

        {hasPasswordField && (
          <PasswordInput
            disabled
            label="Password"
            placeholder="Enter a strong password"
            required
            {...form.getInputProps("password")}
          />
        )}


        <TextInput
          label="Email"
          placeholder="john@example.com"
          type="email"
          required
          {...form.getInputProps("email")}
        />

        <TextInput
          label="First Name"
          placeholder="John"
          {...form.getInputProps("first_name")}
        />

        <TextInput
          label="Last Name"
          placeholder="Doe"
          {...form.getInputProps("last_name")}
        />



        <Select
          label="Role"
          placeholder="Select a role"
          required
          data={roleOptions}
          searchable
          clearable={false}
          disabled={loadingRoles}
          rightSection={loadingRoles ? <Loader size={16} /> : undefined}
          value={form.values.groups?.[0] ? String(form.values.groups[0]) : null}
          onChange={(value) => {
            form.setFieldValue("groups", value ? [parseInt(value)] : []);
          }}
          error={form.errors.groups}
        />

      </SimpleGrid>

      <SimpleGrid cols={2} spacing="xs">

        <Switch
          label="Active"
          description="Enable this user account"
          {...form.getInputProps("is_active", { type: "checkbox" })}
        />

        <Switch
          label="Disabled"
          description="Disable this user account"
          {...form.getInputProps("is_disabled", { type: "checkbox" })}
        />
      </SimpleGrid>

      {isDisabled && (
        <>
          <TextInput
            label="Disabled At"
            placeholder="2024-01-01T00:00:00Z"
            {...form.getInputProps("disabled_at")}
          />

          <TextInput
            label="Disabled Reason"
            placeholder="Reason for disabling..."
            {...form.getInputProps("disabled_reason")}
          />
        </>
      )}
    </Stack>
  );
}
