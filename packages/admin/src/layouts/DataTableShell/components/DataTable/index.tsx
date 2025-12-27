"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useMantineColorScheme } from "@mantine/core";

import { sortBy } from "lodash";
import { DataTable, DataTableSortStatus } from "mantine-datatable";

import { DataTableWrapper } from "@settle/core";
import { PropDataTableShellDataTable } from "../../DataTableShell.type";
import { DataTableEmptyState } from "../EmptyState";
import { useContext } from "../../DataTableShell.context";

export function DataTableShellDataTable({
  idAccessor,
  columns,
  customColumns = [],
  hasServerSearch,
  forceFilter,
  disableActions,
  rowStyle,
  pageSizes = [10, 20, 50, 100],
}: PropDataTableShellDataTable) {
  //* CONTEXT

  const { colorScheme } = useMantineColorScheme();
  const {
    data,
    isLoading: isFetching,
    refetch,
  } = DataTableWrapper.useDataTableContext();
  const {
    page,
    pageSize,
    pages: totalPages,
    totalItems,
  } = DataTableWrapper.useDataTableWrapperStore();
  const { selectedRecords, setSelectedRecords } = useContext();

  // * STATE

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<any>>({
    columnAccessor: "name",
    direction: "asc",
  });

  // * FUNCTION

  // ---------------------------------------------------------------------------
  // EFFECTS
  // ---------------------------------------------------------------------------

  // Initialize column visibility only when `columns` change

  // Refetch data whenever page or pageSize changes (server-side pagination)
  useEffect(() => {
    if (!hasServerSearch) return;
    refetch();
  }, [page, pageSize, hasServerSearch, refetch]);

  // ---------------------------------------------------------------------------
  // DERIVED DATA
  // ---------------------------------------------------------------------------

  // Sorted records derived from `data` and `sortStatus`
  const sortedRecords = useMemo(() => {
    if (!data) return [];

    if (hasServerSearch) {
      // assume backend already returns sorted data
      return data;
    }

    const sorted = sortBy(data, sortStatus.columnAccessor);
    return sortStatus.direction === "desc" ? sorted.reverse() : sorted;
  }, [data, sortStatus, hasServerSearch]);

  // Apply optional forceFilter
  const visibleRecords = useMemo(
    () => (forceFilter ? forceFilter(sortedRecords) : sortedRecords),
    [sortedRecords, forceFilter]
  );

  // Visible columns (based on column visibility)
  const visibleColumns = useMemo(
    () => customColumns.filter((c: any) => c.visible),
    [customColumns]
  );

  // Final columns passed to DataTable
  const tableColumnConfig = useMemo(
    () => [
      {
        accessor: "#",
        title: "#",
        width: 50,
        render: (_row: any, index: number) => <>{index + 1}</>,
      },
      ...visibleColumns,
    ],
    [visibleColumns, disableActions]
  );

  const totalRecords = useMemo(
    () => (hasServerSearch ? totalItems : visibleRecords.length),
    [hasServerSearch, totalItems, visibleRecords.length]
  );

  // * FUNCTIONS
  const { setPage, setPageSize } = DataTableWrapper.useDataTableWrapperStore();

  const handlePageChange = useCallback(
    (nextPage: number) => {
      setPage(nextPage);
    },
    [setPage]
  );

  const handlePageSizeChange = useCallback(
    (nextSize: number) => {
      setPageSize(nextSize);
      setPage(1);
    },
    [setPageSize, setPage]
  );

  const handleSelectionChange = useCallback(
    (selection: any[]) => {
      setSelectedRecords(selection);
    },
    [setSelectedRecords]
  );

  const handleClearSelection = useCallback(() => {
    handleSelectionChange([]);
  }, [handleSelectionChange]);

  return (
    <>
      <DataTable
        withTableBorder
        idAccessor={idAccessor}
        records={visibleRecords}
        columns={tableColumnConfig}
        emptyState={<DataTableEmptyState />}
        fetching={isFetching}
        fz="xs"
        fw={500}
        horizontalSpacing="lg"
        striped
        highlightOnHover
        styles={{
          header: {
            background:
              colorScheme === "dark"
                ? "var(--mantine-color-dark-6)"
                : "var(--mantine-color-gray-1)",
          },
        }}
        rowStyle={rowStyle}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        totalRecords={totalRecords}
        page={page}
        onPageChange={handlePageChange}
        recordsPerPage={pageSize}
        recordsPerPageOptions={pageSizes}
        onRecordsPerPageChange={handlePageSizeChange}
        paginationSize="xs"
        selectionTrigger="cell"
        selectionCheckboxProps={{ size: "xs" }}
        selectedRecords={selectedRecords}
        onSelectedRecordsChange={handleSelectionChange}
      />
    </>
  );
}
