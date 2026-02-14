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
} from "@mantine/core";
import { BarChart, PieChart, DonutChart } from "@mantine/charts";
import { StatCard } from "./StatCard";
import {
  UsersIcon,
  GenderMaleIcon,
  GenderFemaleIcon,
  IdentificationCardIcon,
  PhoneIcon,
  ChurchIcon,
} from "@phosphor-icons/react";

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
}

export function ReportDashboard({ data, reportType }: ReportDashboardProps) {
  if (!data) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        No data available
      </Text>
    );
  }

  // Handle dashboard summary differently
  if (reportType === "dashboard") {
    return <DashboardSummaryView data={data} />;
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
  const ageData = [
    { age: "10-20", count: total_voters_10_20_age },
    { age: "20-30", count: total_voters_20_30_age },
    { age: "30-40", count: total_voters_30_40_age },
    { age: "40-50", count: total_voters_40_50_age },
    { age: "50-60", count: total_voters_50_60_age },
    { age: "60+", count: total_voters_60_plus_age },
  ];

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
  const religionData = Object.entries(religion_counts)
    .map(([religion, count]) => ({
      religion,
      count: count as number,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Prepare caste data (top 10)
  const casteData = Object.entries(caste_counts)
    .map(([caste, count]) => ({
      caste,
      count: count as number,
    }))
    .sort((a, b) => b.count - a.count)
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
              <PieChart
                data={genderData}
                withLabelsLine
                labelsPosition="outside"
                labelsType="percent"
                withLabels
                size={200}
                mx="auto"
              />
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
              <DonutChart
                data={maritalData}
                chartLabel={`${total_voters_married_count + total_voters_unmarried_count}`}
                size={200}
                thickness={30}
                mx="auto"
              />
            ) : (
              <Text c="dimmed" ta="center" py="md">
                No data
              </Text>
            )}
          </Paper>
        </SimpleGrid>
      </div>

      {/* Age Groups */}
      {ageData.some((d) => d.count > 0) && (
        <Paper withBorder p="md" radius="md">
          <Text fw={600} size="sm" mb="md">
            Age Group Distribution
          </Text>
          <BarChart
            h={300}
            data={ageData}
            dataKey="age"
            series={[{ name: "count", color: "blue.6", label: "Voters" }]}
            tickLine="y"
            gridAxis="y"
            tooltipProps={{
              content: ({ label, payload }) => {
                if (!payload || payload.length === 0) return null;
                return (
                  <Paper p="xs" shadow="md" radius="sm" withBorder>
                    <Text size="sm" fw={600}>
                      {label}
                    </Text>
                    <Text size="sm" c="blue">
                      Voters: {payload[0]?.value?.toLocaleString()}
                    </Text>
                  </Paper>
                );
              },
            }}
          />
        </Paper>
      )}

      {/* Religion Distribution */}
      {religionData.length > 0 && (
        <Paper withBorder p="md" radius="md">
          <Text fw={600} size="sm" mb="md">
            Religion Distribution (Top 10)
          </Text>
          <BarChart
            h={300}
            data={religionData}
            dataKey="religion"
            series={[{ name: "count", color: "orange.6", label: "Count" }]}
            tickLine="y"
            gridAxis="y"
            tooltipProps={{
              content: ({ label, payload }) => {
                if (!payload || payload.length === 0) return null;
                return (
                  <Paper p="xs" shadow="md" radius="sm" withBorder>
                    <Text size="sm" fw={600}>
                      {label}
                    </Text>
                    <Text size="sm" c="orange">
                      Count: {payload[0]?.value?.toLocaleString()}
                    </Text>
                  </Paper>
                );
              },
            }}
          />
        </Paper>
      )}

      {/* Caste Distribution */}
      {casteData.length > 0 && (
        <Paper withBorder p="md" radius="md">
          <Text fw={600} size="sm" mb="md">
            Caste Distribution (Top 10)
          </Text>
          <BarChart
            h={300}
            data={casteData}
            dataKey="caste"
            series={[{ name: "count", color: "violet.6", label: "Count" }]}
            tickLine="y"
            gridAxis="y"
            tooltipProps={{
              content: ({ label, payload }) => {
                if (!payload || payload.length === 0) return null;
                return (
                  <Paper p="xs" shadow="md" radius="sm" withBorder>
                    <Text size="sm" fw={600}>
                      {label}
                    </Text>
                    <Text size="sm" c="violet">
                      Count: {payload[0]?.value?.toLocaleString()}
                    </Text>
                  </Paper>
                );
              },
            }}
          />
        </Paper>
      )}
    </Stack>
  );
}

function DashboardSummaryView({ data }: { data: any }) {
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
                    <BarChart
                      h={250}
                      data={religions.map((r: any) => ({
                        religion: r.religion,
                        percentage: parseFloat(r.percentage),
                      }))}
                      dataKey="religion"
                      series={[
                        { name: "percentage", color: "orange.6", label: "%" },
                      ]}
                      tickLine="y"
                      gridAxis="y"
                      tooltipProps={{
                        content: ({ label, payload }) => {
                          if (!payload || payload.length === 0) return null;
                          return (
                            <Paper p="xs" shadow="md" radius="sm" withBorder>
                              <Text size="sm" fw={600}>
                                {label}
                              </Text>
                              <Text size="sm" c="orange">
                                {payload[0]?.value?.toFixed(2)}%
                              </Text>
                            </Paper>
                          );
                        },
                      }}
                    />
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
