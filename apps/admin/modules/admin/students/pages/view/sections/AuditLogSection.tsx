"use client";

import {
  Paper,
  Text,
  Stack,
  Table,
  Loader,
  Center,
  Badge,
  Code,
  ScrollArea,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { AUDIT_LOG_API } from "../../../module.config";

interface AuditLogSectionProps {
  studentId: string;
}

export function AuditLogSection({ studentId }: AuditLogSectionProps) {
  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ["auditLogs", studentId],
    queryFn: async () => {
      const res = await AUDIT_LOG_API.getAuditLogsByStudent(studentId);
      return res.data;
    },
  });

  const getActionColor = (action: string) => {
    switch (action?.toLowerCase()) {
      case "create":
        return "green";
      case "update":
        return "blue";
      case "delete":
        return "red";
      case "lock":
        return "orange";
      case "unlock":
        return "teal";
      default:
        return "gray";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  if (isLoading) {
    return (
      <Center p="xl">
        <Loader />
      </Center>
    );
  }

  return (
    <Stack gap="md">
      <Text size="sm" fw={600}>
        Audit Log (Read-Only)
      </Text>

      {auditLogs && auditLogs.length > 0 ? (
        <Paper withBorder>
          <ScrollArea>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Action</Table.Th>
                  <Table.Th>Entity Type</Table.Th>
                  <Table.Th>Entity ID</Table.Th>
                  <Table.Th>Actor</Table.Th>
                  <Table.Th>Details</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {auditLogs.map((log: any) => (
                  <Table.Tr key={log.id}>
                    <Table.Td>
                      <Text size="xs">{formatDate(log.created_at)}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge size="sm" color={getActionColor(log.action)}>
                        {log.action}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{log.entity_type}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{log.entity_id}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{log.actor_username || log.actor}</Text>
                    </Table.Td>
                    <Table.Td>
                      {log.details && Object.keys(log.details).length > 0 ? (
                        <Code block style={{ maxWidth: 200, overflow: "auto" }}>
                          {JSON.stringify(log.details, null, 2)}
                        </Code>
                      ) : (
                        <Text size="xs" c="dimmed">
                          -
                        </Text>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Paper>
      ) : (
        <Paper withBorder p="xl">
          <Text c="dimmed" ta="center">
            No audit log entries found.
          </Text>
        </Paper>
      )}
    </Stack>
  );
}
