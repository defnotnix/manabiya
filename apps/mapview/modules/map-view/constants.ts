export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "";

export const LIBRARIES: ("places" | "geometry" | "visualization")[] = [
  "places",
  "geometry",
  "visualization",
];

export const GORKHA_1_CENTER = { lat: 28.0, lng: 84.63 };
export const DEFAULT_ZOOM = 12;

// GeoJSON municipality name → API municipality ID
export const MUNICIPALITY_NAME_TO_ID: Record<string, number> = {
  Aarughat: 110,
  Arughat: 110,
  Gandaki: 121,
  Gorkha: 130,
  Chumnuwri: 145,
  Chumanuvri: 145,
  Dharche: 153,
  Bhimsen: 161,
  Bhimasenathapa: 161,
  "Sahid Lakhan": 170,
};

// API municipality ID → GeoJSON name (uses first/canonical name per ID)
export const MUNICIPALITY_ID_TO_NAME: Record<number, string> = {
  110: "Aarughat",
  121: "Gandaki",
  130: "Gorkha",
  145: "Chumnuwri",
  153: "Dharche",
  161: "Bhimsen",
  170: "Sahid Lakhan",
};

export const MAP_STYLES_NO_LABELS: google.maps.MapTypeStyle[] = [
  {
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];

export const MAP_STYLES_DARK_THEME: google.maps.MapTypeStyle[] = [
  {
    elementType: "geometry",
    stylers: [{ color: "#212121" }],
  },
  {
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#212121" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#757575" }, { visibility: "off" }],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9e9e9e" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#bdbdbd" }],
  },
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#181818" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1b1b1b" }],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{ color: "#2c2c2c" }],
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8a8a8a" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#373737" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3c3c3c" }],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [{ color: "#4e4e4e" }],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }],
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#000000" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#3d3d3d" }],
  },
];
