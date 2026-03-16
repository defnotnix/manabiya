"use client";

import { Container, Group, Stack, Text } from "@mantine/core";
import {
  StudentSearchInput,
  StudentResultsTable,
  ActiveIntakesSection,
  QuickActionButtons,
} from "./components";
import { useStudentSearch } from "./hooks/useStudentSearch";

export function ModuleAdminHome() {
  const { searchQuery, setSearchQuery, students, isFetching, isSearchActive } =
    useStudentSearch();

  return (
    <Container size="md">
      <Stack gap={0}>
        <Group justify="center" my="md">
          <Text size="xs" tt="uppercase" fw={900} opacity={0.5}>
            MANABIYA ADMIN
          </Text>
        </Group>

        <Stack gap="md" my="2rem">
          <h1
            style={{
              textAlign: "center",
            }}
          >
            Quick Access
          </h1>

          <Text size="xs" c="dimmed" ta="center">
            Freely search students from the search below.
          </Text>

          <StudentSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            isLoading={isFetching}
          />

          <QuickActionButtons />
        </Stack>

        {isSearchActive ? (
          <StudentResultsTable
            students={students}
            count={students.length}
            isLoading={isFetching}
          />
        ) : (
          <ActiveIntakesSection />
        )}
      </Stack>
    </Container>
  );
}
