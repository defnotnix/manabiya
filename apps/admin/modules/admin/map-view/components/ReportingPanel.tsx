"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Paper,
  Stack,
  Text,
  Group,
  Loader,
  ScrollArea,
  Button,
  Modal,
  Table,
  Badge,
  Divider,
} from "@mantine/core";
import { ChartBarIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { REPORTING_API } from "../api/reporting.api";

interface GeoUnit {
  id: number;
  unit_type: string;
  parent_id: number | null;
  display_name: string;
  display_name_ne?: string;
  display_name_en?: string;
  official_code?: string;
  ward_no?: number | null;
}

interface PollingStation {
  id: number;
  place_name: string;
  place_name_en?: string;
  station_code?: string | null;
}

type ReportLevel =
  | "dashboard"
  | "district"
  | "municipality"
  | "ward"
  | "booth"
  | "religion-levels";

function renderValue(value: unknown): string {
  if (value == null) return "-";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function renderResultsTable(items: any[]): React.ReactNode {
  if (items.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="md">
        No results
      </Text>
    );
  }

  const keys = Object.keys(items[0]).filter(
    (k) => typeof items[0][k] !== "object" || items[0][k] === null,
  );

  return (
    <ScrollArea>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            {keys.map((key) => (
              <Table.Th key={key} style={{ textTransform: "capitalize" }}>
                {key.replace(/_/g, " ")}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {items.map((item: any, idx: number) => (
            <Table.Tr key={idx}>
              {keys.map((key) => (
                <Table.Td key={key}>{renderValue(item[key])}</Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}

function renderKeyValueTable(data: Record<string, unknown>): React.ReactNode {
  const entries = Object.entries(data);
  return (
    <Table withTableBorder>
      <Table.Tbody>
        {entries.map(([key, value]) => (
          <Table.Tr key={key}>
            <Table.Td fw={500} style={{ textTransform: "capitalize" }}>
              {key.replace(/_/g, " ")}
            </Table.Td>
            <Table.Td>{renderValue(value)}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}

function renderReportData(data: any): React.ReactNode {
  if (!data) return <Text c="dimmed">No data</Text>;

  // Dashboard summary has multiple sections
  if (
    data.district_summary ||
    data.municipality_summary ||
    data.top_religions
  ) {
    return (
      <Stack gap="md">
        {data.district_summary?.length > 0 && (
          <>
            <Text fw={600} size="sm">
              District Summary
            </Text>
            {renderResultsTable(data.district_summary)}
          </>
        )}
        {data.municipality_summary?.length > 0 && (
          <>
            <Text fw={600} size="sm">
              Municipality Summary
            </Text>
            {renderResultsTable(data.municipality_summary)}
          </>
        )}
        {data.top_religions && (
          <>
            <Text fw={600} size="sm">
              Top Religions
            </Text>
            {Object.entries(data.top_religions).map(
              ([scope, items]: [string, any]) =>
                Array.isArray(items) &&
                items.length > 0 && (
                  <Stack key={scope} gap={4}>
                    <Badge variant="light" size="sm">
                      {scope}
                    </Badge>
                    {renderResultsTable(items)}
                  </Stack>
                ),
            )}
          </>
        )}
      </Stack>
    );
  }

  // Paginated list response: { success, pagination, results }
  if (data.results && Array.isArray(data.results)) {
    return (
      <Stack gap="xs">
        {data.pagination && (
          <Group gap="xs">
            <Badge variant="light" size="sm">
              {data.pagination.total_items} total
            </Badge>
            <Badge variant="light" size="sm" color="gray">
              Page {data.pagination.current_page} of{" "}
              {data.pagination.total_pages}
            </Badge>
          </Group>
        )}
        {renderResultsTable(data.results)}
      </Stack>
    );
  }

  // Single object (detail/by-* endpoints)
  if (typeof data === "object" && !Array.isArray(data)) {
    return renderKeyValueTable(data);
  }

  // Fallback
  return (
    <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
      {JSON.stringify(data, null, 2)}
    </Text>
  );
}

interface ReportingPanelProps {
  selectedProvince: string | null;
  selectedDistrict: string | null;
  selectedLocalBody: string | null;
  selectedWard: string | null;
  selectedBooth: string | null;
}

export function ReportingPanel({
  selectedProvince,
  selectedDistrict,
  selectedLocalBody,
  selectedWard,
  selectedBooth,
}: ReportingPanelProps) {
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [reportLevel, setReportLevel] = useState<ReportLevel | null>(null);
  const [reportParams, setReportParams] = useState<any>(null);
  const [reportTitle, setReportTitle] = useState("");

  // Fetch report data when modal is open
  const {
    data: reportData,
    isLoading: loadingReport,
    error: reportError,
  } = useQuery({
    queryKey: ["reporting", reportLevel, reportParams],
    queryFn: async () => {
      if (!reportLevel) return null;
      switch (reportLevel) {
        case "dashboard":
          return REPORTING_API.getDashboardSummary(reportParams);
        case "district":
          return REPORTING_API.getDistricts(reportParams);
        case "municipality":
          return REPORTING_API.getMunicipalities(reportParams);
        case "ward":
          return REPORTING_API.getWards(reportParams);
        case "booth":
          return REPORTING_API.getBooths(reportParams);
        case "religion-levels":
          return REPORTING_API.getReligionLevels(reportParams);
        default:
          return null;
      }
    },
    enabled: modalOpen && !!reportLevel,
  });

  const openReport = (level: ReportLevel, params: any, title: string) => {
    setReportLevel(level);
    setReportParams(params);
    setReportTitle(title);
    setModalOpen(true);
  };

  // Determine the most specific scope for religion-levels
  const getReligionParams = () => {
    if (selectedBooth) {
      return {
        scope: "BOOTH" as const,
        polling_station: Number(selectedBooth),
      };
    }
    if (selectedWard) {
      return { scope: "WARD" as const, geo_unit: Number(selectedWard) };
    }
    if (selectedLocalBody) {
      return {
        scope: "MUNICIPALITY" as const,
        geo_unit: Number(selectedLocalBody),
      };
    }
    if (selectedDistrict) {
      return {
        scope: "DISTRICT" as const,
        geo_unit: Number(selectedDistrict),
      };
    }
    return { scope: "NATIONAL" as const };
  };

  // Auto-open booth report when booth is selected
  useEffect(() => {
    if (selectedBooth && selectedWard) {
      openReport(
        "booth",
        {
          polling_station: Number(selectedBooth),
          ward: Number(selectedWard),
        },
        "Booth Report",
      );
    }
  }, [selectedBooth, selectedWard]);

  return (
    <>
      <Paper
        pos="absolute"
        top={16}
        right={16}
        bottom={16}
        w={340}
        style={{ zIndex: 999, overflow: "hidden" }}
        shadow="lg"
        radius="md"
        withBorder
      >
        <Stack h="100%" gap={0}>
          {/* Header */}
          <Group justify="space-between" p="md" pb="xs">
            <Group gap="xs">
              <ChartBarIcon size={18} weight="bold" />
              <Text fw={600} size="sm">
                Reporting
              </Text>
            </Group>
          </Group>

          <Divider />

          {/* Report Buttons */}
          <ScrollArea flex={1} p="md" pt="sm">
            <Stack gap="xs">
              <Text size="xs" c="dimmed">
                Select locations using the top bar, then click a report button
                below.
              </Text>

              {/* Dashboard Summary */}
              <Button
                size="xs"
                variant="filled"
                color="indigo"
                fullWidth
                onClick={() =>
                  openReport(
                    "dashboard",
                    {
                      ...(selectedDistrict && {
                        district: Number(selectedDistrict),
                      }),
                      ...(selectedLocalBody && {
                        municipality: Number(selectedLocalBody),
                      }),
                      top_n: 5,
                    },
                    "Dashboard Summary",
                  )
                }
                rightSection={<ArrowRightIcon size={14} />}
              >
                Dashboard Summary
              </Button>

              <Divider my="xs" />

              {/* Religion Levels */}
              <Button
                size="xs"
                variant="light"
                color="violet"
                fullWidth
                onClick={() =>
                  openReport(
                    "religion-levels",
                    { ...getReligionParams(), ordering: "-count" },
                    "Religion Levels Report",
                  )
                }
                rightSection={<ArrowRightIcon size={14} />}
              >
                Religion Levels Report
              </Button>
            </Stack>
          </ScrollArea>
        </Stack>
      </Paper>

      {/* Report Modal */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          <Group gap="xs">
            <ChartBarIcon size={20} weight="bold" />
            <Text fw={600}>{reportTitle}</Text>
          </Group>
        }
        size="xl"
        centered
      >
        {loadingReport && (
          <Stack align="center" py="xl">
            <Loader size="md" />
            <Text size="sm" c="dimmed">
              Loading report data...
            </Text>
          </Stack>
        )}

        {reportError && (
          <Stack align="center" py="xl">
            <Badge color="red" size="lg">
              Error
            </Badge>
            <Text size="sm" c="red">
              {(reportError as Error).message || "Failed to load report"}
            </Text>
          </Stack>
        )}

        {!loadingReport && !reportError && reportData && (
          <ScrollArea.Autosize mah="70vh">
            {renderReportData(reportData)}
          </ScrollArea.Autosize>
        )}

        {!loadingReport && !reportError && !reportData && (
          <Text c="dimmed" ta="center" py="xl">
            No report data available
          </Text>
        )}
      </Modal>
    </>
  );
}
