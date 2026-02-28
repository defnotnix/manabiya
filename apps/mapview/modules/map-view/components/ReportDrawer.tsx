"use client";

import {
  Badge,
  Center,
  Divider,
  Drawer,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import {
  UsersIcon,
  GenderMaleIcon,
  GenderFemaleIcon,
} from "@phosphor-icons/react";
import { ExpandedSheetContent } from "./ExpandedSheetContent";
import { ReportDashboard } from "./ReportDashboard";
import type { ReportLevel, GeoUnit, PollingStation } from "../types";

interface ReportSummary {
  total: number;
  male: number;
  female: number;
}

interface ReportDrawerProps {
  opened: boolean;
  onClose: () => void;
  reportTitle: string;
  reportLevel: ReportLevel | null;
  reportData: any;
  loadingReport: boolean;
  reportError: any;
  reportSummary: ReportSummary | null;

  // Location data
  selectedMunicipality: string | null;
  selectedWard: string | null;
  municipalities: GeoUnit[] | undefined;
  wards: GeoUnit[] | undefined;
  loadingWards: boolean;
  booths: PollingStation[] | undefined;
  loadingBooths: boolean;

  // Top stations
  districtTopStationsData: any;
  loadingDistrictTopStations: boolean;
  municipalityTopStationsData: any;
  loadingMunicipalityTopStations: boolean;

  // Selection callbacks
  onSelectMunicipality: (id: string) => void;
  onSelectWard: (id: string) => void;
  onSelectBooth: (id: string, booth: PollingStation) => void;
  onBack: () => void;
  onDistrictStationClick: (station: any) => void;
  onMunicipalityStationClick: (station: any) => void;
}

export function ReportDrawer({
  opened,
  onClose,
  reportTitle,
  reportLevel,
  reportData,
  loadingReport,
  reportError,
  reportSummary,
  selectedMunicipality,
  selectedWard,
  municipalities,
  wards,
  loadingWards,
  booths,
  loadingBooths,
  districtTopStationsData,
  loadingDistrictTopStations,
  municipalityTopStationsData,
  loadingMunicipalityTopStations,
  onSelectMunicipality,
  onSelectWard,
  onSelectBooth,
  onBack,
  onDistrictStationClick,
  onMunicipalityStationClick,
}: ReportDrawerProps) {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size={520}
      withCloseButton
      title={
        <Stack gap={4}>
          <Text fw={700} size="lg">
            {reportTitle || "Report"}
          </Text>
          <Badge
            size="sm"
            variant="light"
            color={
              reportLevel === "dashboard"
                ? "gray"
                : reportLevel === "municipality"
                  ? "teal"
                  : reportLevel === "ward"
                    ? "blue"
                    : reportLevel === "booth"
                      ? "violet"
                      : "gray"
            }
          >
            {reportLevel || "dashboard"} report
          </Badge>
        </Stack>
      }
      styles={{
        body: { padding: 16 },
        header: { padding: 16 },
      }}
    >
      <ScrollArea h="calc(100vh - 100px)" offsetScrollbars scrollbarSize={6}>
        {/* While loading, show only a centered loader — no stale content */}
        {loadingReport ? (
          <Center h="60vh">
            <Loader size="lg" />
          </Center>
        ) : reportError ? (
          <Center py="xl">
            <Text size="sm" c="red">
              {(reportError as Error).message || "Failed to load report"}
            </Text>
          </Center>
        ) : (
          <>
            {/* Navigation */}
            <ExpandedSheetContent
              reportLevel={reportLevel}
              reportData={reportData}
              loadingReport={loadingReport}
              reportError={reportError}
              selectedMunicipality={selectedMunicipality}
              selectedWard={selectedWard}
              municipalities={municipalities}
              wards={wards}
              loadingWards={loadingWards}
              booths={booths}
              loadingBooths={loadingBooths}
              districtTopStationsData={districtTopStationsData}
              loadingDistrictTopStations={loadingDistrictTopStations}
              municipalityTopStationsData={municipalityTopStationsData}
              loadingMunicipalityTopStations={loadingMunicipalityTopStations}
              onSelectMunicipality={onSelectMunicipality}
              onSelectWard={onSelectWard}
              onSelectBooth={onSelectBooth}
              onBack={onBack}
              onDistrictStationClick={onDistrictStationClick}
              onMunicipalityStationClick={onMunicipalityStationClick}
            />

            {/* Divider between navigation and report */}
            {reportData && <Divider my="lg" />}

            {/* Full Report */}
            {reportData ? (
              <>
                {reportSummary && (
                  <>
                    <Group gap="xl" mb="md">
                      <Stack gap={4}>
                        <Group gap={8}>
                          <UsersIcon size={18} color="#228be6" weight="duotone" />
                          <Text size="lg" fw={600}>
                            {reportSummary.total.toLocaleString()}
                          </Text>
                        </Group>
                        <Text size="xs" c="dimmed">
                          Total Voters
                        </Text>
                      </Stack>
                      <Stack gap={4}>
                        <Group gap={8}>
                          <GenderMaleIcon
                            size={18}
                            color="#228be6"
                            weight="duotone"
                          />
                          <Text size="lg" fw={600}>
                            {reportSummary.male.toLocaleString()}
                          </Text>
                        </Group>
                        <Text size="xs" c="dimmed">
                          Male
                        </Text>
                      </Stack>
                      <Stack gap={4}>
                        <Group gap={8}>
                          <GenderFemaleIcon
                            size={18}
                            color="#e64980"
                            weight="duotone"
                          />
                          <Text size="lg" fw={600}>
                            {reportSummary.female.toLocaleString()}
                          </Text>
                        </Group>
                        <Text size="xs" c="dimmed">
                          Female
                        </Text>
                      </Stack>
                    </Group>
                    <Divider mb="md" />
                  </>
                )}
                <ReportDashboard
                  data={reportData}
                  reportType={reportLevel || "dashboard"}
                  municipalities={municipalities}
                />
              </>
            ) : null}
          </>
        )}
      </ScrollArea>
    </Drawer>
  );
}
