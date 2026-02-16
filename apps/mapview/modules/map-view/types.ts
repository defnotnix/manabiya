export type ReportLevel = "dashboard" | "district" | "municipality" | "ward" | "booth";

export interface GeoUnit {
  id: number;
  unit_type: string;
  display_name: string;
  display_name_ne?: string;
  display_name_en?: string;
  ward_no?: number | null;
}

export interface PollingStation {
  id: number;
  place_name: string;
  place_name_en?: string;
}

export function formatDisplayName(unit: GeoUnit): string {
  const nepali = unit.display_name || unit.display_name_ne;
  const english = unit.display_name_en;
  if (nepali && english) return `${nepali} (${english})`;
  return nepali || english || `${unit.id}`;
}
