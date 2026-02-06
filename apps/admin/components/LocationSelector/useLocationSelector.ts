"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { GEO_UNIT_API } from "@/modules/config/location/geo-units/module.api";
import { PLACE_API } from "@/modules/config/location/places/module.api";

export interface GeoUnit {
  id: number;
  unit_type: string;
  parent_id: number | null;
  display_name: string;
  official_code?: string;
  ward_no?: number | null;
  local_body_kind?: string;
}

export interface Place {
  id: number;
  place_type: string;
  geo_unit_id: number;
  name: string;
  name_en?: string;
  point?: { lat: number; lng: number } | null;
}

export interface LocationState {
  province: string | null;
  district: string | null;
  localBody: string | null;
  ward: string | null;
}

export interface UseLocationSelectorOptions {
  /** Whether to fetch places when ward is selected */
  fetchPlaces?: boolean;
  /** Place type filter (e.g., "POLLING_CENTER") */
  placeType?: string;
  /** Include point data for places (lat/lng) */
  includePoint?: boolean;
  /** Initial location state */
  initialState?: Partial<LocationState>;
}

export interface UseLocationSelectorReturn {
  // Selection state
  selectedProvince: string | null;
  selectedDistrict: string | null;
  selectedLocalBody: string | null;
  selectedWard: string | null;

  // Setters
  setSelectedProvince: (value: string | null) => void;
  setSelectedDistrict: (value: string | null) => void;
  setSelectedLocalBody: (value: string | null) => void;
  setSelectedWard: (value: string | null) => void;

  // Data
  provinces: GeoUnit[];
  districts: GeoUnit[];
  localBodies: GeoUnit[];
  wards: GeoUnit[];
  places: Place[];

  // Loading states
  loadingProvinces: boolean;
  loadingDistricts: boolean;
  loadingLocalBodies: boolean;
  loadingWards: boolean;
  loadingPlaces: boolean;

  // Options for Select components
  provinceOptions: { value: string; label: string }[];
  districtOptions: { value: string; label: string }[];
  localBodyOptions: { value: string; label: string }[];
  wardOptions: { value: string; label: string }[];
  placeOptions: { value: string; label: string }[];

  // Utility functions
  clearFilters: () => void;
  hasActiveFilters: boolean;
  getFullLocationPath: () => string;
}

export function useLocationSelector(
  options: UseLocationSelectorOptions = {}
): UseLocationSelectorReturn {
  const {
    fetchPlaces = true,
    placeType,
    includePoint = true,
    initialState = {},
  } = options;

  // Selection state
  const [selectedProvince, setSelectedProvince] = useState<string | null>(
    initialState.province ?? null
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(
    initialState.district ?? null
  );
  const [selectedLocalBody, setSelectedLocalBody] = useState<string | null>(
    initialState.localBody ?? null
  );
  const [selectedWard, setSelectedWard] = useState<string | null>(
    initialState.ward ?? null
  );

  // Helper to extract results from API response
  // Handles both: { results: [...] } and { data: { results: [...] } }
  const extractResults = (response: any): any[] => {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (response.results) return response.results;
    if (response.data?.results) return response.data.results;
    return [];
  };

  // Fetch Provinces
  const { data: provincesData, isLoading: loadingProvinces } = useQuery({
    queryKey: ["geo-units", "PROVINCE"],
    queryFn: async () => {
      const response = await GEO_UNIT_API.getGeoUnits({
        unit_type: "PROVINCE",
        ordering: "display_name",
        page_size: 100,
      });
      return extractResults(response) as GeoUnit[];
    },
  });

  // Fetch Districts (when province selected)
  const { data: districtsData, isLoading: loadingDistricts } = useQuery({
    queryKey: ["geo-units", "DISTRICT", selectedProvince],
    queryFn: async () => {
      if (!selectedProvince) return [];
      const response = await GEO_UNIT_API.getGeoUnits({
        unit_type: "DISTRICT",
        parent: Number(selectedProvince),
        ordering: "display_name",
        page_size: 100,
      });
      return extractResults(response) as GeoUnit[];
    },
    enabled: !!selectedProvince,
  });

  // Fetch Local Bodies (when district selected)
  const { data: localBodiesData, isLoading: loadingLocalBodies } = useQuery({
    queryKey: ["geo-units", "LOCAL_BODY", selectedDistrict],
    queryFn: async () => {
      if (!selectedDistrict) return [];
      const response = await GEO_UNIT_API.getGeoUnits({
        unit_type: "LOCAL_BODY",
        parent: Number(selectedDistrict),
        ordering: "display_name",
        page_size: 100,
      });
      return extractResults(response) as GeoUnit[];
    },
    enabled: !!selectedDistrict,
  });

  // Fetch Wards (when local body selected)
  const { data: wardsData, isLoading: loadingWards } = useQuery({
    queryKey: ["geo-units", "WARD", selectedLocalBody],
    queryFn: async () => {
      if (!selectedLocalBody) return [];
      const response = await GEO_UNIT_API.getGeoUnits({
        unit_type: "WARD",
        parent: Number(selectedLocalBody),
        ordering: "ward_no",
        page_size: 100,
      });
      return extractResults(response) as GeoUnit[];
    },
    enabled: !!selectedLocalBody,
  });

  // Fetch Places (when ward selected)
  const { data: placesData, isLoading: loadingPlaces } = useQuery({
    queryKey: ["places", selectedWard, placeType, includePoint],
    queryFn: async () => {
      if (!selectedWard) return [];
      const params: any = {
        geo_unit: Number(selectedWard),
        page_size: 100,
      };
      if (placeType) {
        params.place_type = placeType;
      }
      if (includePoint) {
        params.include_point = true;
      }
      const response = await PLACE_API.getPlaces(params);
      return extractResults(response) as Place[];
    },
    enabled: fetchPlaces && !!selectedWard,
  });

  // Reset cascading values when parent changes
  useEffect(() => {
    setSelectedDistrict(null);
    setSelectedLocalBody(null);
    setSelectedWard(null);
  }, [selectedProvince]);

  useEffect(() => {
    setSelectedLocalBody(null);
    setSelectedWard(null);
  }, [selectedDistrict]);

  useEffect(() => {
    setSelectedWard(null);
  }, [selectedLocalBody]);

  // Build select options
  const provinceOptions = useMemo(
    () =>
      (provincesData || [])
        .filter((unit) => unit.id != null)
        .map((unit) => ({
          value: String(unit.id),
          label: unit.display_name || `Province ${unit.id}`,
        })),
    [provincesData]
  );

  const districtOptions = useMemo(
    () =>
      (districtsData || [])
        .filter((unit) => unit.id != null)
        .map((unit) => ({
          value: String(unit.id),
          label: unit.display_name || `District ${unit.id}`,
        })),
    [districtsData]
  );

  const localBodyOptions = useMemo(
    () =>
      (localBodiesData || [])
        .filter((unit) => unit.id != null)
        .map((unit) => ({
          value: String(unit.id),
          label: unit.display_name || `Local Body ${unit.id}`,
        })),
    [localBodiesData]
  );

  const wardOptions = useMemo(
    () =>
      (wardsData || [])
        .filter((unit) => unit.id != null)
        .map((unit) => ({
          value: String(unit.id),
          label: unit.ward_no
            ? `Ward ${unit.ward_no}`
            : unit.display_name || `Ward ${unit.id}`,
        })),
    [wardsData]
  );

  const placeOptions = useMemo(
    () =>
      (placesData || [])
        .filter((place) => place.id != null)
        .map((place) => ({
          value: String(place.id),
          label: place.name || place.name_en || `Place ${place.id}`,
        })),
    [placesData]
  );

  const clearFilters = useCallback(() => {
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedLocalBody(null);
    setSelectedWard(null);
  }, []);

  const hasActiveFilters = !!(
    selectedProvince ||
    selectedDistrict ||
    selectedLocalBody ||
    selectedWard
  );

  const getFullLocationPath = useCallback(() => {
    const parts: string[] = [];
    if (selectedProvince) {
      const province = provincesData?.find(
        (p) => String(p.id) === selectedProvince
      );
      if (province) parts.push(province.display_name);
    }
    if (selectedDistrict) {
      const district = districtsData?.find(
        (d) => String(d.id) === selectedDistrict
      );
      if (district) parts.push(district.display_name);
    }
    if (selectedLocalBody) {
      const localBody = localBodiesData?.find(
        (l) => String(l.id) === selectedLocalBody
      );
      if (localBody) parts.push(localBody.display_name);
    }
    if (selectedWard) {
      const ward = wardsData?.find((w) => String(w.id) === selectedWard);
      if (ward) {
        parts.push(ward.ward_no ? `Ward ${ward.ward_no}` : ward.display_name);
      }
    }
    return parts.join(" > ");
  }, [
    selectedProvince,
    selectedDistrict,
    selectedLocalBody,
    selectedWard,
    provincesData,
    districtsData,
    localBodiesData,
    wardsData,
  ]);

  return {
    // Selection state
    selectedProvince,
    selectedDistrict,
    selectedLocalBody,
    selectedWard,

    // Setters
    setSelectedProvince,
    setSelectedDistrict,
    setSelectedLocalBody,
    setSelectedWard,

    // Data
    provinces: provincesData || [],
    districts: districtsData || [],
    localBodies: localBodiesData || [],
    wards: wardsData || [],
    places: placesData || [],

    // Loading states
    loadingProvinces,
    loadingDistricts,
    loadingLocalBodies,
    loadingWards,
    loadingPlaces,

    // Options
    provinceOptions,
    districtOptions,
    localBodyOptions,
    wardOptions,
    placeOptions,

    // Utility functions
    clearFilters,
    hasActiveFilters,
    getFullLocationPath,
  };
}
