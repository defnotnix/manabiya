import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { union } from "@turf/union";
import { polygon, multiPolygon, featureCollection, feature } from "@turf/helpers";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "..", "public", "geojson");
const OUTPUT_DIR = join(PUBLIC_DIR, "gorkha1");

const GORKHA1_MUNICIPALITIES = [
  "Chumnuwri",
  "Dharche",
  "Gandaki",
  "Bhimsen",
  "Aarughat",
  "Gorkha",
  "Sahid Lakhan",
];

// Point-in-polygon ray casting algorithm
function pointInPolygon(point, ring) {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

// Compute centroid of a polygon's outer ring
function centroid(coordinates) {
  // For Polygon: coordinates[0] is outer ring
  // For MultiPolygon: coordinates[i][0] is outer ring of i-th polygon
  let sumX = 0, sumY = 0, count = 0;
  const rings = Array.isArray(coordinates[0][0][0])
    ? coordinates.map((p) => p[0]) // MultiPolygon
    : [coordinates[0]]; // Polygon
  for (const ring of rings) {
    for (const coord of ring) {
      sumX += coord[0];
      sumY += coord[1];
      count++;
    }
  }
  return [sumX / count, sumY / count];
}

// Check if a point is inside a feature (Polygon or MultiPolygon)
function pointInFeature(point, feature) {
  const geom = feature.geometry;
  if (geom.type === "Polygon") {
    return pointInPolygon(point, geom.coordinates[0]);
  }
  if (geom.type === "MultiPolygon") {
    return geom.coordinates.some((poly) => pointInPolygon(point, poly[0]));
  }
  return false;
}

// Convert a GeoJSON feature to a turf feature for union
function toTurfFeature(feat) {
  if (feat.geometry.type === "Polygon") {
    return polygon(feat.geometry.coordinates, feat.properties);
  }
  if (feat.geometry.type === "MultiPolygon") {
    return multiPolygon(feat.geometry.coordinates, feat.properties);
  }
  throw new Error(`Unsupported geometry type: ${feat.geometry.type}`);
}

function main() {
  console.log("Reading municipality data...");
  const muniData = JSON.parse(
    readFileSync(join(PUBLIC_DIR, "nepal-municipalities.geojson"), "utf8")
  );

  // Step 1: Extract Gorkha-1 municipalities
  const gorkha1Munis = muniData.features.filter(
    (f) =>
      f.properties.DISTRICT === "Gorkha" &&
      GORKHA1_MUNICIPALITIES.includes(f.properties.NAME)
  );
  console.log(`Found ${gorkha1Munis.length} Gorkha-1 municipalities:`);
  gorkha1Munis.forEach((f) =>
    console.log(`  - ${f.properties.NAME} (${f.properties.LEVEL})`)
  );

  if (gorkha1Munis.length !== GORKHA1_MUNICIPALITIES.length) {
    const found = gorkha1Munis.map((f) => f.properties.NAME);
    const missing = GORKHA1_MUNICIPALITIES.filter((n) => !found.includes(n));
    console.warn(`WARNING: Missing municipalities: ${missing.join(", ")}`);
  }

  // Step 2: Merge municipalities into constituency outline using turf/union
  console.log("Merging municipality polygons into constituency outline...");
  let merged = toTurfFeature(gorkha1Munis[0]);
  for (let i = 1; i < gorkha1Munis.length; i++) {
    const next = toTurfFeature(gorkha1Munis[i]);
    merged = union(featureCollection([merged, next]));
  }
  merged.properties = { NAME: "Gorkha-1", TYPE: "constituency" };

  // Step 3: Extract wards within Gorkha-1
  console.log("Reading ward data (this may take a moment)...");
  const wardData = JSON.parse(
    readFileSync(join(PUBLIC_DIR, "nepal-wards.geojson"), "utf8")
  );

  const gorkhaWards = wardData.features.filter(
    (f) => f.properties.DISTRICT === "Gorkha"
  );
  console.log(`Found ${gorkhaWards.length} total Gorkha district wards`);

  // For each ward, determine which Gorkha-1 municipality it belongs to
  const gorkha1Wards = [];
  for (const ward of gorkhaWards) {
    const wardCentroid = centroid(ward.geometry.coordinates);
    for (const muni of gorkha1Munis) {
      if (pointInFeature(wardCentroid, muni)) {
        ward.properties.MUNICIPALITY = muni.properties.NAME;
        gorkha1Wards.push(ward);
        break;
      }
    }
  }
  console.log(
    `${gorkha1Wards.length} wards fall within Gorkha-1 municipalities`
  );

  // Group wards by municipality for logging
  const byMuni = {};
  for (const w of gorkha1Wards) {
    const m = w.properties.MUNICIPALITY;
    byMuni[m] = (byMuni[m] || 0) + 1;
  }
  for (const [muni, count] of Object.entries(byMuni)) {
    console.log(`  - ${muni}: ${count} wards`);
  }

  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Write output files
  const constituencyGeo = featureCollection([merged]);
  const municipalitiesGeo = { type: "FeatureCollection", features: gorkha1Munis };
  const wardsGeo = { type: "FeatureCollection", features: gorkha1Wards };

  const constituencyPath = join(OUTPUT_DIR, "constituency.geojson");
  const municipalitiesPath = join(OUTPUT_DIR, "municipalities.geojson");
  const wardsPath = join(OUTPUT_DIR, "wards.geojson");

  writeFileSync(constituencyPath, JSON.stringify(constituencyGeo));
  writeFileSync(municipalitiesPath, JSON.stringify(municipalitiesGeo));
  writeFileSync(wardsPath, JSON.stringify(wardsGeo));

  console.log("\nGenerated files:");
  console.log(
    `  constituency.geojson: ${(readFileSync(constituencyPath).length / 1024).toFixed(1)} KB`
  );
  console.log(
    `  municipalities.geojson: ${(readFileSync(municipalitiesPath).length / 1024).toFixed(1)} KB`
  );
  console.log(
    `  wards.geojson: ${(readFileSync(wardsPath).length / 1024).toFixed(1)} KB`
  );
  console.log("\nDone!");
}

main();
