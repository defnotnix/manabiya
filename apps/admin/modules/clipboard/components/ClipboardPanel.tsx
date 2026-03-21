"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  Stack,
  Button,
  Group,
  Text,
  TextInput,
  Badge,
  Tabs,
  Tooltip,
  ActionIcon,
  ScrollArea,
  Divider,
  Box,
  ThemeIcon,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  Plus,
  Copy,
  Trash,
  PushPin,
  Archive,
  FloppyDisk,
} from "@phosphor-icons/react";
import { useClipboardApi, Category, ClipboardEntry } from "../hooks/useClipboardApi";
import { CategoryForm } from "./CategoryForm";
import { ClipboardEntryForm } from "./ClipboardEntryForm";
import styles from "./ClipboardPanel.module.css";

interface ClipboardPanelProps {
  opened: boolean;
  onClose: () => void;
}

export function ClipboardPanel({ opened, onClose }: ClipboardPanelProps) {
  const api = useClipboardApi();
  const [categories, setCategories] = useState<Category[]>([]);
  const [entries, setEntries] = useState<ClipboardEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [editingEntry, setEditingEntry] = useState<ClipboardEntry | null>(null);

  useEffect(() => {
    if (opened) {
      loadData();
    }
  }, [opened]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [cats, ents] = await Promise.all([
        api.fetchCategories(),
        api.fetchClipboardEntries(),
      ]);
      setCategories(cats);
      setEntries(ents);
      if (cats.length > 0 && !selectedCategory) {
        setSelectedCategory(cats[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = async (data: {
    name: string;
    description: string;
  }) => {
    const newCategory = await api.createCategory(data);
    if (newCategory) {
      setCategories([...categories, newCategory]);
      setSelectedCategory(newCategory);
      setShowCategoryForm(false);
    }
  };

  const handleDeleteCategory = (categoryId: number) => {
    modals.openConfirmModal({
      title: "Delete Category",
      children: (
        <Text size="sm">
          This will delete the category and all its clipboard entries. This action cannot be
          reverted.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        const success = await api.deleteCategory(categoryId);
        if (success) {
          setCategories(categories.filter((c) => c.id !== categoryId));
          setEntries(entries.filter((e) => e.category !== categoryId));
          if (selectedCategory?.id === categoryId) {
            setSelectedCategory(categories.find((c) => c.id !== categoryId) || null);
          }
        }
      },
    });
  };

  const handleCreateEntry = async (data: {
    title: string;
    content: string;
    notes: string;
    is_pinned: boolean;
  }) => {
    if (!selectedCategory) return;

    const newEntry = await api.createClipboardEntry({
      category: selectedCategory.id,
      ...data,
    });

    if (newEntry) {
      setEntries([...entries, newEntry]);
      setShowEntryForm(false);
    }
  };

  const handleUpdateEntry = async (
    entryId: number,
    data: Partial<ClipboardEntry>
  ) => {
    const updated = await api.updateClipboardEntry(entryId, data);
    if (updated) {
      setEntries(entries.map((e) => (e.id === entryId ? updated : e)));
      setEditingEntry(null);
      setShowEntryForm(false);
    }
  };

  const handleDeleteEntry = (entryId: number) => {
    modals.openConfirmModal({
      title: "Delete Clipboard Entry",
      children: <Text size="sm">This action cannot be reverted.</Text>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        const success = await api.deleteClipboardEntry(entryId);
        if (success) {
          setEntries(entries.filter((e) => e.id !== entryId));
        }
      },
    });
  };

  const handleCopyEntry = async (entry: ClipboardEntry) => {
    try {
      await navigator.clipboard.writeText(entry.content);
      await api.markClipboardAsUsed(entry.id);
      setEntries(
        entries.map((e) =>
          e.id === entry.id
            ? {
                ...e,
                usage_count: e.usage_count + 1,
                last_used_at: new Date().toISOString(),
              }
            : e
        )
      );
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleSaveEntry = async (entry: ClipboardEntry) => {
    try {
      // Find the currently focused input field
      const activeElement = document.activeElement as HTMLInputElement | HTMLTextAreaElement;

      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        // Insert at cursor position or replace all text
        const start = activeElement.selectionStart || 0;
        const end = activeElement.selectionEnd || activeElement.value.length;
        const before = activeElement.value.substring(0, start);
        const after = activeElement.value.substring(end);
        activeElement.value = before + entry.content + after;

        // Trigger input event to notify form of change
        activeElement.dispatchEvent(new Event('input', { bubbles: true }));
        activeElement.focus();
        activeElement.setSelectionRange(start + entry.content.length, start + entry.content.length);
      }

      await api.markClipboardAsUsed(entry.id);
      setEntries(
        entries.map((e) =>
          e.id === entry.id
            ? {
                ...e,
                usage_count: e.usage_count + 1,
                last_used_at: new Date().toISOString(),
              }
            : e
        )
      );
    } catch (error) {
      console.error("Failed to save:", error);
    }
  };

  const handleTogglePin = async (entry: ClipboardEntry) => {
    const updated = await api.updateClipboardEntry(entry.id, {
      is_pinned: !entry.is_pinned,
    });
    if (updated) {
      setEntries(entries.map((e) => (e.id === entry.id ? updated : e)));
    }
  };

  const handleToggleArchive = async (entry: ClipboardEntry) => {
    const updated = await api.updateClipboardEntry(entry.id, {
      is_archived: !entry.is_archived,
    });
    if (updated) {
      setEntries(entries.map((e) => (e.id === entry.id ? updated : e)));
    }
  };

  const filteredEntries = entries.filter(
    (e) =>
      (!selectedCategory || e.category === selectedCategory.id) &&
      !e.is_archived &&
      (e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pinnedEntries = filteredEntries.filter((e) => e.is_pinned).sort((a, b) => {
    const aDate = a.last_used_at ? new Date(a.last_used_at).getTime() : 0;
    const bDate = b.last_used_at ? new Date(b.last_used_at).getTime() : 0;
    return bDate - aDate;
  });

  const unpinnedEntries = filteredEntries
    .filter((e) => !e.is_pinned)
    .sort((a, b) => {
      const aDate = a.last_used_at ? new Date(a.last_used_at).getTime() : 0;
      const bDate = b.last_used_at ? new Date(b.last_used_at).getTime() : 0;
      return bDate - aDate;
    });

  // Show category form inside drawer
  if (showCategoryForm) {
    return (
      <Drawer
        opened={opened}
        onClose={onClose}
        position="right"
        size="lg"
        title="Add New Category"
      >
        <Stack gap="md">
          <CategoryForm
            onSubmit={handleCreateCategory}
            onCancel={() => setShowCategoryForm(false)}
          />
        </Stack>
      </Drawer>
    );
  }

  // Show entry form inside drawer
  if (showEntryForm && selectedCategory) {
    return (
      <Drawer
        opened={opened}
        onClose={onClose}
        position="right"
        size="lg"
        title={editingEntry ? "Edit Clipboard Entry" : "Add New Clipboard Entry"}
      >
        <Stack gap="md">
          <ClipboardEntryForm
            category={selectedCategory}
            entry={editingEntry}
            onSubmit={async (data) => {
              if (editingEntry) {
                await handleUpdateEntry(editingEntry.id, data);
              } else {
                await handleCreateEntry(data);
              }
            }}
            onCancel={() => {
              setShowEntryForm(false);
              setEditingEntry(null);
            }}
          />
        </Stack>
      </Drawer>
    );
  }

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="lg"
      title={
        <Group justify="space-between" style={{ width: "100%" }}>
          <Text fw={600}>Clipboard Manager</Text>
          <Badge>
            {categories.length} {categories.length === 1 ? "category" : "categories"}
          </Badge>
        </Group>
      }
      classNames={{ content: styles.clipboardDrawer }}
    >
      <Stack gap="md">
        {/* Add New Button */}
        <Button
          leftSection={<Plus size={16} />}
          onClick={() => {
            setEditingEntry(null);
            setShowEntryForm(true);
          }}
          fullWidth
          size="sm"
          variant="light"
        >
          + Add New Clipboard Entry
        </Button>

        <Divider />

        {/* Search Bar */}
        <TextInput
          placeholder="Search by title, content, or notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          size="sm"
        />

        {/* Categories & Entries */}
        <Tabs defaultValue="all" orientation="vertical">
          <Tabs.List>
            <Tabs.Tab value="all" leftSection={<Text size="xs">📋</Text>}>
              All Entries
            </Tabs.Tab>

            {categories.map((category) => (
              <Tabs.Tab
                key={category.id}
                value={`cat-${category.id}`}
                leftSection={
                  <Group gap={4}>
                    <Text size="xs">{category.name.slice(0, 1)}</Text>
                  </Group>
                }
              >
                <Group justify="space-between" gap="xs" style={{ width: "100%" }}>
                  <Text size="xs">{category.name}</Text>
                  <ActionIcon
                    size="xs"
                    variant="subtle"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(category.id);
                    }}
                  >
                    <Trash size={14} />
                  </ActionIcon>
                </Group>
              </Tabs.Tab>
            ))}

            <Tabs.Tab
              value="add-category"
              leftSection={<Plus size={16} />}
              onClick={() => setShowCategoryForm(true)}
            >
              Add Category
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="all">
            <ClipboardEntriesList entries={filteredEntries} onAction={handleCopyEntry} onSave={handleSaveEntry} />
          </Tabs.Panel>

          {categories.map((category) => (
            <Tabs.Panel key={category.id} value={`cat-${category.id}`}>
              <ClipboardEntriesList
                entries={filteredEntries.filter((e) => e.category === category.id)}
                onAction={handleCopyEntry}
                onSave={handleSaveEntry}
                onEdit={(entry) => {
                  setEditingEntry(entry);
                  setSelectedCategory(category);
                  setShowEntryForm(true);
                }}
                onDelete={(entry) => handleDeleteEntry(entry.id)}
                onTogglePin={handleTogglePin}
                onToggleArchive={handleToggleArchive}
              />
            </Tabs.Panel>
          ))}
        </Tabs>
      </Stack>
    </Drawer>
  );
}

interface ClipboardEntriesListProps {
  entries: ClipboardEntry[];
  onAction: (entry: ClipboardEntry) => void;
  onSave?: (entry: ClipboardEntry) => void;
  onEdit?: (entry: ClipboardEntry) => void;
  onDelete?: (entry: ClipboardEntry) => void;
  onTogglePin?: (entry: ClipboardEntry) => void;
  onToggleArchive?: (entry: ClipboardEntry) => void;
}

function ClipboardEntriesList({
  entries,
  onAction,
  onSave,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleArchive,
}: ClipboardEntriesListProps) {
  if (entries.length === 0) {
    return (
      <Box py="xl" ta="center">
        <Text size="sm" c="dimmed">
          No clipboard entries found
        </Text>
      </Box>
    );
  }

  return (
    <ScrollArea>
      <Stack gap="xs">
        {entries.map((entry) => (
          <Box key={entry.id} className={styles.entryCard}>
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Stack gap={4} style={{ flex: 1 }}>
                <Group gap="xs" align="center">
                  <Text fw={500} size="sm">
                    {entry.title}
                  </Text>
                  {entry.is_pinned && (
                    <ThemeIcon size="xs" variant="light" color="yellow">
                      <PushPin size={12} />
                    </ThemeIcon>
                  )}
                </Group>

                <Text size="xs" c="dimmed" lineClamp={2}>
                  {entry.content}
                </Text>

                {entry.notes && (
                  <Text size="xs" c="blue" fs="italic">
                    {entry.notes}
                  </Text>
                )}

                <Group gap="xs" justify="space-between">
                  <Group gap={4}>
                    <Badge size="xs" variant="light">
                      Used {entry.usage_count}x
                    </Badge>
                    {entry.last_used_at && (
                      <Text size="xs" c="dimmed">
                        {new Date(entry.last_used_at).toLocaleDateString()}
                      </Text>
                    )}
                  </Group>
                </Group>
              </Stack>

              <Group gap="xs">
                <Tooltip label="Copy to clipboard">
                  <ActionIcon
                    variant="light"
                    onClick={() => onAction(entry)}
                    size="sm"
                  >
                    <Copy size={14} />
                  </ActionIcon>
                </Tooltip>

                {onSave && (
                  <Tooltip label="Insert into field">
                    <ActionIcon
                      variant="light"
                      onClick={() => onSave(entry)}
                      size="sm"
                      color="blue"
                    >
                      <FloppyDisk size={14} />
                    </ActionIcon>
                  </Tooltip>
                )}

                {onTogglePin && (
                  <Tooltip label={entry.is_pinned ? "Unpin" : "Pin"}>
                    <ActionIcon
                      variant={entry.is_pinned ? "filled" : "light"}
                      onClick={() => onTogglePin(entry)}
                      size="sm"
                      color={entry.is_pinned ? "yellow" : "gray"}
                    >
                      <PushPin size={14} />
                    </ActionIcon>
                  </Tooltip>
                )}

                {onEdit && (
                  <Tooltip label="Edit">
                    <ActionIcon
                      variant="light"
                      onClick={() => onEdit(entry)}
                      size="sm"
                    >
                      <Text size="xs">✏️</Text>
                    </ActionIcon>
                  </Tooltip>
                )}

                {onToggleArchive && (
                  <Tooltip label={entry.is_archived ? "Unarchive" : "Archive"}>
                    <ActionIcon
                      variant="light"
                      onClick={() => onToggleArchive(entry)}
                      size="sm"
                    >
                      <Archive size={14} />
                    </ActionIcon>
                  </Tooltip>
                )}

                {onDelete && (
                  <Tooltip label="Delete">
                    <ActionIcon
                      variant="light"
                      color="red"
                      onClick={() => onDelete(entry)}
                      size="sm"
                    >
                      <Trash size={14} />
                    </ActionIcon>
                  </Tooltip>
                )}
              </Group>
            </Group>
          </Box>
        ))}
      </Stack>
    </ScrollArea>
  );
}
