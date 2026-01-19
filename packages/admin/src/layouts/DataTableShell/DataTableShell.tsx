"use client";

import { useCallback, useEffect, useState } from "react";

import { Box, Container, Paper } from "@mantine/core";

import { DataTableWrapper } from "@settle/core";
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
      })),
    );
  }, [columns]);

  // * FUNCTIONS

  const { resetPage } = DataTableWrapper.useDataTableWrapperStore();

  const handleTabChange = useCallback(
    (index: number) => {
      setActiveTab(index);
      // Reset to page 1 when switching tabs
      resetPage();
    },
    [resetPage],
  );

  const handleToggleColumn = useCallback((index: number) => {
    setCustomColumns((prev: any) =>
      prev.map((cinfo: any, cindex: number) =>
        cindex === index ? { ...cinfo, visible: !cinfo.visible } : cinfo,
      ),
    );
  }, []);

  const handleResetColumns = useCallback(() => {
    setCustomColumns((prev: any) =>
      prev.map((e: any) => ({
        ...e,
        visible: true,
      })),
    );
  }, []);

  const [selectedRecords, setSelectedRecords] = useState<any[]>([]);

  const activeTabConfig = tabs[activeTab];

  const contextValue = {
    selectedRecords,
    setSelectedRecords,
    activeTab,
    activeTabConfig,
    setActiveTab: handleTabChange,
  };

  return (
    <DataTableShellContext.Provider value={contextValue}>
      <Container size="xl" w="100%">
        <DataTableShellHeader
          moduleInfo={moduleInfo}
          newButtonHref={newButtonHref}
          sustained={sustained}
          onNewClick={onNewClick}
        />
      </Container>

      <Container size="xl">
        {/* Toolbar */}
        <DataTableShellToolbar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          hideFilters={hideFilters}
          filterList={filterList}
          customColumns={customColumns}
          onToggleColumn={handleToggleColumn}
          onResetColumns={handleResetColumns}
        />
      </Container>

      <Container size="xl" h="100%" mt="md">
        <Paper
          withBorder
          style={{ borderTop: "none", flex: 1, overflow: "hidden" }}
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
        </Paper>

        <DataTableShellTableActions
          idAccessor={idAccessor}
          sustained={sustained}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          onReviewClick={onReviewClick}
        />
      </Container>
    </DataTableShellContext.Provider>
  );
}
