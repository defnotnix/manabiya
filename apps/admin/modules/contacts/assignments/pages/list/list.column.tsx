import { ActionIcon, Badge, Group, Text, Tooltip } from "@mantine/core";
import { PhoneIcon, WhatsappLogoIcon, ChatsCircleIcon } from "@phosphor-icons/react";

// Helper to get display name from objects with name_en/name_ne/name patterns
const getDisplayName = (obj: any): string => {
    if (!obj) return "-";
    return obj.name_en || obj.name_ne || obj.name || "-";
};

export const columns = [
    {
        accessor: "actions",
        title: "Contact",
        width: 100,
        render: (row: any) => {
            const phone = row.contact?.primary_phone;
            if (!phone) return "-";
            const cleanPhone = phone.replace(/\D/g, "");
            return (
                <Group gap="xs">
                    <Tooltip label="Call">
                        <ActionIcon
                            variant="subtle"
                            color="blue"
                            component="a"
                            href={`tel:${cleanPhone}`}
                        >
                            <PhoneIcon size={16} />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="WhatsApp">
                        <ActionIcon
                            variant="subtle"
                            color="green"
                            component="a"
                            href={`https://wa.me/${cleanPhone}`}
                            target="_blank"
                        >
                            <WhatsappLogoIcon size={16} />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Viber">
                        <ActionIcon
                            variant="subtle"
                            color="violet"
                            component="a"
                            href={`viber://chat?number=${cleanPhone}`}
                        >
                            <ChatsCircleIcon size={16} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            );
        }
    },
    {
        accessor: "contact.name",
        title: "Person",
        width: 200,
        render: (row: any) => {
            if (!row.contact) return "-";
            return getDisplayName(row.contact);
        }
    },
    {
        accessor: "contact.primary_phone",
        title: "Phone",
        width: 120,
        render: (row: any) => row.contact?.primary_phone || "-"
    },
    {
        accessor: "role.name",
        title: "Role",
        width: 150,
        render: (row: any) => {
            if (!row.role) return "-";
            return getDisplayName(row.role);
        }
    },
    {
        accessor: "label",
        title: "Label",
        width: 150,
        render: (row: any) => row.label || "-"
    },
    {
        accessor: "affiliation",
        title: "Affiliation",
        width: 200,
        render: (row: any) => {
            if (row.party) return getDisplayName(row.party);
            if (row.organization) return getDisplayName(row.organization);
            return "-";
        }
    },
    {
        accessor: "location",
        title: "Location",
        width: 250,
        render: (row: any) => {
            if (!row.location) return "-";
            const loc = row.location;

            // Build location string from path array (most specific to least)
            if (loc.path && Array.isArray(loc.path) && loc.path.length > 0) {
                // Reverse to show from most specific (last) to province (first)
                const pathNames = [...loc.path].reverse().map((p: any) => getDisplayName(p));
                return pathNames.join(" → ");
            }

            // Fallback: build from individual fields
            const parts = [loc.ward, loc.local_body, loc.district, loc.province]
                .filter(Boolean)
                .map((p: any) => getDisplayName(p));

            if (parts.length > 0) return parts.join(", ");

            return "-";
        },
    },
    {
        accessor: "priority",
        title: "Priority",
        width: 100,
        render: (row: any) => (
            <Group gap="xs">
                {row.is_primary && <Badge color="green" size="xs">Primary</Badge>}
                {row.priority != null && <Text size="sm">{row.priority}</Text>}
            </Group>
        ),
    },
    {
        accessor: "is_active",
        title: "Status",
        width: 100,
        render: (row: any) => (
            <Badge color={row.is_active ? "teal" : "gray"}>
                {row.is_active ? "Active" : "Inactive"}
            </Badge>
        ),
    },
];
