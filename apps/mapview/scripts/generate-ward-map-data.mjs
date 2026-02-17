/**
 * Generates ward map SVG data from SVG files in assets/map-svg/.
 * Run: node apps/mapview/scripts/generate-ward-map-data.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const svgDir = path.join(__dirname, "../assets/map-svg");

const MUNICIPALITY_SVG_MAP = {
  "Aarughat Gaupalika": 110,
  "Gandaki Gaupalika": 121,
  "Gorkha Nagarpalika": 130,
  "Chum Nubri Gaupalika": 145,
  "Dharche Gaupalika": 153,
  "Bhimsen Gaupalika": 161,
  "Sahid Lakhan Gaupalika": 170,
};

const data = {};

for (const [filename, id] of Object.entries(MUNICIPALITY_SVG_MAP)) {
  const svgPath = path.join(svgDir, `${filename}.svg`);
  const content = fs.readFileSync(svgPath, "utf8");

  // Extract viewBox
  const viewBoxMatch = content.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 100 100";

  // Extract all path d attributes
  const paths = [];
  const pathRegex = /\bd="([^"]+)"/g;
  let match;
  while ((match = pathRegex.exec(content)) !== null) {
    paths.push(match[1]);
  }

  data[id] = { viewBox, paths };
  console.log(`  ${filename} (ID: ${id}): ${paths.length} wards`);
}

// Generate TypeScript output
const lines = [
  "// Auto-generated from SVG files in assets/map-svg/",
  "// Regenerate with: node apps/mapview/scripts/generate-ward-map-data.mjs",
  "",
  "export interface WardSvgData {",
  "  viewBox: string;",
  "  paths: string[];",
  "}",
  "",
  "export const WARD_MAP_DATA: Record<number, WardSvgData> = {",
];

for (const [id, { viewBox, paths }] of Object.entries(data)) {
  lines.push(`  ${id}: {`);
  lines.push(`    viewBox: "${viewBox}",`);
  lines.push(`    paths: [`);
  for (const p of paths) {
    lines.push(`      "${p}",`);
  }
  lines.push(`    ],`);
  lines.push(`  },`);
}

lines.push("};");
lines.push("");

const outPath = path.join(
  __dirname,
  "../modules/map-view/data/wardMapData.ts",
);
fs.writeFileSync(outPath, lines.join("\n"), "utf8");
console.log(`\nGenerated: ${outPath}`);
