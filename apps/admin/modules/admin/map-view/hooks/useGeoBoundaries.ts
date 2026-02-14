import { useEffect, useRef, useState, useCallback } from "react";

interface UseGeoBoundariesOptions {
  map: google.maps.Map | null;
  enabled?: boolean;
  onMunicipalityClick?: (municipalityName: string) => void;
}

interface UseGeoBoundariesReturn {
  isLoading: boolean;
  activeLayer: "constituency" | "municipalities" | "wards";
  boundariesEnabled: boolean;
  setBoundariesEnabled: (enabled: boolean) => void;
}

const ZOOM_THRESHOLDS = {
  CONSTITUENCY_MAX: 10,
  MUNICIPALITY_MIN: 11,
  MUNICIPALITY_MAX: 12,
  WARD_MIN: 13,
} as const;

const MUNICIPALITY_COLORS: Record<string, string> = {
  Chumnuwri: "#3b82f6",
  Dharche: "#10b981",
  Gandaki: "#f59e0b",
  Bhimsen: "#ef4444",
  Aarughat: "#8b5cf6",
  Gorkha: "#ec4899",
  "Sahid Lakhan": "#06b6d4",
};

export function useGeoBoundaries({
  map,
  enabled = true,
  onMunicipalityClick,
}: UseGeoBoundariesOptions): UseGeoBoundariesReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [activeLayer, setActiveLayer] = useState<
    "constituency" | "municipalities" | "wards"
  >("municipalities");
  const [boundariesEnabled, setBoundariesEnabled] = useState(enabled);

  const constituencyLayerRef = useRef<google.maps.Data | null>(null);
  const municipalityLayerRef = useRef<google.maps.Data | null>(null);
  const wardLayerRef = useRef<google.maps.Data | null>(null);
  const wardsLoadedRef = useRef(false);
  const wardsLoadingRef = useRef(false);
  const zoomListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const dataLoadedRef = useRef(false);

  const updateVisibility = useCallback(
    (zoom: number) => {
      if (!map || !boundariesEnabled) return;

      const cLayer = constituencyLayerRef.current;
      const mLayer = municipalityLayerRef.current;
      const wLayer = wardLayerRef.current;

      if (zoom <= ZOOM_THRESHOLDS.CONSTITUENCY_MAX) {
        cLayer?.setMap(map);
        mLayer?.setMap(null);
        wLayer?.setMap(null);
        setActiveLayer("constituency");
      } else if (zoom <= ZOOM_THRESHOLDS.MUNICIPALITY_MAX) {
        cLayer?.setMap(null);
        mLayer?.setMap(map);
        wLayer?.setMap(null);
        setActiveLayer("municipalities");
      } else {
        cLayer?.setMap(null);
        mLayer?.setMap(null);
        setActiveLayer("wards");

        if (!wardsLoadedRef.current && !wardsLoadingRef.current && wLayer) {
          wardsLoadingRef.current = true;
          setIsLoading(true);
          fetch("/geojson/gorkha1/wards.geojson")
            .then((r) => r.json())
            .then((geo) => {
              wLayer.addGeoJson(geo);
              wLayer.setMap(map);
              wardsLoadedRef.current = true;
              setIsLoading(false);
            })
            .catch((err) => {
              console.error("Failed to load ward boundaries:", err);
              wardsLoadingRef.current = false;
              setIsLoading(false);
            });
        } else if (wardsLoadedRef.current) {
          wLayer?.setMap(map);
        }
      }
    },
    [map, boundariesEnabled],
  );

  useEffect(() => {
    if (!map) return;

    if (!boundariesEnabled) {
      constituencyLayerRef.current?.setMap(null);
      municipalityLayerRef.current?.setMap(null);
      wardLayerRef.current?.setMap(null);
      zoomListenerRef.current?.remove();
      zoomListenerRef.current = null;
      return;
    }

    // Create data layers
    const cLayer = new google.maps.Data();
    const mLayer = new google.maps.Data();
    const wLayer = new google.maps.Data();

    constituencyLayerRef.current = cLayer;
    municipalityLayerRef.current = mLayer;
    wardLayerRef.current = wLayer;

    // Style: constituency outline
    cLayer.setStyle({
      clickable: false,
      strokeColor: "#1e40af",
      strokeWeight: 3,
      strokeOpacity: 0.9,
      fillColor: "#3b82f6",
      fillOpacity: 0.08,
    });

    // Style: municipalities with per-feature colors
    mLayer.setStyle((feature) => {
      const name = feature.getProperty("NAME") as string;
      const color = MUNICIPALITY_COLORS[name] || "#3b82f6";
      return {
        clickable: false,
        strokeColor: "#1e40af",
        strokeWeight: 2,
        strokeOpacity: 0.8,
        fillColor: color,
        fillOpacity: 0.15,
      };
    });

    // Style: wards with color derived from municipality
    wLayer.setStyle((feature) => {
      const muni = feature.getProperty("MUNICIPALITY") as string;
      const color = MUNICIPALITY_COLORS[muni] || "#6b7280";
      return {
        clickable: false,
        strokeColor: "#6b7280",
        strokeWeight: 1,
        strokeOpacity: 0.7,
        fillColor: color,
        fillOpacity: 0.12,
      };
    });

    // Hover interactions for municipalities
    mLayer.addListener(
      "mouseover",
      (event: google.maps.Data.MouseEvent) => {
        mLayer.overrideStyle(event.feature, {
          strokeWeight: 4,
          fillOpacity: 0.3,
        });
      },
    );
    mLayer.addListener(
      "mouseout",
      () => {
        mLayer.revertStyle();
      },
    );

    // Click handler for municipalities
    if (onMunicipalityClick) {
      mLayer.addListener(
        "click",
        (event: google.maps.Data.MouseEvent) => {
          const name = event.feature.getProperty("NAME") as string;
          if (name) {
            onMunicipalityClick(name);
          }
        },
      );
      // Make municipalities clickable
      mLayer.setStyle((feature) => {
        const name = feature.getProperty("NAME") as string;
        const color = MUNICIPALITY_COLORS[name] || "#3b82f6";
        return {
          clickable: true,
          strokeColor: "#1e40af",
          strokeWeight: 2,
          strokeOpacity: 0.8,
          fillColor: color,
          fillOpacity: 0.15,
          cursor: "pointer",
        };
      });
    }

    // Hover interactions for wards
    wLayer.addListener(
      "mouseover",
      (event: google.maps.Data.MouseEvent) => {
        wLayer.overrideStyle(event.feature, {
          strokeWeight: 2,
          fillOpacity: 0.25,
        });
      },
    );
    wLayer.addListener(
      "mouseout",
      () => {
        wLayer.revertStyle();
      },
    );

    // Fetch constituency + municipalities in parallel
    if (!dataLoadedRef.current) {
      setIsLoading(true);
      Promise.all([
        fetch("/geojson/gorkha1/constituency.geojson").then((r) => r.json()),
        fetch("/geojson/gorkha1/municipalities.geojson").then((r) => r.json()),
      ])
        .then(([cGeo, mGeo]) => {
          cLayer.addGeoJson(cGeo);
          mLayer.addGeoJson(mGeo);
          dataLoadedRef.current = true;
          setIsLoading(false);
          const zoom = map.getZoom();
          if (zoom != null) updateVisibility(zoom);
        })
        .catch((err) => {
          console.error("Failed to load boundary data:", err);
          setIsLoading(false);
        });
    }

    // Zoom change listener
    zoomListenerRef.current = map.addListener("zoom_changed", () => {
      const zoom = map.getZoom();
      if (zoom != null) updateVisibility(zoom);
    });

    return () => {
      zoomListenerRef.current?.remove();
      zoomListenerRef.current = null;
      cLayer.setMap(null);
      mLayer.setMap(null);
      wLayer.setMap(null);
      cLayer.forEach((f) => cLayer.remove(f));
      mLayer.forEach((f) => mLayer.remove(f));
      wLayer.forEach((f) => wLayer.remove(f));
      constituencyLayerRef.current = null;
      municipalityLayerRef.current = null;
      wardLayerRef.current = null;
      dataLoadedRef.current = false;
      wardsLoadedRef.current = false;
      wardsLoadingRef.current = false;
    };
  }, [map, boundariesEnabled, updateVisibility]);

  return { isLoading, activeLayer, boundariesEnabled, setBoundariesEnabled };
}
