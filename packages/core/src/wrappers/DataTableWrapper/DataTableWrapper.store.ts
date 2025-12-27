"use client";

import { create, ExtractState } from "zustand";
import { combine } from "zustand/middleware";
//lodash
import debounce from "lodash/debounce";

type FilterType =
  | {
      type: "single";
      key: string;
      value: string;
    }
  | {
      type: "group";
      values: {
        key: string;
        value: string;
        operator: "AND" | "OR";
      }[];
    };

const useDataTableWrapperStore = create(
  combine(
    {
      page: 1,
      pages: 1,
      pageSize: 25,
      totalItems: 0,
      search: "",
      filters: [] as FilterType[], // Explicity Type Definition
    },
    (set, get) => {
      // # Search Debounced

      const setDebouncedSearch = debounce((search: string) => {
        return set({ search });
      }, 500);

      return {
        setPaginationData: (paginationData: any) => {
          set((state) => ({
            pages: paginationData.pages,
            totalItems: paginationData.totalItems || 0,
          }));
        },

        setPage: (page: number) => set({ page }),

        setSearch: (search: string) => setDebouncedSearch(search),

        setPageSize: (pageSize: number) => {
          set((state) => ({
            pageSize: pageSize,
          }));
        },

        // > FILTERS

        addFilter: (filter: any) => {
          set((state) => ({
            filters: [...state.filters, filter],
          }));
        },
        removeFilter: (index: any) => {
          set((state) => ({
            filters: state.filters.filter((_, i) => i !== index),
          }));
        },
        resetFilter: () => {
          set((state) => ({
            filters: [],
          }));
        },

        // > RESETS
        resetSearch: () => {
          set((state) => ({
            search: "",
          }));
        },
        resetPageSize: () => {
          set((state) => ({
            pageSize: 25,
          }));
        },
        resetPage: () => {
          set((state) => ({
            page: 1,
          }));
        },
      };
    }
  )
);

export { useDataTableWrapperStore };
