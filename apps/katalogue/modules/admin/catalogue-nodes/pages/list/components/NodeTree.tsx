import {
  ActionIcon,
  Group,
  Text,
  Accordion,
  Button,
  Menu,
  Badge,
} from "@mantine/core";
import {
  Plus,
  PencilSimple,
  Trash,
  DotsThreeVertical,
  PencilSimpleIcon,
  PlusIcon,
  DotsThreeVerticalIcon,
} from "@phosphor-icons/react";

export interface CatalogNode {
  id: number | string;
  node_type: string;
  name: string;
  image_url: string | null;
  sort_order: number;
  children: CatalogNode[];
}

interface NodeTreeProps {
  nodes: CatalogNode[];
  onAddChild: (parentId: string | number) => void;
  onEdit: (node: CatalogNode) => void;
  onDelete: (node: CatalogNode) => void;
  level?: number;
}

export function NodeTree({
  nodes,
  onAddChild,
  onEdit,
  onDelete,
  level = 0,
}: NodeTreeProps) {
  if (!nodes || nodes.length === 0) {
    return (
      <Text c="dimmed" size="sm" p="md">
        No items found.
      </Text>
    );
  }

  return (
    <Accordion
      chevronPosition="left"
      variant="contained"
      radius={0}
      multiple
      styles={{
        content: {
          padding: 0,
          paddingBottom: "var(--mantine-spacing-md)",
        },
      }}
    >
      {nodes.map((node) => (
        <Accordion.Item key={node.id} value={String(node.id)}>
          <div style={{ position: "relative" }}>
            <Accordion.Control pr={120}>
              <Group gap="sm">
                <Text size="xs" fw={500}>
                  {node.name}
                </Text>
                <Badge size="xs" variant="light" color="gray">
                  {node.node_type}
                </Badge>
              </Group>
            </Accordion.Control>

            <Group
              gap={4}
              style={{
                position: "absolute",
                top: "50%",
                right: 8,
                transform: "translateY(-50%)",
                zIndex: 10,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <ActionIcon
                variant="subtle"
                color="blue"
                size="sm"
                onClick={() => onEdit(node)}
                title="Edit"
              >
                <PencilSimpleIcon size={16} />
              </ActionIcon>

              <ActionIcon
                variant="subtle"
                color="green"
                size="sm"
                onClick={() => onAddChild(node.id)}
                title="Add Child"
              >
                <PlusIcon size={16} />
              </ActionIcon>

              <Menu position="bottom-end" withinPortal>
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray" size="sm">
                    <DotsThreeVerticalIcon size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    color="red"
                    leftSection={<Trash size={14} />}
                    onClick={() => onDelete(node)}
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </div>
          <Accordion.Panel>
            {node.children && node.children.length > 0 ? (
              <div style={{ marginLeft: 20 }}>
                <NodeTree
                  nodes={node.children}
                  onAddChild={onAddChild}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  level={level + 1}
                />
              </div>
            ) : (
              <Text c="dimmed" size="xs">
                No children
              </Text>
            )}
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
