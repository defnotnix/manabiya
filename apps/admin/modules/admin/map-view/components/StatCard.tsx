"use client";

import { Paper, Text, Group, ThemeIcon } from "@mantine/core";
import { Icon } from "@phosphor-icons/react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: Icon;
  color?: string;
  subtitle?: string;
}

export function StatCard({
  title,
  value,
  icon: IconComponent,
  color = "blue",
  subtitle,
}: StatCardProps) {
  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between">
        <div>
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
            {title}
          </Text>
          <Text fw={700} size="xl" mt="xs">
            {value}
          </Text>
          {subtitle && (
            <Text size="xs" c="dimmed" mt={4}>
              {subtitle}
            </Text>
          )}
        </div>
        {IconComponent && (
          <ThemeIcon color={color} size={38} radius="md" variant="light">
            <IconComponent size={24} />
          </ThemeIcon>
        )}
      </Group>
    </Paper>
  );
}
