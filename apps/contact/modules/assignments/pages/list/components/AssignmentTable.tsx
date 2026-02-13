import { Table, Text } from "@mantine/core";

import { getName, formatPhoneForLink, getPhoneLinks } from "../utils";
import type { Assignment } from "../types";

const COLUMN_COUNT = 3;

const COL_WIDTHS = {
  role: "10%",
  name: "20%",
  contact: "18%",
};

export function AssignmentTableHead() {
  return (
    <Table.Thead>
      <Table.Tr>
        <Table.Th w={COL_WIDTHS.role}>Role</Table.Th>
        <Table.Th w={COL_WIDTHS.name}>Name</Table.Th>

        <Table.Th w={COL_WIDTHS.contact}>Contact</Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
}

export { COLUMN_COUNT };

export function AssignmentRow({ assignment }: { assignment: Assignment }) {
  const contact =
    assignment.contact ?? ({} as Partial<NonNullable<Assignment["contact"]>>);
  const location =
    assignment.location ?? ({} as Partial<NonNullable<Assignment["location"]>>);

  const localBody = getName(location.local_body);
  const ward = location.ward;
  const wardDisplay = ward
    ? `Ward ${typeof ward === "object" ? ward.ward_no || ward.name : ward}`
    : null;
  const district = getName(location.district);

  const locationParts = [localBody, wardDisplay].filter(Boolean);
  const locationDisplay =
    locationParts.length > 0
      ? `${locationParts.join(", ")}${district ? ` (${district})` : ""}`
      : district || null;

  const addressDisplay = contact.address || locationDisplay || "-";

  const phoneNumber = formatPhoneForLink(contact.primary_phone);
  const hasPhone = !!phoneNumber;
  const phoneLinks = hasPhone ? getPhoneLinks(phoneNumber) : null;

  const role = assignment.role;

  const handleRowClick = () => {
    if (phoneLinks) {
      window.location.href = phoneLinks.tel;
    }
  };

  return (
    <Table.Tr
      onClick={handleRowClick}
      style={{ cursor: hasPhone ? "pointer" : "default" }}
    >
      <Table.Td>
        <Text size="xs">{role?.name || role?.name_en || "-"}</Text>
      </Table.Td>
      <Table.Td>
        <Text fw={500} size="xs">
          {contact.name || contact.name_en || "Unknown"}
        </Text>
        <Text size="xs" c="dimmed">
          {addressDisplay}
        </Text>
      </Table.Td>

      <Table.Td>
        <Text size="xs">
          {hasPhone ? (
            contact.primary_phone
          ) : (
            <Text span size="xs" c="dimmed">
              -
            </Text>
          )}
        </Text>
      </Table.Td>
    </Table.Tr>
  );
}

interface AssignmentTableProps {
  assignments: Assignment[];
}

export function AssignmentTable({ assignments }: AssignmentTableProps) {
  return (
    <Table.ScrollContainer minWidth={400}>
      <Table striped highlightOnHover withTableBorder>
        <AssignmentTableHead />
        <Table.Tbody>
          {assignments.map((assignment) => (
            <AssignmentRow key={assignment.id} assignment={assignment} />
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
