"use client";

import { useState } from "react";
import {
  Stack,
  Text,
  Paper,
  Group,
  Badge,
  Container,
  Divider,
} from "@mantine/core";
import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import {
  VOTER_ROLL_ENTRIES_MODULE_CONFIG,
  VOTER_ROLL_ENTRIES_API,
} from "../../module.config";
import { VoterRollEntryForm } from "../../form/VoterRollEntryForm";
import { voterRollEntryFormConfig } from "../../form/form.config";
import { voterRollEntryListColumns } from "./list.columns";
import { PollingStationSelect } from "../../components/PollingStationSelect";

export function ListPage() {
  const [selectedPollingStation, setSelectedPollingStation] = useState<
    string | null
  >(null);
  const [selectedStationName, setSelectedStationName] = useState<string>("");

  const handlePollingStationChange = (
    stationId: string | null,
    stationData?: any,
  ) => {
    setSelectedPollingStation(stationId);
    setSelectedStationName(
      stationData?.display_name || stationData?.name || "",
    );
  };

  return (
    <>
      {/* Polling Station Selector */}
      <Divider mt="md" />
      <Paper py="md" radius={0}>
        <Container size="xl">
          <PollingStationSelect
            value={selectedPollingStation}
            onChange={handlePollingStationChange}
            singleRow={true}
          />
        </Container>
      </Paper>
      <Divider mb="md" />
      {/* Show table only when polling station is selected */}
      {selectedPollingStation ? (
        <DataTableWrapper
          queryKey={`voter-roll-entries.list.${selectedPollingStation}`}
          queryGetFn={async (params) =>
            VOTER_ROLL_ENTRIES_API.getEntries({
              ...params,
              polling_station: selectedPollingStation,
            })
          }
          dataKey="results"
          enableServerQuery={true}
          paginationDataKey="pagination"
        >
          <DataTableModalShell
            moduleInfo={{
              ...VOTER_ROLL_ENTRIES_MODULE_CONFIG,
              description: `Polling Station: ${selectedStationName || selectedPollingStation}`,
            }}
            columns={voterRollEntryListColumns}
            idAccessor="id"
            hasServerSearch={true}
            filterList={[
              {
                label: "Roll",
                field: "roll",
                type: "text",
              },
              {
                label: "Voter No",
                field: "voter_no",
                type: "text",
              },
            ]}
            onEditApi={async (id, data) =>
              VOTER_ROLL_ENTRIES_API.updateEntry(String(id), data)
            }
            editFormComponent={<VoterRollEntryForm />}
            editFormConfig={voterRollEntryFormConfig}
            modalWidth="lg"
          />
        </DataTableWrapper>
      ) : (
        <Container>
          <Paper p="xl" ta="center">
            <Stack align="center" gap="sm">
              <Text size="lg" fw={500} c="dimmed">
                Select a Polling Station
              </Text>
            </Stack>
          </Paper>
        </Container>
      )}
    </>
  );
}
