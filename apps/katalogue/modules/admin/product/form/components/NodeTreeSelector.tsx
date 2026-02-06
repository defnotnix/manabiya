"use client";

import { useState } from "react";
import {
  Text,
  Group,
  Box,
  ScrollArea,
  Button,
  Stack,
  Breadcrumbs,
  Anchor,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { CATALOG_NODE_API } from "../../../catalogue-nodes/module.api";
import { ArrowLeft, Check } from "@phosphor-icons/react";

interface CatalogNode {
  id: number;
  name: string;
  node_type: string;
  parent: number | null;
  children?: CatalogNode[];
}

interface NodeTreeSelectorProps {
  value: number | null;
  onChange: (nodeId: number) => void;
  error?: string;
}

export function NodeTreeSelector({
  value,
  onChange,
  error,
}: NodeTreeSelectorProps) {
  const [currentPath, setCurrentPath] = useState<CatalogNode[]>([]);

  // Fetch nodes
  const { data: allNodes = [], isLoading } = useQuery<CatalogNode[]>({
    queryKey: ["catalogue", "nodes", "tree"],
    queryFn: async () => {
      const res = await CATALOG_NODE_API.getTree();
      return res.data || [];
    },
  });

  // Get current level nodes
  const currentNodes =
    currentPath.length === 0
      ? allNodes
      : currentPath[currentPath.length - 1].children || [];

  // Navigate into a node
  const navigateInto = (node: CatalogNode) => {
    if (node.children && node.children.length > 0) {
      setCurrentPath([...currentPath, node]);
    }
  };

  // Navigate back
  const navigateBack = () => {
    setCurrentPath(currentPath.slice(0, -1));
  };

  // Navigate to specific breadcrumb
  const navigateTo = (index: number) => {
    setCurrentPath(currentPath.slice(0, index));
  };

  if (isLoading) {
    return (
      <Text size="xs" fw={800} c="dimmed">
        Loading catalogue...
      </Text>
    );
  }

  return (
    <Stack gap="xs">
      <Text size="xs" fw={800}>
        Select Catalogue Node
      </Text>

      {/* Breadcrumb navigation */}
      {currentPath.length > 0 && (
        <Group gap="xs">
          <Button
            size="xs"
            variant="subtle"
            leftSection={<ArrowLeft size={14} />}
            onClick={navigateBack}
          >
            Back
          </Button>
          <Breadcrumbs separator="›" separatorMargin="xs">
            <Anchor size="xs" fw={800} onClick={() => navigateTo(0)}>
              Root
            </Anchor>
            {currentPath.map((node, index) => (
              <Group key={node.id} gap={4}>
                <Anchor
                  size="xs"
                  fw={800}
                  onClick={() => navigateTo(index + 1)}
                >
                  {node.name}
                </Anchor>
                {value === node.id && (
                  <Text size="xs" c="blue" fw={800}>
                    (selected)
                  </Text>
                )}
              </Group>
            ))}
          </Breadcrumbs>
        </Group>
      )}

      {/* Node list */}
      <ScrollArea
        h={250}
        style={{
          border: "1px solid var(--mantine-color-gray-3)",
          borderRadius: 4,
        }}
      >
        <Stack gap={0}>
          {currentNodes.map((node) => {
            const hasChildren = node.children && node.children.length > 0;
            const isSelected = value === node.id;

            return (
              <Box
                key={node.id}
                p="sm"
                style={{
                  backgroundColor: isSelected
                    ? "var(--mantine-color-blue-light)"
                    : "transparent",
                  borderBottom: "1px solid var(--mantine-color-gray-2)",
                }}
              >
                <Group justify="space-between" wrap="nowrap">
                  {/* Select button on left */}
                  <Button
                    size="xs"
                    variant={isSelected ? "filled" : "light"}
                    onClick={() => onChange(node.id)}
                    leftSection={
                      isSelected ? <Check size={14} weight="bold" /> : null
                    }
                  >
                    {isSelected ? "Selected" : "Select"}
                  </Button>

                  {/* Node info in middle */}
                  <Group gap="sm" style={{ flex: 1 }}>
                    <Text size="xs" fw={800}>
                      {node.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      ({node.node_type})
                    </Text>
                  </Group>

                  {/* Navigation arrow on right */}
                  {hasChildren && (
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={() => navigateInto(node)}
                    >
                      →
                    </Button>
                  )}
                </Group>
              </Box>
            );
          })}
        </Stack>
      </ScrollArea>

      {error && (
        <Text size="xs" fw={800} c="red">
          {error}
        </Text>
      )}
    </Stack>
  );
}
