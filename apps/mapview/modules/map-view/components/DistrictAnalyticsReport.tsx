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
  Table,
  Progress,
  ThemeIcon,
  Box,
  useMantineTheme,
  ColorSwatch,
} from "@mantine/core";
import { BarChart, PieChart, DonutChart } from "@mantine/charts";
import {
  UsersIcon,
  GenderMaleIcon,
  GenderFemaleIcon,
  TrophyIcon,
  ChurchIcon,
  BuildingsIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@phosphor-icons/react";

interface MunicipalitySummary {
  municipality_id: number;
  district_id: number;
  province_id: number;
  total_voters_count: number;
  total_voters_male_count: number;
  total_voters_female_count: number;
  unique_castes_count: number;
  municipality_name_ne?: string;
  municipality_name_en?: string;
  computed_metrics: {
    male_ratio: number;
    female_ratio: number;
    married_ratio: number;
    dominant_religion: string;
    unique_castes_count: number;
    phone_coverage_total: number;
    phone_coverage_extras: number;
    dominant_religion_share: number;
    avg_voters_per_polling_station: number;
  };
}

interface DistrictSummary {
  district_id: number;
  province_id: number;
  total_voters_count: number;
  total_voters_male_count: number;
  total_voters_female_count: number;
  unique_castes_count: number;
  district_name_ne?: string;
  district_name_en?: string;
  computed_metrics: {
    male_ratio: number;
    female_ratio: number;
    married_ratio: number;
    dominant_religion: string;
    unique_castes_count: number;
    phone_coverage_total: number;
    phone_coverage_extras: number;
    dominant_religion_share: number;
    avg_voters_per_polling_station: number;
  };
}

interface ReligionData {
  religion: string;
  count: number;
  total_voters: number;
  percentage: number;
}

interface DistrictAnalyticsData {
  success: boolean;
  filters: {
    district: number;
    municipality: number | null;
    top_n: number;
  };
  district_summary: DistrictSummary[];
  municipality_summary: MunicipalitySummary[];
  top_religions: {
    national: ReligionData[];
    district: ReligionData[];
    municipality: ReligionData[];
  };
}

interface GeoUnit {
  id: number;
  unit_type: string;
  display_name: string;
  display_name_ne?: string;
  display_name_en?: string;
}

interface DistrictAnalyticsReportProps {
  data: DistrictAnalyticsData;
  municipalities?: GeoUnit[];
  municipalityNames?: Record<number, string>;
}

function resolveColor(color: string, theme: any): string {
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

const COLORS = [
  "blue.6",
  "teal.6",
  "violet.6",
  "orange.6",
  "pink.6",
  "cyan.6",
  "green.6",
  "red.6",
  "indigo.6",
  "yellow.6",
];

const RELIGION_COLORS = [
  "orange.6",
  "yellow.6",
  "red.6",
  "pink.6",
  "grape.6",
  "violet.5",
  "indigo.5",
  "teal.5",
];

export function DistrictAnalyticsReport({
  data,
  municipalities = [],
  municipalityNames = {},
}: DistrictAnalyticsReportProps) {
  const theme = useMantineTheme();

  if (!data || !data.success) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        No analytics data available
      </Text>
    );
  }

  const { district_summary, municipality_summary, top_religions } = data;
  const district = district_summary[0];

  // Sort municipalities by voter count (descending)
  const rankedMunicipalities = [...municipality_summary].sort(
    (a, b) => b.total_voters_count - a.total_voters_count
  );

  // Build name lookup from municipality_summary data (which contains municipality_name_ne/en)
  // and fallback to municipalities prop if needed
  const muniNameLookup: Record<number, string> = { ...municipalityNames };

  // First, populate from municipality_summary (API response includes names directly)
  municipality_summary.forEach((m: any) => {
    const name = m.municipality_name_ne && m.municipality_name_en
      ? `${m.municipality_name_ne} (${m.municipality_name_en})`
      : m.municipality_name_ne || m.municipality_name_en;
    if (name) muniNameLookup[m.municipality_id] = name;
  });

  // Then add from municipalities prop as fallback
  municipalities.forEach((m) => {
    if (!muniNameLookup[m.id]) {
      const name = m.display_name_ne && m.display_name_en
        ? `${m.display_name_ne} (${m.display_name_en})`
        : m.display_name || m.display_name_ne || m.display_name_en;
      if (name) muniNameLookup[m.id] = name;
    }
  });

  // Get municipality name helper
  const getMuniName = (id: number) =>
    muniNameLookup[id] || `Municipality ${id}`;

  // Get district name
  const districtName = district?.district_name_ne && district?.district_name_en
    ? `${district.district_name_ne} (${district.district_name_en})`
    : district?.district_name_ne || district?.district_name_en || `District ${district?.district_id}`;

  // Prepare pie chart data for voter distribution by municipality
  const voterPieData = rankedMunicipalities.map((m, idx) => ({
    name: getMuniName(m.municipality_id),
    value: m.total_voters_count,
    color: COLORS[idx % COLORS.length],
  }));

  // Prepare donut chart data for overall gender distribution
  const totalMale = rankedMunicipalities.reduce((sum, m) => sum + m.total_voters_male_count, 0);
  const totalFemale = rankedMunicipalities.reduce((sum, m) => sum + m.total_voters_female_count, 0);
  const genderPieData = [
    { name: "Male", value: totalMale, color: "blue.6" },
    { name: "Female", value: totalFemale, color: "pink.6" },
  ];

  // Prepare religion pie chart data
  const religionPieData = (top_religions.district || []).map((r, idx) => ({
    name: r.religion,
    value: r.count,
    color: RELIGION_COLORS[idx % RELIGION_COLORS.length],
  }));

  // Prepare caste diversity pie data (by municipality)
  const castePieData = rankedMunicipalities.map((m, idx) => ({
    name: getMuniName(m.municipality_id),
    value: m.unique_castes_count,
    color: COLORS[idx % COLORS.length],
  }));

  // Prepare married ratio pie data
  const avgMarriedRatio = rankedMunicipalities.reduce((sum, m) => sum + m.computed_metrics.married_ratio, 0) / rankedMunicipalities.length;
  const marriedPieData = [
    { name: "Married", value: Math.round(avgMarriedRatio * 100), color: "green.6" },
    { name: "Unmarried", value: Math.round((1 - avgMarriedRatio) * 100), color: "gray.5" },
  ];

  // Calculate max values for progress bars
  const maxVoters = Math.max(...rankedMunicipalities.map((m) => m.total_voters_count));
  const maxCastes = Math.max(...rankedMunicipalities.map((m) => m.unique_castes_count));

  return (
    <Stack gap="xl">
      {/* District Overview Header */}
      <Paper withBorder p="lg" radius="md" bg="blue.0">
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Group gap="sm">
              <ThemeIcon size="lg" radius="md" variant="filled" color="blue">
                <BuildingsIcon size={20} weight="duotone" />
              </ThemeIcon>
              <Title order={3}>{districtName} Overview</Title>
            </Group>
            <Text size="sm" c="dimmed">
              Comprehensive analytics across {municipality_summary.length} municipalities
            </Text>
          </Stack>
          <Badge size="lg" variant="light" color="blue">
            {district?.total_voters_count.toLocaleString()} Total Voters
          </Badge>
        </Group>
      </Paper>

      {/* Key District Metrics */}
      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
        <Paper withBorder p="md" radius="md">
          <Group gap="sm">
            <ThemeIcon size="lg" variant="light" color="blue">
              <UsersIcon size={18} weight="duotone" />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="xl" fw={700}>
                {district?.total_voters_count.toLocaleString()}
              </Text>
              <Text size="xs" c="dimmed">
                Total Voters
              </Text>
            </Stack>
          </Group>
        </Paper>

        <Paper withBorder p="md" radius="md">
          <Group gap="sm">
            <ThemeIcon size="lg" variant="light" color="pink">
              <GenderFemaleIcon size={18} weight="duotone" />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="xl" fw={700}>
                {((district?.computed_metrics.female_ratio || 0) * 100).toFixed(1)}%
              </Text>
              <Text size="xs" c="dimmed">
                Female Ratio
              </Text>
            </Stack>
          </Group>
        </Paper>

        <Paper withBorder p="md" radius="md">
          <Group gap="sm">
            <ThemeIcon size="lg" variant="light" color="violet">
              <ChartBarIcon size={18} weight="duotone" />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="xl" fw={700}>
                {district?.unique_castes_count.toLocaleString()}
              </Text>
              <Text size="xs" c="dimmed">
                Unique Castes
              </Text>
            </Stack>
          </Group>
        </Paper>

        <Paper withBorder p="md" radius="md">
          <Group gap="sm">
            <ThemeIcon size="lg" variant="light" color="orange">
              <ChurchIcon size={18} weight="duotone" />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="xl" fw={700}>
                {district?.computed_metrics.dominant_religion}
              </Text>
              <Text size="xs" c="dimmed">
                {((district?.computed_metrics.dominant_religion_share || 0) * 100).toFixed(1)}% share
              </Text>
            </Stack>
          </Group>
        </Paper>
      </SimpleGrid>

      <Divider />

      {/* Municipality Rankings */}
      <div>
        <Group justify="space-between" mb="md">
          <Group gap="sm">
            <ThemeIcon size="lg" variant="light" color="yellow">
              <TrophyIcon size={18} weight="duotone" />
            </ThemeIcon>
            <Title order={4}>Municipality Rankings</Title>
          </Group>
          <Badge variant="light" color="gray">
            By Voter Count
          </Badge>
        </Group>

        <Paper withBorder radius="md" style={{ overflow: "hidden" }}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={50}>Rank</Table.Th>
                <Table.Th>Municipality</Table.Th>
                <Table.Th ta="right">Voters</Table.Th>
                <Table.Th ta="center">Gender Split</Table.Th>
                <Table.Th ta="right">Castes</Table.Th>
                <Table.Th>Distribution</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rankedMunicipalities.map((m, idx) => (
                <Table.Tr key={m.municipality_id}>
                  <Table.Td>
                    <Badge
                      size="lg"
                      variant={idx < 3 ? "filled" : "light"}
                      color={
                        idx === 0
                          ? "yellow"
                          : idx === 1
                          ? "gray"
                          : idx === 2
                          ? "orange"
                          : "blue"
                      }
                      circle
                    >
                      {idx + 1}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Stack gap={0}>
                      <Text size="sm" fw={600}>
                        {getMuniName(m.municipality_id)}
                      </Text>
                      <Text size="xs" c="dimmed">
                        ID: {m.municipality_id}
                      </Text>
                    </Stack>
                  </Table.Td>
                  <Table.Td ta="right">
                    <Text size="sm" fw={600}>
                      {m.total_voters_count.toLocaleString()}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4} justify="center">
                      <Group gap={2}>
                        <GenderMaleIcon size={12} color="#228be6" />
                        <Text size="xs">{(m.computed_metrics.male_ratio * 100).toFixed(0)}%</Text>
                      </Group>
                      <Text size="xs" c="dimmed">/</Text>
                      <Group gap={2}>
                        <GenderFemaleIcon size={12} color="#e64980" />
                        <Text size="xs">{(m.computed_metrics.female_ratio * 100).toFixed(0)}%</Text>
                      </Group>
                    </Group>
                  </Table.Td>
                  <Table.Td ta="right">
                    <Text size="sm">{m.unique_castes_count}</Text>
                  </Table.Td>
                  <Table.Td w={150}>
                    <Progress.Root size="lg">
                      <Progress.Section
                        value={(m.total_voters_count / maxVoters) * 100}
                        color="blue"
                      />
                    </Progress.Root>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      </div>

      <Divider />

      {/* Voter Distribution Pie Charts */}
      <div>
        <Title order={4} mb="md">
          Voter Distribution Overview
        </Title>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          {/* Voter Distribution by Municipality */}
          <Paper withBorder p="md" radius="md">
            <Text fw={600} size="sm" mb="md">
              Voters by Municipality
            </Text>
            <DonutChart
              data={voterPieData}
              chartLabel={`${district?.total_voters_count.toLocaleString()}`}
              withTooltip
              tooltipDataSource="segment"
              size={180}
              thickness={30}
              mx="auto"
            />
            <ChartLegend data={voterPieData} />
          </Paper>

          {/* Gender Distribution */}
          <Paper withBorder p="md" radius="md">
            <Text fw={600} size="sm" mb="md">
              Gender Distribution (District)
            </Text>
            <PieChart
              data={genderPieData}
              withTooltip
              tooltipDataSource="segment"
              size={180}
              mx="auto"
            />
            <ChartLegend data={genderPieData} />
          </Paper>
        </SimpleGrid>
      </div>

      {/* Demographics Comparison */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        {/* Marital Status Distribution */}
        <Paper withBorder p="md" radius="md">
          <Text fw={600} size="sm" mb="md">
            Marital Status (Avg)
          </Text>
          <DonutChart
            data={marriedPieData}
            chartLabel={`${Math.round(avgMarriedRatio * 100)}%`}
            withTooltip
            tooltipDataSource="segment"
            size={160}
            thickness={25}
            mx="auto"
          />
          <ChartLegend data={marriedPieData} />
        </Paper>

        {/* Caste Diversity by Municipality */}
        <Paper withBorder p="md" radius="md">
          <Text fw={600} size="sm" mb="md">
            Caste Diversity by Municipality
          </Text>
          <PieChart
            data={castePieData}
            withTooltip
            tooltipDataSource="segment"
            size={160}
            mx="auto"
          />
          <ChartLegend data={castePieData} />
        </Paper>
      </SimpleGrid>

      {/* Religion Distribution */}
      {religionPieData.length > 0 && (
        <div>
          <Title order={4} mb="md">
            Religion Distribution (District Level)
          </Title>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            <Paper withBorder p="md" radius="md">
              <Text fw={600} size="sm" mb="md">
                Religious Composition
              </Text>
              <PieChart
                data={religionPieData}
                withTooltip
                tooltipDataSource="segment"
                size={180}
                mx="auto"
              />
              <ChartLegend data={religionPieData} />
            </Paper>

            <Paper withBorder p="md" radius="md">
              <Text fw={600} size="sm" mb="md">
                Religion Statistics
              </Text>
              <Stack gap="sm">
                {(top_religions.district || []).map((r, idx) => (
                  <Box key={r.religion}>
                    <Group justify="space-between" mb={4}>
                      <Text size="sm">{r.religion}</Text>
                      <Group gap="xs">
                        <Text size="sm" fw={600}>
                          {r.count.toLocaleString()}
                        </Text>
                        <Badge size="sm" variant="light" color={RELIGION_COLORS[idx]?.split(".")[0] || "gray"}>
                          {r.percentage.toFixed(1)}%
                        </Badge>
                      </Group>
                    </Group>
                    <Progress
                      value={r.percentage}
                      color={RELIGION_COLORS[idx]?.split(".")[0] || "gray"}
                      size="md"
                    />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </SimpleGrid>
        </div>
      )}

      <Divider />

      {/* Municipality Comparison Cards */}
      <div>
        <Title order={4} mb="md">
          Municipality Insights
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {rankedMunicipalities.slice(0, 6).map((m, idx) => (
            <Paper key={m.municipality_id} withBorder p="md" radius="md">
              <Group justify="space-between" mb="sm">
                <Badge
                  size="lg"
                  variant={idx < 3 ? "filled" : "light"}
                  color={
                    idx === 0
                      ? "yellow"
                      : idx === 1
                      ? "gray"
                      : idx === 2
                      ? "orange"
                      : "blue"
                  }
                >
                  #{idx + 1}
                </Badge>
                <Text size="xs" c="dimmed">
                  ID: {m.municipality_id}
                </Text>
              </Group>

              <Text fw={600} mb="xs">
                {getMuniName(m.municipality_id)}
              </Text>

              <SimpleGrid cols={2} spacing="xs">
                <Stack gap={2}>
                  <Text size="xs" c="dimmed">
                    Total Voters
                  </Text>
                  <Text size="sm" fw={600}>
                    {m.total_voters_count.toLocaleString()}
                  </Text>
                </Stack>

                <Stack gap={2}>
                  <Text size="xs" c="dimmed">
                    Unique Castes
                  </Text>
                  <Text size="sm" fw={600}>
                    {m.unique_castes_count}
                  </Text>
                </Stack>

                <Stack gap={2}>
                  <Text size="xs" c="dimmed">
                    Dominant Religion
                  </Text>
                  <Text size="sm" fw={600}>
                    {m.computed_metrics.dominant_religion}
                  </Text>
                </Stack>

                <Stack gap={2}>
                  <Text size="xs" c="dimmed">
                    Married Ratio
                  </Text>
                  <Text size="sm" fw={600}>
                    {(m.computed_metrics.married_ratio * 100).toFixed(1)}%
                  </Text>
                </Stack>
              </SimpleGrid>

              {/* Gender distribution mini bar */}
              <Box mt="sm">
                <Progress.Root size="lg">
                  <Progress.Section
                    value={m.computed_metrics.male_ratio * 100}
                    color="blue"
                    title="Male"
                  />
                  <Progress.Section
                    value={m.computed_metrics.female_ratio * 100}
                    color="pink"
                    title="Female"
                  />
                </Progress.Root>
                <Group justify="space-between" mt={4}>
                  <Text size="xs" c="blue">
                    Male {(m.computed_metrics.male_ratio * 100).toFixed(0)}%
                  </Text>
                  <Text size="xs" c="pink">
                    Female {(m.computed_metrics.female_ratio * 100).toFixed(0)}%
                  </Text>
                </Group>
              </Box>
            </Paper>
          ))}
        </SimpleGrid>
      </div>
    </Stack>
  );
}
