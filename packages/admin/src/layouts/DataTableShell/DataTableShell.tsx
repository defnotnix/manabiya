"use client";

import { useCallback, useEffect, useState } from "react";

import { Box, Stack } from "@mantine/core";
import { Tabs } from "@settle/admin";

import { PropDataTableShell } from "./DataTableShell.type";
import { DataTableShellDataTable } from "./components/DataTable";
import { DataTableShellHeader } from "./components/Header";
import { DataTableShellTableActions } from "./components/TableActions";
import { DataTableShellToolbar } from "./components/Toolbar";
import { Context as DataTableShellContext } from "./DataTableShell.context";

export function DataTableShell({
  sustained = false,
  moduleInfo,
  tabs = [],
  idAccessor = "id",
  columns = [],
  tableActions = [],
  rowColor = "var(--mantine-color-gray-0)",
  rowBackgroundColor = "var(--mantine-color-gray-0)",
  rowStyle,
  hasServerSearch = false,
  pageSizes = [10, 20, 50, 100],
  forceFilter,
  disableActions = false,
  hideFilters,
  filterList = [],
  newButtonHref,
  onNewClick,
  onEditClick,
  onDeleteClick,
  onReviewClick,
}: PropDataTableShell) {
  // * CONTEXT

  // * STATE

  const [customColumns, setCustomColumns] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  // * EFFECT

  useEffect(() => {
    setCustomColumns(
      columns.map((cinfo: any) => ({
        ...cinfo,
        visible: true,
      }))
    );
  }, [columns]);

  // * FUNCTIONS

  const handleToggleColumn = useCallback((index: number) => {
    setCustomColumns((prev: any) =>
      prev.map((cinfo: any, cindex: number) =>
        cindex === index ? { ...cinfo, visible: !cinfo.visible } : cinfo
      )
    );
  }, []);

  const handleResetColumns = useCallback(() => {
    setCustomColumns((prev: any) =>
      prev.map((e: any) => ({
        ...e,
        visible: true,
      }))
    );
  }, []);

  const [selectedRecords, setSelectedRecords] = useState<any[]>([]);

  const contextValue = {
    selectedRecords,
    setSelectedRecords,
  };

  return (
    <DataTableShellContext.Provider value={contextValue}>
      <Stack gap={0}>
        <DataTableShellHeader
          moduleInfo={moduleInfo}
          newButtonHref={newButtonHref}
          sustained={sustained}
          onNewClick={onNewClick}
        />

        {/* Tabs */}
        <Tabs
          px={0}
          active={activeTab}
          onTabChange={setActiveTab}
          tabs={tabs}
        />

        {/* Toolbar */}
        <DataTableShellToolbar
          hideFilters={hideFilters}
          filterList={filterList}
          customColumns={customColumns}
          onToggleColumn={handleToggleColumn}
          onResetColumns={handleResetColumns}
        />

        {/* Table */}
        <Box
          pos="relative"
          h={{
            lg: "calc(100vh - 260px)",
          }}
        >
          <DataTableShellDataTable
            idAccessor={idAccessor}
            columns={columns}
            customColumns={customColumns}
            hasServerSearch={hasServerSearch}
            forceFilter={forceFilter}
            disableActions={disableActions}
            rowStyle={rowStyle}
            pageSizes={pageSizes}
          />

          <DataTableShellTableActions
            idAccessor={idAccessor}
            sustained={sustained}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
            onReviewClick={onReviewClick}
          />
        </Box>
      </Stack>
    </DataTableShellContext.Provider>
  );
}
