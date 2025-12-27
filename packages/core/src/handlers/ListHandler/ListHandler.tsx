"use client";

import { useEffect, useMemo, useReducer } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedState } from "@mantine/hooks";

import { autoSearch } from "@settle/core";
import { PropListHandler } from "./ListHandler.type";
import { Context } from "./ListHandler.context";

// * Reducer

const initialState = {
  page: 1,
  pageSize: 20,
  totalPages: 0,
  // search is handled by debounced state, not reducer
  selectedRecords: [] as any[],
  filters: [] as any[],
  tabActive: 0,
};

type Action =
  | { type: "SET_TOTAL_PAGES"; payload: number }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_PAGE_SIZE"; payload: number }
  | { type: "SET_PAGE_DATA"; payload: { page: number; pageSize: number } }
  | { type: "SET_SELECTED_RECORDS"; payload: any[] }
  | { type: "SET_TAB_ACTIVE"; payload: number }
  | { type: "ADD_FILTER"; payload: any }
  | { type: "REMOVE_FILTER"; payload: string }
  | { type: "CLEAR_FILTERS" };

function reducer(
  state: typeof initialState,
  action: Action
): typeof initialState {
  switch (action.type) {
    case "SET_TOTAL_PAGES":
      return { ...state, totalPages: action.payload };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_PAGE_SIZE":
      return { ...state, pageSize: action.payload };
    case "SET_PAGE_DATA":
      return {
        ...state,
        page: action.payload.page,
        pageSize: action.payload.pageSize,
      };
    case "SET_SELECTED_RECORDS":
      return { ...state, selectedRecords: action.payload };
    case "SET_TAB_ACTIVE":
      return { ...state, tabActive: action.payload };
    case "ADD_FILTER":
      return { ...state, filters: [...state.filters, action.payload] };
    case "REMOVE_FILTER":
      return {
        ...state,
        filters: state.filters.filter(
          (item: any) => item.accessor !== action.payload
        ),
      };
    case "CLEAR_FILTERS":
      return { ...state, filters: [] };
    default:
      return state;
  }
}

export function ListHandler({
  endpoint = "",
  moduleKey = ["vf", "default"],
  // api
  getRecords,
  getParams,
  dataKey,
  // server
  enableServerSearch = false,
  enableServerPagination = false,
  transformOnGet,
  //
  children,
}: PropListHandler) {
  // * STATE
  const [state, dispatch] = useReducer(reducer, initialState);
  const { page, pageSize, selectedRecords, filters, totalPages } = state;

  // debounce more aggressively when hitting server
  const [searchVal, setSearchVal] = useDebouncedState(
    "",
    enableServerSearch || enableServerPagination ? 500 : 250
  );

  // * PARAMS (memoized so queryKey object is stable)
  const params = useMemo(() => {
    if (!getParams) return {};
    // allow getParams to be either object or function
    return typeof getParams === "function"
      ? getParams({ state, searchVal })
      : getParams;
  }, [getParams, state, searchVal]);

  // * QUERY KEY
  const queryKey = useMemo(
    () =>
      enableServerSearch || enableServerPagination
        ? [
            ...moduleKey,
            endpoint,
            {
              page,
              pageSize,
              searchVal,
              filters,
              params,
            },
          ]
        : [...moduleKey, endpoint],
    [
      moduleKey,
      endpoint,
      enableServerSearch,
      enableServerPagination,
      page,
      pageSize,
      searchVal,
      filters,
      params,
    ]
  );

  // * QUERY
  const {
    data: rawData = [],
    isLoading,
    isError: isLoadingError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey,
    enabled: !!getRecords, // always enabled if we have an API fn
    queryFn: async () => {
      if (!getRecords) return [];

      const res: any = await getRecords({
        endpoint,
        searchValue: enableServerSearch ? searchVal : "",
        page: enableServerPagination ? page : undefined,
        pageSize: enableServerPagination ? pageSize : undefined,
        params,
      });

      const payload = enableServerSearch
        ? res?.results
        : dataKey
          ? res?.[dataKey]
          : res;

      if (enableServerPagination && res?.pagination) {
        dispatch({
          type: "SET_TOTAL_PAGES",
          payload: res.pagination.total_pages || 1,
        });
      }

      const arr = Array.isArray(payload) ? payload : [];

      return transformOnGet ? transformOnGet(arr) : arr;
    },
    // small staleTime so we don't hammer the server while user clicks around
    staleTime: 30_000,
  });

  // * CLIENT-SIDE SELECTION (search + pagination)
  const data = useMemo(() => {
    try {
      if (enableServerSearch && enableServerPagination) {
        // server does both search + pagination
        return rawData;
      }

      if (enableServerSearch && !enableServerPagination) {
        // server search, client pagination
        const records = rawData as any[];
        const start = (page - 1) * pageSize; // FIX: correct slice math
        const end = page * pageSize;
        return records.slice(start, end);
      }

      // pure client mode: all records in rawData
      const searched = autoSearch(rawData as any[], searchVal);
      const start = (page - 1) * pageSize;
      const end = page * pageSize;
      return searched.slice(start, end);
    } catch (err) {
      console.warn("ListHandler:getSelectiveData error", err);
      return [];
    }
  }, [
    rawData,
    page,
    pageSize,
    searchVal,
    enableServerSearch,
    enableServerPagination,
  ]);

  // * CONTEXT VALUE (memoized to reduce child re-renders)
  const contextValue = useMemo(
    () => ({
      state: {
        ...state,
        totalPages, // expose in case consumer needs it
      },
      dispatch,
      // table
      data,
      isLoading,
      isFetching,
      refetch,
      isLoadingError,
      // search
      searchVal,
      setSearchVal,
    }),
    [
      state,
      totalPages,
      data,
      isLoading,
      isFetching,
      refetch,
      isLoadingError,
      searchVal,
      setSearchVal,
    ]
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}
