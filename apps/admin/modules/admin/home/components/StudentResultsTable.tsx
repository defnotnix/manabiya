"use client";

import { Badge, Button, Center, Divider, Loader, Table, Text } from "@mantine/core";
import Link from "next/link";

interface StudentResultsTableProps {
  students: any[];
  count: number;
  isLoading?: boolean;
}

export function StudentResultsTable({
  students,
  count,
  isLoading = false,
}: StudentResultsTableProps) {
  return (
    <>
      <Divider my="xl" label={`Student Results (${count})`} />
      {isLoading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : students.length > 0 ? (
        <Table fs="xs" striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Code</Table.Th>
              <Table.Th>Full Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Contact</Table.Th>
              <Table.Th>Admission Date</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {students.map((student: any) => (
              <Table.Tr key={student.id}>
                <Table.Td>{student.student_code}</Table.Td>
                <Table.Td>{student.full_name}</Table.Td>
                <Table.Td>{student.email}</Table.Td>
                <Table.Td>{student.contact}</Table.Td>
                <Table.Td>{student.date_of_admission}</Table.Td>
                <Table.Td>
                  <Badge
                    size="xs"
                    color={student.locked ? "red" : "teal"}
                    variant="light"
                  >
                    {student.locked ? "LOCKED" : "ACTIVE"}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Link href={`/admin/doc?studentId=${student.id}`}>
                    <Button size="xs" variant="light">
                      View Doc
                    </Button>
                  </Link>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <Text size="sm" c="dimmed" ta="center">
          No students found
        </Text>
      )}
    </>
  );
}
