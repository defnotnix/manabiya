"use client";

import { useState } from "react";
import {
  Modal,
  Stack,
  Text,
  TextInput,
  Textarea,
  Switch,
  Button,
  Group,
  Paper,
  Badge,
  ActionIcon,
  Divider,
  ScrollArea,
} from "@mantine/core";
import {
  UserPlusIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhoneIcon,
  UserIcon,
  PencilSimpleIcon,
  FloppyDiskIcon,
  XIcon,
} from "@phosphor-icons/react";
import type { BoothReportCandidate, BoothReport } from "../types";

interface CandidateModalProps {
  opened: boolean;
  onClose: () => void;
  report: BoothReport;
  onSave: (candidates: BoothReportCandidate[]) => void;
  isSaving?: boolean;
}

export function CandidateModal({
  opened,
  onClose,
  report,
  onSave,
  isSaving = false,
}: CandidateModalProps) {
  const [candidates, setCandidates] = useState<BoothReportCandidate[]>(
    report.candidates || []
  );
  const [newCandidate, setNewCandidate] = useState<BoothReportCandidate>({
    name: "",
    phone: "",
    accepted: false,
    remarks: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingCandidate, setEditingCandidate] = useState<BoothReportCandidate | null>(null);

  const handleAddCandidate = () => {
    if (!newCandidate.name.trim()) return;
    const updatedCandidates = [...candidates, { ...newCandidate }];
    setCandidates(updatedCandidates);
    setNewCandidate({ name: "", phone: "", accepted: false, remarks: "" });
    setShowAddForm(false);
    // Immediately save to API
    onSave(updatedCandidates);
  };

  const handleRemoveCandidate = (index: number) => {
    const updatedCandidates = candidates.filter((_, i) => i !== index);
    setCandidates(updatedCandidates);
    // Immediately save to API
    onSave(updatedCandidates);
  };

  const handleToggleAccepted = (index: number) => {
    const updatedCandidates = candidates.map((c, i) =>
      i === index ? { ...c, accepted: !c.accepted } : c
    );
    setCandidates(updatedCandidates);
    // Immediately save to API
    onSave(updatedCandidates);
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditingCandidate({ ...candidates[index] });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingCandidate(null);
  };

  const handleSaveEdit = () => {
    if (editingIndex === null || !editingCandidate || !editingCandidate.name.trim()) return;
    const updatedCandidates = candidates.map((c, i) =>
      i === editingIndex ? { ...editingCandidate } : c
    );
    setCandidates(updatedCandidates);
    setEditingIndex(null);
    setEditingCandidate(null);
    // Immediately save to API
    onSave(updatedCandidates);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <UserIcon size={20} weight="fill" color="#7c3aed" />
          <Text fw={600}>Manage Candidates</Text>
        </Group>
      }
      size="lg"
    >
      <Stack gap="md">
        {/* Report Info */}
        <Paper withBorder p="sm" radius="sm" bg="gray.0">
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Report Year: <strong>{report.year}</strong>
            </Text>
            <Badge
              color={
                report.priority === "RED"
                  ? "red"
                  : report.priority === "YELLOW"
                    ? "yellow"
                    : "green"
              }
            >
              {report.priority} Priority
            </Badge>
          </Group>
        </Paper>

        <Divider />

        {/* Existing Candidates */}
        <Stack gap="xs">
          <Group justify="space-between">
            <Text fw={600} size="sm">
              Candidates ({candidates.length})
            </Text>
            <Button
              size="xs"
              variant="light"
              leftSection={<UserPlusIcon size={14} />}
              onClick={() => setShowAddForm(true)}
              disabled={showAddForm || editingIndex !== null}
            >
              Add Candidate
            </Button>
          </Group>

          {candidates.length === 0 && !showAddForm ? (
            <Paper withBorder p="md" radius="sm">
              <Text size="sm" c="dimmed" ta="center">
                No candidates added yet
              </Text>
            </Paper>
          ) : (
            <ScrollArea.Autosize mah={400}>
              <Stack gap="xs">
                {candidates.map((candidate, idx) => (
                  <Paper key={idx} withBorder p="sm" radius="sm">
                    {editingIndex === idx && editingCandidate ? (
                      // Edit mode
                      <Stack gap="sm">
                        <TextInput
                          label="Name"
                          placeholder="Candidate name"
                          required
                          size="xs"
                          value={editingCandidate.name}
                          onChange={(e) =>
                            setEditingCandidate({ ...editingCandidate, name: e.target.value })
                          }
                          disabled={isSaving}
                        />
                        <TextInput
                          label="Phone"
                          placeholder="Phone number (optional)"
                          size="xs"
                          value={editingCandidate.phone || ""}
                          onChange={(e) =>
                            setEditingCandidate({ ...editingCandidate, phone: e.target.value })
                          }
                          disabled={isSaving}
                        />
                        <Switch
                          label="Accepted"
                          size="xs"
                          checked={editingCandidate.accepted}
                          onChange={(e) =>
                            setEditingCandidate({
                              ...editingCandidate,
                              accepted: e.target.checked,
                            })
                          }
                          disabled={isSaving}
                        />
                        <Textarea
                          label="Remarks"
                          placeholder="Additional notes (optional)"
                          size="xs"
                          value={editingCandidate.remarks || ""}
                          onChange={(e) =>
                            setEditingCandidate({ ...editingCandidate, remarks: e.target.value })
                          }
                          rows={2}
                          disabled={isSaving}
                        />
                        <Group justify="flex-end" gap="xs">
                          <Button
                            size="xs"
                            variant="subtle"
                            color="gray"
                            leftSection={<XIcon size={14} />}
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="xs"
                            leftSection={<FloppyDiskIcon size={14} />}
                            onClick={handleSaveEdit}
                            disabled={!editingCandidate.name.trim() || isSaving}
                            loading={isSaving}
                          >
                            Save
                          </Button>
                        </Group>
                      </Stack>
                    ) : (
                      // View mode
                      <Group justify="space-between" align="flex-start">
                        <Stack gap={4} style={{ flex: 1 }}>
                          <Group gap="xs">
                            <Text size="sm" fw={600}>
                              {candidate.name}
                            </Text>
                            <Badge
                              size="sm"
                              color={candidate.accepted ? "green" : "red"}
                              variant="light"
                              leftSection={
                                candidate.accepted ? (
                                  <CheckCircleIcon size={12} weight="fill" />
                                ) : (
                                  <XCircleIcon size={12} weight="fill" />
                                )
                              }
                            >
                              {candidate.accepted ? "Accepted" : "Declined"}
                            </Badge>
                          </Group>
                          {candidate.phone && (
                            <Group gap={4}>
                              <PhoneIcon size={12} color="#6b7280" />
                              <Text size="xs" c="dimmed">
                                {candidate.phone}
                              </Text>
                            </Group>
                          )}
                          {candidate.remarks && (
                            <Text size="xs" c="dimmed" lineClamp={2}>
                              {candidate.remarks}
                            </Text>
                          )}
                        </Stack>
                        <Group gap={4}>
                          <ActionIcon
                            size="sm"
                            variant="subtle"
                            color="blue"
                            onClick={() => handleStartEdit(idx)}
                            title="Edit candidate"
                            disabled={isSaving || editingIndex !== null}
                          >
                            <PencilSimpleIcon size={16} />
                          </ActionIcon>
                          <ActionIcon
                            size="sm"
                            variant="subtle"
                            color={candidate.accepted ? "red" : "green"}
                            onClick={() => handleToggleAccepted(idx)}
                            title={candidate.accepted ? "Mark as declined" : "Mark as accepted"}
                            disabled={isSaving || editingIndex !== null}
                          >
                            {candidate.accepted ? (
                              <XCircleIcon size={16} />
                            ) : (
                              <CheckCircleIcon size={16} />
                            )}
                          </ActionIcon>
                          <ActionIcon
                            size="sm"
                            variant="subtle"
                            color="red"
                            onClick={() => handleRemoveCandidate(idx)}
                            title="Remove candidate"
                            disabled={isSaving || editingIndex !== null}
                          >
                            <TrashIcon size={16} />
                          </ActionIcon>
                        </Group>
                      </Group>
                    )}
                  </Paper>
                ))}
              </Stack>
            </ScrollArea.Autosize>
          )}
        </Stack>

        {/* Add Candidate Form */}
        {showAddForm && (
          <>
            <Divider />
            <Paper withBorder p="md" radius="sm" bg="violet.0">
              <Stack gap="sm">
                <Text fw={600} size="sm">
                  Add New Candidate
                </Text>
                <TextInput
                  label="Name"
                  placeholder="Candidate name"
                  required
                  value={newCandidate.name}
                  onChange={(e) =>
                    setNewCandidate({ ...newCandidate, name: e.target.value })
                  }
                />
                <TextInput
                  label="Phone"
                  placeholder="Phone number (optional)"
                  value={newCandidate.phone}
                  onChange={(e) =>
                    setNewCandidate({ ...newCandidate, phone: e.target.value })
                  }
                />
                <Switch
                  label="Accepted"
                  description="Has the candidate accepted support?"
                  checked={newCandidate.accepted}
                  onChange={(e) =>
                    setNewCandidate({
                      ...newCandidate,
                      accepted: e.target.checked,
                    })
                  }
                />
                <Textarea
                  label="Remarks"
                  placeholder="Additional notes (optional)"
                  value={newCandidate.remarks}
                  onChange={(e) =>
                    setNewCandidate({ ...newCandidate, remarks: e.target.value })
                  }
                  rows={2}
                />
                <Group justify="flex-end" gap="xs">
                  <Button
                    variant="subtle"
                    color="gray"
                    size="xs"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewCandidate({
                        name: "",
                        phone: "",
                        accepted: false,
                        remarks: "",
                      });
                    }}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="xs"
                    onClick={handleAddCandidate}
                    disabled={!newCandidate.name.trim() || isSaving}
                    loading={isSaving}
                  >
                    Add
                  </Button>
                </Group>
              </Stack>
            </Paper>
          </>
        )}

        <Divider />

        {/* Close Button */}
        <Group justify="flex-end">
          <Button variant="light" onClick={onClose} disabled={isSaving}>
            {isSaving ? "Saving..." : "Close"}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
