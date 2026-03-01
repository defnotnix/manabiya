export type ReportLevel = "dashboard" | "district" | "municipality" | "ward" | "booth";

export interface GeoUnit {
  id: number;
  unit_type: string;
  display_name: string;
  display_name_ne?: string;
  display_name_en?: string;
  ward_no?: number | null;
}

export type SecurityPriority = "RED" | "YELLOW" | "GREEN";

export interface BoothReportCandidate {
  id?: number;
  report?: number;
  name: string;
  phone?: string;
  accepted: boolean;
  remarks?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BoothReport {
  id: number;
  polling_station_id: number;
  year: number;
  priority: SecurityPriority;
  remarks: string;
  booth_money: number;
  candidates: BoothReportCandidate[];
  created_at: string;
  updated_at: string;
}

export interface PollingStation {
  id: number;
  station_code: string | null;
  election_id: number;
  place_id: number;
  place_name_ne: string;
  place_name_en: string | null;
  ward_id: number;
  ward_no: number;
  ward_name_ne: string;
  ward_name_en: string;
  municipality_id: number;
  municipality_name_ne: string;
  municipality_name_en: string;
  district_id: number;
  district_name_ne: string;
  district_name_en: string;
  province_id: number;
  province_name_ne: string;
  province_name_en: string;
  latitude: number;
  longitude: number;
  voter_population?: number;
  reports?: BoothReport[];
}

export function formatDisplayName(unit: GeoUnit): string {
  const nepali = unit.display_name || unit.display_name_ne;
  const english = unit.display_name_en;
  if (nepali && english) return `${nepali} (${english})`;
  return nepali || english || `${unit.id}`;
}
