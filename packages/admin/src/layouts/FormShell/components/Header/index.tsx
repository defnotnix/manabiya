"use client";

import { Box, Container, Breadcrumbs, Text, Stack, Group } from "@mantine/core";
import { PropFormShellHeader } from "../../FormShell.type";

export function FormShellHeader({
  bread,
  moduleInfo,
  title,
}: PropFormShellHeader) {
  return (
    <Box
      py="md"
      bg="var(--mantine-color-gray-0)"
      style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}
    >
      <Container size="sm">
        <Stack gap="sm">
          {/* Breadcrumbs */}
          {bread && bread.length > 0 && (
            <Breadcrumbs>
              {bread.map((item, idx) =>
                item.link ? (
                  <Text key={idx} size="sm" component="a" href={item.link}>
                    {item.label}
                  </Text>
                ) : (
                  <Text key={idx} size="sm">
                    {item.label}
                  </Text>
                )
              )}
            </Breadcrumbs>
          )}

          {/* Title & Module Info */}
          <Group justify="space-between" align="flex-start">
            <div>
              {title && (
                <Text fw={700} size="lg">
                  {title}
                </Text>
              )}
              {moduleInfo?.name && (
                <Text size="sm" opacity={0.7}>
                  {moduleInfo.name}
                </Text>
              )}
            </div>
          </Group>
        </Stack>
      </Container>
    </Box>
  );
}
