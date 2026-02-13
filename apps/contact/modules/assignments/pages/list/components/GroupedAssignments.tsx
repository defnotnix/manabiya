import { Fragment, useMemo } from "react";
import { Badge, Group, Table, Text } from "@mantine/core";

import { AssignmentRow, AssignmentTableHead, COLUMN_COUNT } from "./AssignmentTable";
import type { Assignment, RoleGroup } from "../types";

interface GroupedAssignmentsProps {
  assignments: Assignment[];
}

export function GroupedAssignments({ assignments }: GroupedAssignmentsProps) {
  const groupedByRole = useMemo(() => {
    const groups: Record<string, RoleGroup> = {};

    assignments.forEach((assignment) => {
      const role = assignment.role ?? ({} as Partial<NonNullable<Assignment['role']>>);
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
    <Table striped highlightOnHover withTableBorder>
      <AssignmentTableHead />
      <Table.Tbody>
        {groupedByRole.map((group) => (
          <Fragment key={group.role.id}>
            <Table.Tr>
              <Table.Td colSpan={COLUMN_COUNT} bg="brand.0" py="xs">
                <Group gap="sm">
                  <Text fw={500} size="xs" c="dimmed">{group.role.name}</Text>
                  <Badge variant="light" size="sm">
                    {group.assignments.length}
                  </Badge>
                </Group>
              </Table.Td>
            </Table.Tr>
            {group.assignments.map((assignment) => (
              <AssignmentRow key={assignment.id} assignment={assignment} />
            ))}
          </Fragment>
        ))}
      </Table.Tbody>
    </Table>
  );
}
