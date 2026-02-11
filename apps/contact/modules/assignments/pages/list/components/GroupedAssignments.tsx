import { useMemo } from "react";
import { Badge, Box, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { IdentificationBadgeIcon } from "@phosphor-icons/react";

import { AssignmentTable } from "./AssignmentTable";
import type { Assignment, RoleGroup } from "../types";

interface GroupedAssignmentsProps {
  assignments: Assignment[];
}

export function GroupedAssignments({ assignments }: GroupedAssignmentsProps) {
  const groupedByRole = useMemo(() => {
    const groups: Record<string, RoleGroup> = {};

    assignments.forEach((assignment) => {
      const role = assignment.role || {};
      const roleId = role.id ? String(role.id) : "no-role";
      const roleName = role.name || role.name_en || "No Role";

      if (!groups[roleId]) {
        groups[roleId] = {
          role: { id: roleId, name: roleName },
          assignments: [],
        };
      }
      groups[roleId].assignments.push(assignment);
    });

    // Sort groups by role name, with "No Role" at the end
    return Object.values(groups).sort((a, b) => {
      if (a.role.id === "no-role") return 1;
      if (b.role.id === "no-role") return -1;
      return a.role.name.localeCompare(b.role.name);
    });
  }, [assignments]);

  return (
    <Stack gap="xl">
      {groupedByRole.map((group) => (
        <Box key={group.role.id}>
          {/* Role Header */}
          <Group gap="sm" mb="md">
            <ThemeIcon size="md" variant="light" color="gray">
              <IdentificationBadgeIcon size={16} />
            </ThemeIcon>
            <Text fw={600} size="lg">
              {group.role.name}
            </Text>
            <Badge variant="light" size="sm">
              {group.assignments.length}
            </Badge>
          </Group>

          {/* Assignments Table */}
          <AssignmentTable assignments={group.assignments} />
        </Box>
      ))}
    </Stack>
  );
}
