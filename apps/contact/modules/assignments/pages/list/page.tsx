"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Badge,
  Button,
  Center,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CaretDownIcon,
  CaretUpIcon,
} from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";

import { useLocationSelector } from "@/components/LocationSelector/useLocationSelector";
import { ASSIGNMENT_API, ROLE_API, PARTY_API } from "../../module.config";

import {
  AssignmentTable,
  AssignmentFilters,
  AssignmentsPagination,
  GroupedAssignments,
} from "./components";
import { extractResults } from "./utils";
import type { AssignmentFilters as FilterState } from "./types";

export function AssignmentsListPage() {
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    party: null,
    role: null,
    page: 1,
    page_size: 12,
  });

  const [debouncedSearch] = useDebouncedValue(filters.search, 300);
  const [filtersOpen, { toggle: toggleFilters }] = useDisclosure(true);

  // Location selector with cascading dropdowns
  const locationSelector = useLocationSelector({ fetchPlaces: false });

  // Get the most specific selected location for filtering
  const activeGeoUnit = useMemo(() => {
    return (
      locationSelector.selectedWard ||
      locationSelector.selectedLocalBody ||
      locationSelector.selectedDistrict ||
      locationSelector.selectedProvince
    );
  }, [
    locationSelector.selectedWard,
    locationSelector.selectedLocalBody,
    locationSelector.selectedDistrict,
    locationSelector.selectedProvince,
  ]);

  // Fetch role options
  const { data: rolesData, isLoading: loadingRoles } = useQuery({
    queryKey: ["roles", "options"],
    queryFn: async () => {
      const response = await ROLE_API.getRoleOptions();
      return extractResults(response);
    },
  });

  // Fetch party options
  const { data: partiesData, isLoading: loadingParties } = useQuery({
    queryKey: ["parties", "list"],
    queryFn: async () => {
      const response = await PARTY_API.getParties({ page_size: 100 });
      return extractResults(response);
    },
  });

  // Build role options
  const roleOptions = useMemo(() => {
    if (!rolesData) return [];
    return rolesData.map((role: any) => ({
      value: String(role.id),
      label: role.name || role.name_en || role.key,
    }));
  }, [rolesData]);

  // Build party options
  const partyOptions = useMemo(() => {
    if (!partiesData) return [];
    return partiesData.map((party: any) => ({
      value: String(party.id),
      label: party.abbrev || party.name,
    }));
  }, [partiesData]);

  // Build query params for assignments
  const queryParams = useMemo(() => {
    const params: any = {
      page: filters.page,
      page_size: filters.page_size,
    };

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    if (activeGeoUnit) {
      params.geo_unit = activeGeoUnit;
    }

    if (filters.party) {
      params.party = filters.party;
    }

    if (filters.role) {
      params.role = filters.role;
    }

    return params;
  }, [debouncedSearch, activeGeoUnit, filters.party, filters.role, filters.page, filters.page_size]);

  // Fetch assignments
  const {
    data: assignmentsData,
    isLoading: loadingAssignments,
    isFetching,
  } = useQuery({
    queryKey: ["assignments", "list", queryParams],
    queryFn: async () => {
      const response = await ASSIGNMENT_API.getAssignments(queryParams);
      return response;
    },
    placeholderData: (previousData) => previousData,
  });

  const assignments = useMemo(() => extractResults(assignmentsData), [assignmentsData]);
  const totalCount = assignmentsData?.count || 0;
  const totalPages = Math.ceil(totalCount / filters.page_size);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters({
      search: "",
      party: null,
      role: null,
      page: 1,
      page_size: filters.page_size,
    });
    locationSelector.clearFilters();
  }, [locationSelector, filters.page_size]);

  // Check if any filters are active
  const hasActiveFilters =
    filters.search ||
    filters.party ||
    filters.role ||
    locationSelector.hasActiveFilters;

  // Location display for active filter summary
  const locationPath = locationSelector.getFullLocationPath();

  return (
    <Stack gap="md">
      {/* Header */}
      <Group justify="space-between">
        <Text size="xl" fw={600}>
          Assignments Directory
        </Text>
        <Group gap="xs">
          {isFetching && <Loader size="xs" />}
          <Badge variant="light" size="lg">
            {totalCount} {totalCount === 1 ? "assignment" : "assignments"}
          </Badge>
        </Group>
      </Group>

      {/* Search Bar */}
      <Group gap="sm">
        <TextInput
          flex={1}
          size="md"
          leftSection={<MagnifyingGlassIcon size={20} />}
          placeholder="Search by name, phone, or email..."
          value={filters.search}
          onChange={(e) =>
            setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))
          }
        />
        <Button
          size="md"
          variant={filtersOpen ? "filled" : "light"}
          leftSection={<FunnelIcon size={18} />}
          rightSection={filtersOpen ? <CaretUpIcon size={14} /> : <CaretDownIcon size={14} />}
          onClick={toggleFilters}
        >
          Filters
        </Button>
      </Group>

      {/* Filters Panel */}
      <AssignmentFilters
        isOpen={filtersOpen}
        filters={filters}
        setFilters={setFilters}
        locationSelector={locationSelector}
        partyOptions={partyOptions}
        roleOptions={roleOptions}
        loadingParties={loadingParties}
        loadingRoles={loadingRoles}
        hasActiveFilters={hasActiveFilters}
        locationPath={locationPath}
        onClearAll={clearAllFilters}
      />

      {/* Results */}
      {loadingAssignments && !assignments.length ? (
        <Center py="xl">
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text c="dimmed">Loading assignments...</Text>
          </Stack>
        </Center>
      ) : assignments.length === 0 ? (
        <Center py="xl">
          <Stack align="center" gap="md">
            <Text size="lg" c="dimmed">
              No assignments found
            </Text>
            <Text size="sm" c="dimmed">
              Try adjusting your filters or search query
            </Text>
          </Stack>
        </Center>
      ) : (
        <>
          {/* Assignments Table - Grouped by role when no role filter */}
          {!filters.role ? (
            <GroupedAssignments assignments={assignments} />
          ) : (
            <AssignmentTable assignments={assignments} />
          )}

          {/* Pagination */}
          <AssignmentsPagination
            filters={filters}
            setFilters={setFilters}
            totalCount={totalCount}
            totalPages={totalPages}
          />
        </>
      )}
    </Stack>
  );
}
