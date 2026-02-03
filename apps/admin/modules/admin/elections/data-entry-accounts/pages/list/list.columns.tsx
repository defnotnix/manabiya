import { Badge } from "@mantine/core";

export const dataEntryAccountListColumns = [
  { accessor: "id", header: "ID", size: 80 },
  { accessor: "username", header: "Username", size: 150 },
  {
    accessor: "polling_stations",
    header: "Polling Stations",
    size: 200,
    render: (record: any) => {
      if (Array.isArray(record.polling_stations)) {
        return record.polling_stations
          .map((station: any) =>
            typeof station === "object"
              ? (station.place_name || station.place_name_en || station.id)
              : station
          )
          .join(", ");
      }
      return record.polling_stations;
    },
  },
];
