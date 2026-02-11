import {
  Badge,
  Button,
  Card,
  Collapse,
  Group,
  Select,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import {
  FlagIcon,
  IdentificationBadgeIcon,
  MapPinIcon,
  XIcon,
} from "@phosphor-icons/react";

import type { UseLocationSelectorReturn } from "@/components/LocationSelector/useLocationSelector";
import type { AssignmentFilters as FilterState, SelectOption } from "../types";

interface AssignmentFiltersProps {
  isOpen: boolean;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  locationSelector: UseLocationSelectorReturn;
  partyOptions: SelectOption[];
  roleOptions: SelectOption[];
  loadingParties: boolean;
  loadingRoles: boolean;
  hasActiveFilters: boolean;
  locationPath: string;
  onClearAll: () => void;
}

export function AssignmentFilters({
  isOpen,
  filters,
  setFilters,
  locationSelector,
  partyOptions,
  roleOptions,
  loadingParties,
  loadingRoles,
  hasActiveFilters,
  locationPath,
  onClearAll,
}: AssignmentFiltersProps) {
  return (
    <Collapse in={isOpen}>
      <Card withBorder p="md">
        <Stack gap="md">
          {/* Location Filters */}
          <Text size="sm" fw={500} c="dimmed">
            Location
          </Text>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="sm">
            <Select
              label="Province"
              placeholder="Select province"
              data={locationSelector.provinceOptions}
              value={locationSelector.selectedProvince}
              onChange={locationSelector.setSelectedProvince}
              disabled={locationSelector.loadingProvinces}
              clearable
              searchable
            />
            <Select
              label="District"
              placeholder="Select district"
              data={locationSelector.districtOptions}
              value={locationSelector.selectedDistrict}
              onChange={locationSelector.setSelectedDistrict}
              disabled={!locationSelector.selectedProvince || locationSelector.loadingDistricts}
              clearable
              searchable
            />
            <Select
              label="Local Body"
              placeholder="Select local body"
              data={locationSelector.localBodyOptions}
              value={locationSelector.selectedLocalBody}
              onChange={locationSelector.setSelectedLocalBody}
              disabled={!locationSelector.selectedDistrict || locationSelector.loadingLocalBodies}
              clearable
              searchable
            />
            <Select
              label="Ward"
              placeholder="Select ward"
              data={locationSelector.wardOptions}
              value={locationSelector.selectedWard}
              onChange={locationSelector.setSelectedWard}
              disabled={!locationSelector.selectedLocalBody || locationSelector.loadingWards}
              clearable
              searchable
            />
          </SimpleGrid>

          {/* Party & Role Filters */}
          <Text size="sm" fw={500} c="dimmed">
            Party & Role
          </Text>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
            <Select
              label="Party"
              placeholder="Select party"
              data={partyOptions}
              value={filters.party}
              onChange={(value) => setFilters((f) => ({ ...f, party: value, page: 1 }))}
              disabled={loadingParties}
              clearable
              searchable
            />
            <Select
              label="Role"
              placeholder="Select role"
              data={roleOptions}
              value={filters.role}
              onChange={(value) => setFilters((f) => ({ ...f, role: value, page: 1 }))}
              disabled={loadingRoles}
              clearable
              searchable
            />
          </SimpleGrid>

          {/* Active Filters Summary & Clear */}
          {hasActiveFilters && (
            <Group justify="space-between" mt="xs">
              <Group gap="xs">
                {locationPath && (
                  <Badge variant="light" size="sm" leftSection={<MapPinIcon size={12} />}>
                    {locationPath}
                  </Badge>
                )}
                {filters.party && (
                  <Badge variant="light" size="sm" leftSection={<FlagIcon size={12} />}>
                    {partyOptions.find((p) => p.value === filters.party)?.label}
                  </Badge>
                )}
                {filters.role && (
                  <Badge variant="light" size="sm" leftSection={<IdentificationBadgeIcon size={12} />}>
                    {roleOptions.find((r) => r.value === filters.role)?.label}
                  </Badge>
                )}
              </Group>
              <Button
                variant="subtle"
                size="xs"
                leftSection={<XIcon size={14} />}
                onClick={onClearAll}
              >
                Clear all filters
              </Button>
            </Group>
          )}
        </Stack>
      </Card>
    </Collapse>
  );
}
