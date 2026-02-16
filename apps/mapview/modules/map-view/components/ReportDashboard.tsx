"use client";

import {
  Stack,
  SimpleGrid,
  Text,
  Paper,
  Title,
  Divider,
  Group,
  Badge,
  ColorSwatch,
  useMantineTheme,
} from "@mantine/core";
import { PieChart, DonutChart } from "@mantine/charts";
import { StatCard } from "./StatCard";
import {
  UsersIcon,
  GenderMaleIcon,
  GenderFemaleIcon,
  IdentificationCardIcon,
  PhoneIcon,
  ChurchIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";
import { ThemeIcon } from "@mantine/core";

function resolveColor(color: string, theme: any): string {
  // Handle Mantine color tokens like "cyan.6", "blue.5"
  if (color.includes(".")) {
    const [name, shade] = color.split(".");
    const palette = theme.colors?.[name];
    if (palette) return palette[parseInt(shade)] || color;
  }
  return color;
}

function ChartLegend({
  data,
}: {
  data: { name: string; value: number; color: string }[];
}) {
  const theme = useMantineTheme();
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <Stack gap={4} mt="sm">
      {data.map((item) => (
        <Group key={item.name} gap="xs" wrap="nowrap">
          <ColorSwatch
            color={resolveColor(item.color, theme)}
            size={12}
            withShadow={false}
          />
          <Text size="xs" c="dimmed" style={{ flex: 1 }} lineClamp={1}>
            {item.name}
          </Text>
          <Text size="xs" fw={500}>
            {item.value.toLocaleString()}
          </Text>
          <Text size="xs" c="dimmed" w={45} ta="right">
            {total > 0 ? `${((item.value / total) * 100).toFixed(1)}%` : "0%"}
          </Text>
        </Group>
      ))}
    </Stack>
  );
}

type ReportLevel =
  | "dashboard"
  | "district"
  | "municipality"
  | "ward"
  | "booth"
  | "religion-levels";

interface ReportDashboardProps {
  data: any;
  reportType: ReportLevel;
  showMunicipalitySelection?: boolean;
  onMunicipalityClick?: (name: string) => void;
}

export function ReportDashboard({
  data,
  reportType,
  showMunicipalitySelection,
  onMunicipalityClick,
}: ReportDashboardProps) {
  if (!data) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        No data available
      </Text>
    );
  }

  // Handle dashboard summary differently
  if (reportType === "dashboard") {
    return (
      <DashboardSummaryView
        data={data}
        showSelection={showMunicipalitySelection}
        onSelect={onMunicipalityClick}
      />
    );
  }

  // For booth, ward, municipality, district reports
  return <LocationReportView data={data} reportType={reportType} />;
}

function LocationReportView({
  data,
  reportType,
}: {
  data: any;
  reportType: string;
}) {
  // Handle both paginated list responses and single object responses
  // API returns { success, results: [...] } for lists or { success, pagination, results } for paginated
  // Or direct object for by-* retrieve endpoints
  console.log("Report data received:", data);

  let reportData = data;

  // If data has results array, take the first item
  if (data.results && Array.isArray(data.results) && data.results.length > 0) {
    reportData = data.results[0];
    console.log("Using first result from array:", reportData);
  }

  const {
    total_voters_count = 0,
    total_voters_male_count = 0,
    total_voters_female_count = 0,
    total_voters_married_count = 0,
    total_voters_unmarried_count = 0,
    unique_castes_count = 0,
    polling_stations_count = 0,
    phone_filled_count = 0,
    religion_counts = {},
    caste_counts = {},
    total_voters_10_20_age = 0,
    total_voters_20_30_age = 0,
    total_voters_30_40_age = 0,
    total_voters_40_50_age = 0,
    total_voters_50_60_age = 0,
    total_voters_60_plus_age = 0,
    computed_metrics = {},
  } = reportData;

  const {
    female_ratio = 0,
    phone_coverage_total = 0,
    dominant_religion = "N/A",
    dominant_religion_share = 0,
  } = computed_metrics;

  console.log("Extracted values:", {
    total_voters_count,
    total_voters_male_count,
    total_voters_female_count,
    female_ratio,
  });

  // Prepare gender data
  const genderData = [
    { name: "Male", value: total_voters_male_count, color: "#3b82f6" },
    { name: "Female", value: total_voters_female_count, color: "#ec4899" },
  ];

  // Prepare age group data
  const ageColors = [
    "cyan.6",
    "blue.6",
    "indigo.6",
    "teal.6",
    "green.6",
    "gray.6",
  ];
  const ageData = [
    { name: "10-20", value: total_voters_10_20_age, color: ageColors[0] },
    { name: "20-30", value: total_voters_20_30_age, color: ageColors[1] },
    { name: "30-40", value: total_voters_30_40_age, color: ageColors[2] },
    { name: "40-50", value: total_voters_40_50_age, color: ageColors[3] },
    { name: "50-60", value: total_voters_50_60_age, color: ageColors[4] },
    { name: "60+", value: total_voters_60_plus_age, color: ageColors[5] },
  ].filter((d) => d.value > 0);

  // Prepare marital status data
  const maritalData = [
    { name: "Married", value: total_voters_married_count, color: "#10b981" },
    {
      name: "Unmarried",
      value: total_voters_unmarried_count,
      color: "#6b7280",
    },
  ];

  // Prepare religion data (top 10)
  const religionColors = [
    "orange.6",
    "yellow.6",
    "red.6",
    "pink.6",
    "grape.6",
    "violet.5",
    "indigo.5",
    "teal.5",
    "lime.6",
    "gray.5",
  ];
  const religionData = Object.entries(religion_counts)
    .map(([religion, count], idx) => ({
      name: religion,
      value: count as number,
      color: religionColors[idx % religionColors.length],
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Prepare caste data (top 10)
  const casteColors = [
    "violet.6",
    "grape.6",
    "indigo.6",
    "blue.5",
    "cyan.5",
    "teal.5",
    "green.5",
    "lime.5",
    "yellow.5",
    "orange.5",
  ];
  const casteData = Object.entries(caste_counts)
    .map(([caste, count], idx) => ({
      name: caste,
      value: count as number,
      color: casteColors[idx % casteColors.length],
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  return (
    <Stack gap="lg">
      {/* Key Metrics */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
        <StatCard
          title="Total Voters"
          value={total_voters_count.toLocaleString()}
          icon={UsersIcon}
          color="blue"
          subtitle={`${total_voters_male_count.toLocaleString()} male, ${total_voters_female_count.toLocaleString()} female`}
        />
        <StatCard
          title="Female Ratio"
          value={`${(female_ratio * 100).toFixed(1)}%`}
          icon={GenderFemaleIcon}
          color="pink"
        />
        <StatCard
          title="Unique Castes"
          value={unique_castes_count}
          icon={IdentificationCardIcon}
          color="violet"
        />
        {polling_stations_count > 0 && (
          <StatCard
            title="Polling Stations"
            value={polling_stations_count}
            icon={IdentificationCardIcon}
            color="teal"
          />
        )}
        <StatCard
          title="Phone Coverage"
          value={`${(phone_coverage_total * 100).toFixed(1)}%`}
          icon={PhoneIcon}
          color="cyan"
          subtitle={`${phone_filled_count.toLocaleString()} filled`}
        />
        <StatCard
          title="Dominant Religion"
          value={dominant_religion}
          icon={ChurchIcon}
          color="orange"
          subtitle={`${(dominant_religion_share * 100).toFixed(1)}% of voters`}
        />
      </SimpleGrid>

      <Divider />

      {/* Demographics Section */}
      <div>
        <Title order={4} mb="md">
          Demographics
        </Title>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          {/* Gender Distribution */}
          <Paper withBorder p="md" radius="md">
            <Text fw={600} size="sm" mb="md">
              Gender Distribution
            </Text>
            {total_voters_count > 0 ? (
              <>
                <PieChart
                  data={genderData}
                  withTooltip
                  tooltipDataSource="segment"
                  size={160}
                  mx="auto"
                />
                <ChartLegend data={genderData} />
              </>
            ) : (
              <Text c="dimmed" ta="center" py="md">
                No data
              </Text>
            )}
          </Paper>

          {/* Marital Status */}
          <Paper withBorder p="md" radius="md">
            <Text fw={600} size="sm" mb="md">
              Marital Status
            </Text>
            {total_voters_married_count + total_voters_unmarried_count > 0 ? (
              <>
                <DonutChart
                  data={maritalData}
                  chartLabel={`${total_voters_married_count + total_voters_unmarried_count}`}
                  size={160}
                  thickness={30}
                  mx="auto"
                  tooltipDataSource="segment"
                />
                <ChartLegend data={maritalData} />
              </>
            ) : (
              <Text c="dimmed" ta="center" py="md">
                No data
              </Text>
            )}
          </Paper>
        </SimpleGrid>
      </div>

      {/* Age Groups */}
      {ageData.length > 0 && (
        <Paper withBorder p="md" radius="md">
          <Text fw={600} size="sm" mb="md">
            Age Group Distribution
          </Text>
          <PieChart
            data={ageData}
            withTooltip
            tooltipDataSource="segment"
            size={160}
            mx="auto"
          />
          <ChartLegend data={ageData} />
        </Paper>
      )}

      {/* Religion Distribution */}
      {religionData.length > 0 && (
        <Paper withBorder p="md" radius="md">
          <Text fw={600} size="sm" mb="md">
            Religion Distribution (Top 10)
          </Text>
          <PieChart
            data={religionData}
            withTooltip
            tooltipDataSource="segment"
            size={160}
            mx="auto"
          />
          <ChartLegend data={religionData} />
        </Paper>
      )}

      {/* Caste Distribution */}
      {casteData.length > 0 && (
        <Paper withBorder p="md" radius="md">
          <Text fw={600} size="sm" mb="md">
            Caste Distribution (Top 10)
          </Text>
          <PieChart
            data={casteData}
            withTooltip
            tooltipDataSource="segment"
            size={160}
            mx="auto"
          />
          <ChartLegend data={casteData} />
        </Paper>
      )}
    </Stack>
  );
}

const religionPieColors = [
  "orange.6",
  "yellow.6",
  "red.6",
  "pink.6",
  "grape.6",
  "violet.5",
  "indigo.5",
  "teal.5",
  "lime.6",
  "gray.5",
];

function DashboardSummaryView({
  data,
  showSelection,
  onSelect,
}: {
  data: any;
  showSelection?: boolean;
  onSelect?: (name: string) => void;
}) {
  console.log("Dashboard Summary data received:", data);

  const {
    district_summary = [],
    municipality_summary = [],
    top_religions = {},
  } = data;

  console.log("Extracted dashboard data:", {
    district_summary,
    municipality_summary,
    top_religions,
  });

  if (showSelection && municipality_summary.length > 0) {
    return (
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={5}>Select Municipality</Title>
          <Badge variant="light" color="teal">
            {municipality_summary.length} Options
          </Badge>
        </Group>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
          {municipality_summary.map((municipality: any, idx: number) => (
            <Paper
              key={idx}
              withBorder
              p="sm"
              radius="md"
              style={{ cursor: "pointer", transition: "all 0.2s" }}
              onClick={() =>
                onSelect?.(
                  municipality.municipality_name || municipality.name || "",
                )
              }
            >
              <Group justify="space-between" align="center">
                <Stack gap={2}>
                  <Text fw={600} size="sm">
                    {municipality.municipality_name ||
                      municipality.name ||
                      "Unknown Municipality"}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {municipality.total_voters_count?.toLocaleString() || 0}{" "}
                    voters
                  </Text>
                </Stack>
                <ThemeIcon variant="light" color="blue" radius="xl">
                  <CaretRightIcon size={16} />
                </ThemeIcon>
              </Group>
            </Paper>
          ))}
        </SimpleGrid>
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      {/* District Summary */}
      {district_summary.length > 0 && (
        <div>
          <Group justify="space-between" mb="md">
            <Title order={4}>Current District Summary</Title>
            <Badge variant="light" color="blue">
              {district_summary.length} district(s)
            </Badge>
          </Group>
          <SimpleGrid cols={{ base: 1, md: 1 }} spacing="md">
            {district_summary.map((district: any, idx: number) => (
              <Paper key={idx} withBorder p="md" radius="md">
                <Stack gap="xs">
                  <StatCard
                    title="Total Voters"
                    value={district.total_voters_count?.toLocaleString() || 0}
                    icon={UsersIcon}
                    color="blue"
                  />
                  <SimpleGrid cols={2} spacing="xs">
                    <StatCard
                      title="Male"
                      value={
                        district.total_voters_male_count?.toLocaleString() || 0
                      }
                      icon={GenderMaleIcon}
                      color="blue"
                    />
                    <StatCard
                      title="Female"
                      value={
                        district.total_voters_female_count?.toLocaleString() ||
                        0
                      }
                      icon={GenderFemaleIcon}
                      color="pink"
                    />
                  </SimpleGrid>
                  <StatCard
                    title="Unique Castes"
                    value={district.unique_castes_count || 0}
                    icon={IdentificationCardIcon}
                    color="violet"
                  />
                </Stack>
              </Paper>
            ))}
          </SimpleGrid>
        </div>
      )}

      {/* Municipality Summary */}
      {municipality_summary.length > 0 && (
        <div>
          <Group justify="space-between" mb="md">
            <Title order={4}>Municipality Summary</Title>
            <Badge variant="light" color="teal">
              {municipality_summary.length} municipalit(y/ies)
            </Badge>
          </Group>
          <SimpleGrid cols={{ base: 1, md: 1 }} spacing="md">
            {municipality_summary.map((municipality: any, idx: number) => (
              <Paper key={idx} withBorder p="md" radius="md">
                <Stack gap="xs">
                  <StatCard
                    title="Total Voters"
                    value={
                      municipality.total_voters_count?.toLocaleString() || 0
                    }
                    icon={UsersIcon}
                    color="teal"
                  />
                  <SimpleGrid cols={2} spacing="xs">
                    <StatCard
                      title="Male"
                      value={
                        municipality.total_voters_male_count?.toLocaleString() ||
                        0
                      }
                      icon={GenderMaleIcon}
                      color="blue"
                    />
                    <StatCard
                      title="Female"
                      value={
                        municipality.total_voters_female_count?.toLocaleString() ||
                        0
                      }
                      icon={GenderFemaleIcon}
                      color="pink"
                    />
                  </SimpleGrid>
                  <StatCard
                    title="Unique Castes"
                    value={municipality.unique_castes_count || 0}
                    icon={IdentificationCardIcon}
                    color="violet"
                  />
                  {municipality.computed_metrics?.dominant_religion && (
                    <StatCard
                      title="Dominant Religion"
                      value={municipality.computed_metrics.dominant_religion}
                      icon={ChurchIcon}
                      color="orange"
                    />
                  )}
                </Stack>
              </Paper>
            ))}
          </SimpleGrid>
        </div>
      )}

      {/* Top Religions Comparison */}
      {Object.keys(top_religions).length > 0 && (
        <div>
          <Title order={4} mb="md">
            Top Religions Comparison
          </Title>
          <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="md">
            {Object.entries(top_religions).map(
              ([scope, religions]: [string, any]) => {
                if (!Array.isArray(religions) || religions.length === 0)
                  return null;

                return (
                  <Paper key={scope} withBorder p="md" radius="md">
                    <Text fw={600} size="sm" mb="md" tt="capitalize">
                      {scope} Level
                    </Text>
                    {(() => {
                      const chartData = religions.map((r: any, i: number) => ({
                        name: r.religion,
                        value: parseFloat(r.percentage),
                        color: religionPieColors[i % religionPieColors.length],
                      }));
                      return (
                        <>
                          <PieChart
                            data={chartData}
                            withTooltip
                            tooltipDataSource="segment"
                            size={150}
                            mx="auto"
                          />
                          <ChartLegend data={chartData} />
                        </>
                      );
                    })()}
                  </Paper>
                );
              },
            )}
          </SimpleGrid>
        </div>
      )}
    </Stack>
  );
}
