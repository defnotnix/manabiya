"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useDataTableContext,
  DataTableContext,
} from "./DataTableWrapper.context";
import { autoSearch } from "@settle/core";
import { useDataTableWrapperStore } from "./DataTableWrapper.store";
import { PropDataTableWrapper } from "./DataTableWrapper.type";

export function DataTableWrapper<T>({
  testMode = false,
  children,
  //query
  queryKey = "module.list",
  queryGetFn,
  //server-handling
  enableServerQuery = false,
  //dataExtraction
  dataKey,
  paginationDataKey,
  paginationResponseFn = () => {},
}: PropDataTableWrapper) {
  // * STORE
  const { page, pageSize, search, filters, setPaginationData } =
    useDataTableWrapperStore((state) => state);

  const debugLog = (message: string, data: any) => {
    if (testMode) console.log(message, data);
  };

  // * API QUERY

  // Helper function to get data from response
  function getDataFromResponse(res: any) {
    if (enableServerQuery && dataKey) {
      return res?.[dataKey]; // When server query is enabled, use dataKey
    }

    return dataKey ? res?.[dataKey] : res; // Otherwise, use the whole response
  }

  // Helper function to get pagination data
  function getPaginationData(res: any) {
    return paginationDataKey
      ? res?.[paginationDataKey]
      : paginationResponseFn(res);
  }

  const {
    data = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery<T[]>({
    queryKey: enableServerQuery
      ? [...queryKey.split("."), page, pageSize, search, filters]
      : queryKey.split("."),
    queryFn: queryGetFn
      ? async () => {
          try {
            const res = await queryGetFn(
              enableServerQuery
                ? {
                    page,
                    pageSize,
                    search,
                    filters,
                  }
                : {}
            );

            // > Setting up Data
            const _data = getDataFromResponse(res);

            if (enableServerQuery) {
              const _paginationData = getPaginationData(res);
              setPaginationData(_paginationData);
            }

            debugLog("DataTableWrapper_Data", _data);

            if (!Array.isArray(_data)) {
              console.warn("Warning: Expected an array, but got:", _data);
              return [];
            }

            return _data;
          } catch (error) {
            console.error("Error fetching data:", error);
            return [];
          }
        }
      : undefined,
  });

  // * PAGINATION & SEARCH

  // > Memoized Selective Data

  const getSelectiveData = useMemo(() => {
    try {
      if (enableServerQuery) {
        return data; // Server handles filtering/pagination
      }

      const filteredData = autoSearch(data, search || "");
      const startIndex = (page - 1) * pageSize;
      return filteredData.slice(startIndex, startIndex + pageSize);
    } catch (err) {
      console.error("Error in getSelectiveData:", err);
      return [];
    }
  }, [data, search, page, pageSize, enableServerQuery]);

  return (
    <DataTableContext
      value={{
        data: getSelectiveData,
        isLoading: isLoading || isFetching,
        isError,
        refetch,
      }}
    >
      {children}
    </DataTableContext>
  );
}

DataTableWrapper.useDataTableContext = useDataTableContext;
DataTableWrapper.useDataTableWrapperStore = useDataTableWrapperStore;
