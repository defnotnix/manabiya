"use client";

import { useEffect, useState } from "react";
import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import { Badge, Loader, Select, Stack, Text, Table } from "@mantine/core";
import {
  GEO_UNIT_MODULE_CONFIG,
  GEO_UNIT_API,
} from "@/modules/config/location/geo-units/module.config";
import { GeoUnitForm } from "@/modules/config/location/geo-units/form/GeoUnitForm";
import { geoUnitFormConfig } from "@/modules/config/location/geo-units/form/form.config";
import { geoUnitListColumns } from "./list.columns";
import { GEO_UNIT_TYPE_API } from "@/modules/config/location/geo-unit-types/module.api";

// Nested Table Component
function ChildGeoUnitTable({
  parentId,
  unitTypes,
}: {
  parentId: string;
  unitTypes: any[];
}) {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const fetchChildren = async (type: string) => {
    setLoading(true);
    try {
      const res = await GEO_UNIT_API.getGeoUnits({
        unit_type: type,
        parent: parentId,
      });
      setRecords(res?.data?.results || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedType) {
      fetchChildren(selectedType);
    }
  }, [selectedType, parentId]);

  return (
    <Stack p="xs">
      <Text size="sm" fw={500}>
        Children Units
      </Text>
      <Select
        placeholder="Select Child Unit Type"
        data={unitTypes}
        value={selectedType}
        onChange={setSelectedType}
        style={{ maxWidth: 200 }}
        size="xs"
      />
      {loading ? (
        <Loader size="sm" />
      ) : (
        <Table withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Code</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {records.length > 0 ? (
              records.map((r) => (
                <Table.Tr key={r.id}>
                  <Table.Td>{r.display_name}</Table.Td>
                  <Table.Td>
                    <Badge size="xs">{r.unit_type}</Badge>
                  </Table.Td>
                  <Table.Td>{r.official_code}</Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={3} align="center">
                  {selectedType
                    ? "No children found"
                    : "Select a type to view children"}
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      )}
    </Stack>
  );
}

export function ListPage() {
  const [unitTypes, setUnitTypes] = useState<
    { label: string; value: string }[]
  >([]);

  // Track expanded rows
  const [expandedRecordIds, setExpandedRecordIds] = useState<any[]>([]);

  useEffect(() => {
    async function fetchTypes() {
      try {
        const res = await GEO_UNIT_TYPE_API.getGeoUnitTypes();
        if (res?.data?.results) {
          setUnitTypes(
            res.data.results.map((t: any) => ({
              label: t.name,
              value: t.name,
            })),
          );
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchTypes();
  }, []);

  // Filter list configuration
  const filterList = [
    {
      label: "Unit Type",
      field: "unit_type",
      type: "select",
      options: unitTypes,
      placeholder: "Filter by Unit Type",
      defaultValue: unitTypes[0]?.value,
    },
    {
      label: "Include Inactive",
      field: "include_inactive",
      type: "select",
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ],
    },
  ];

  return (
    <DataTableWrapper
      queryKey="geoUnit.list"
      queryGetFn={async (params) => {
        return GEO_UNIT_API.getGeoUnits(params);
      }}
      dataKey="results"
    >
      <DataTableModalShell
        moduleInfo={GEO_UNIT_MODULE_CONFIG}
        columns={geoUnitListColumns}
        idAccessor="id"
        // @ts-ignore
        filterList={filterList}
        onCreateApi={async (data) => GEO_UNIT_API.createGeoUnit(data)}
        onEditApi={async (id, data) =>
          GEO_UNIT_API.updateGeoUnit(String(id), data)
        }
        onDeleteApi={async (id) => GEO_UNIT_API.deleteGeoUnit(String(id))}
        // Row Expansion
        rowExpansion={{
          allowMultiple: false,
          expanded: {
            recordIds: expandedRecordIds,
            onRecordIdsChange: setExpandedRecordIds,
          },
          content: ({ record }: { record: any }) => (
            <ChildGeoUnitTable parentId={record.id} unitTypes={unitTypes} />
          ),
        }}
        createFormComponent={<GeoUnitForm />}
        editFormComponent={<GeoUnitForm />}
        createFormConfig={geoUnitFormConfig}
        editFormConfig={geoUnitFormConfig}
        modalWidth="lg"
      />
    </DataTableWrapper>
  );
}
