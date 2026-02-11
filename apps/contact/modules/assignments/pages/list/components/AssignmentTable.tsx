import { ActionIcon, Badge, Group, Table, Text, Tooltip } from "@mantine/core";
import {
  PhoneCallIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react";

import { ViberIcon } from "./ViberIcon";
import { getName, formatPhoneForLink, getPhoneLinks } from "../utils";
import type { Assignment } from "../types";

interface AssignmentTableProps {
  assignments: Assignment[];
}

export function AssignmentTable({ assignments }: AssignmentTableProps) {
  const rows = assignments.map((assignment) => {
    const contact = assignment.contact || {};
    const party = assignment.party;
    const organization = assignment.organization;
    const location = assignment.location || {};

    const localBody = getName(location.local_body);
    const ward = location.ward;
    const wardDisplay = ward
      ? `Ward ${typeof ward === "object" ? ward.ward_no || ward.name : ward}`
      : null;
    const district = getName(location.district);

    const locationParts = [localBody, wardDisplay].filter(Boolean);
    const locationDisplay = locationParts.length > 0
      ? `${locationParts.join(", ")}${district ? ` (${district})` : ""}`
      : district || "-";

    const phoneNumber = formatPhoneForLink(contact.primary_phone);
    const hasPhone = !!phoneNumber;
    const phoneLinks = hasPhone ? getPhoneLinks(phoneNumber) : null;

    return (
      <Table.Tr key={assignment.id}>
        <Table.Td>
          <Text fw={500} size="sm">
            {contact.name || contact.name_en || "Unknown"}
          </Text>
        </Table.Td>
        <Table.Td>
          {hasPhone && phoneLinks ? (
            <Group gap={4} wrap="nowrap">
              <Text size="sm">{contact.primary_phone}</Text>
              <Group gap={2}>
                <Tooltip label="Call" withArrow>
                  <ActionIcon
                    variant="subtle"
                    color="blue"
                    size="sm"
                    component="a"
                    href={phoneLinks.tel}
                  >
                    <PhoneCallIcon size={14} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="WhatsApp" withArrow>
                  <ActionIcon
                    variant="subtle"
                    color="green"
                    size="sm"
                    component="a"
                    href={phoneLinks.whatsapp}
                    target="_blank"
                  >
                    <WhatsappLogoIcon size={14} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Viber" withArrow>
                  <ActionIcon
                    variant="subtle"
                    color="violet"
                    size="sm"
                    component="a"
                    href={phoneLinks.viber}
                  >
                    <ViberIcon size={14} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>
          ) : (
            <Text size="sm" c="dimmed">-</Text>
          )}
        </Table.Td>
        <Table.Td>
          <Text size="sm">{locationDisplay}</Text>
        </Table.Td>
        <Table.Td>
          <Group gap="xs">
            {party && (
              <Badge variant="light" size="sm">
                {party.abbrev || party.name}
              </Badge>
            )}
            {organization && (
              <Badge variant="outline" size="sm">
                {organization.name || organization.name_en}
              </Badge>
            )}
            {!party && !organization && (
              <Text size="sm" c="dimmed">-</Text>
            )}
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Table striped highlightOnHover withTableBorder>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Phone</Table.Th>
          <Table.Th>Location</Table.Th>
          <Table.Th>Affiliation</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
