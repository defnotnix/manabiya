"use client";

import {
  Modal,
  Stack,
  TextInput,
  Select,
  Group,
  Button,
  NumberInput,
  Textarea,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { FormHandler } from "@settle/core";
import { triggerNotification } from "@settle/admin";
import { STUDENT_API } from "../../students/module.api";
import { useDocContext, StudentCertificateData } from "../context";
import { CheckIcon, XIcon } from "@phosphor-icons/react";

interface StudentCertificateModalProps {
  opened: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

interface StudentSearchOption {
  value: string;
  label: string;
}

const MONTH_OPTIONS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function StudentCertificateForm({
  onClose,
  studentData,
}: {
  onClose: () => void;
  studentData: any;
}) {
  const form = FormHandler.useForm();
  const { handleSubmit } = FormHandler.usePropContext();
  const { setDocumentData } = useDocContext();

  return (
    <Stack gap="md" p="md">
      <TextInput
        label="First Name"
        disabled
        {...form.getInputProps("firstname")}
      />

      <TextInput
        label="Last Name"
        disabled
        {...form.getInputProps("lastname")}
      />

      <TextInput
        label="Gender"
        disabled
        {...form.getInputProps("gender")}
      />

      <TextInput
        label="Date of Birth"
        disabled
        {...form.getInputProps("date_of_birth")}
      />

      <TextInput
        label="Address"
        disabled
        {...form.getInputProps("address")}
      />

      <TextInput
        label="Date of Admission"
        disabled
        {...form.getInputProps("date_of_admission")}
      />

      <TextInput
        label="Date of Completion"
        disabled
        {...form.getInputProps("date_of_completion")}
      />

      <Group grow>
        <Select
          label="Grammar"
          data={["A", "B", "C", "D"]}
          {...form.getInputProps("grammar")}
        />
        <Select
          label="Listening"
          data={["A", "B", "C", "D"]}
          {...form.getInputProps("listening")}
        />
      </Group>

      <Group grow>
        <Select
          label="Conversation"
          data={["A", "B", "C", "D"]}
          {...form.getInputProps("conversation")}
        />
        <Select
          label="Reading"
          data={["A", "B", "C", "D"]}
          {...form.getInputProps("reading")}
        />
      </Group>

      <Select
        label="Composition"
        data={["A", "B", "C", "D"]}
        {...form.getInputProps("composition")}
      />

      <TextInput
        label="Issue Date"
        placeholder="e.g., 2026-03-12"
        {...form.getInputProps("issue")}
      />

      <Select
        label="Study Type"
        data={[
          { value: "0", label: "Morning" },
          { value: "1", label: "Evening" },
        ]}
        {...form.getInputProps("studyType")}
      />

      <NumberInput
        label="Course Hours"
        {...form.getInputProps("coursehour")}
      />

      <TextInput
        label="Custom Branch (Optional)"
        {...form.getInputProps("customBranch")}
      />

      <TextInput
        label="Custom Branch No (Optional)"
        {...form.getInputProps("customBranchNo")}
      />

      <Textarea
        label="Batch (JSON)"
        minRows={4}
        {...form.getInputProps("batchJson")}
      />

      <Group justify="flex-end" mt="md">
        <Button variant="light" onClick={onClose} leftSection={<XIcon size={14} />} size="xs">
          Cancel
        </Button>
        <Button onClick={handleSubmit} leftSection={<CheckIcon size={14} />} size="xs">
          Save Certificate
        </Button>
      </Group>
    </Stack>
  );
}

export function StudentCertificateModal({
  opened,
  onClose,
  onCreated,
}: StudentCertificateModalProps) {
  const { setDocumentData } = useDocContext();
  const [studentData, setStudentData] = useState<any>(null);
  const [studentOptions, setStudentOptions] = useState<StudentSearchOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!opened) {
      setStudentData(null);
      setStudentOptions([]);
    }
  }, [opened]);

  const handleStudentSearch = async (query: string) => {
    if (!query) {
      setStudentOptions([]);
      return;
    }

    setLoading(true);
    try {
      const results = await STUDENT_API.getStudents({ search: query });
      if (results) {
        const options = results.map((student: any) => ({
          value: String(student.id),
          label: `${student.first_name} ${student.last_name} (${student.student_code})`,
        }));
        setStudentOptions(options);
      }
    } catch (error) {
      console.error("Failed to search students", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = async (studentId: string) => {
    setLoading(true);
    try {
      const response = await STUDENT_API.getStudent(studentId);
      if (response?.data) {
        setStudentData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch student", error);
    } finally {
      setLoading(false);
    }
  };

  const mapStudentToCertificateData = (student: any): StudentCertificateData => {
    const grading = student.gradings?.[0] || {};
    const markings = (student.markings || []).map((m: any) => ({
      month: MONTH_OPTIONS[m.month - 1] || String(m.month),
      total_days: m.total_days,
      class_hr: parseFloat(m.class_hours) || 0,
      present: m.present,
      absent: m.absent,
      attendance_percentage: parseFloat(m.attendance_percent) || 0,
    }));

    const coursehour = markings.reduce((sum, m) => sum + m.class_hr, 0);

    return {
      firstname: student.first_name,
      middlename: student.middle_name,
      lastname: student.last_name,
      date_of_birth: student.date_of_birth,
      gender: student.gender === "Male" ? "Male" : "Female",
      address: student.current_address,
      date_of_admission: student.date_of_admission,
      date_of_completion: student.date_of_completion,
      issue: new Date().toISOString().split("T")[0],
      coursehour,
      grammar: grading.grammar || "A",
      listening: grading.listening || "A",
      conversation: grading.conversation || "A",
      reading: grading.reading || "A",
      composition: grading.composition || "A",
      studyType: 0,
      batch: student.batch || {
        course: { name: "", level: "", total_days: 0, books: [] },
        instructor: [],
      },
      marking: markings,
    };
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Edit Student Certificate"
      size="lg"
    >
      {!studentData ? (
        <Stack gap="md" p="md">
          <Select
            label="Search Student"
            placeholder="Type student name or code"
            searchable
            onSearchChange={handleStudentSearch}
            onChange={handleStudentSelect}
            data={studentOptions}
            disabled={loading}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={onClose} leftSection={<XIcon size={14} />} size="xs">
              Cancel
            </Button>
          </Group>
        </Stack>
      ) : (
        <FormHandler
          initial={(() => {
            const certData = mapStudentToCertificateData(studentData);
            return {
              firstname: certData.firstname,
              lastname: certData.lastname,
              gender: certData.gender,
              date_of_birth: certData.date_of_birth,
              address: certData.address,
              date_of_admission: certData.date_of_admission,
              date_of_completion: certData.date_of_completion,
              grammar: certData.grammar,
              listening: certData.listening,
              conversation: certData.conversation,
              reading: certData.reading,
              composition: certData.composition,
              issue: certData.issue,
              studyType: String(certData.studyType),
              coursehour: certData.coursehour,
              customBranch: certData.customBranch || "",
              customBranchNo: certData.customBranchNo || "",
              batchJson: JSON.stringify(certData.batch, null, 2),
            };
          })()}
          formType="new"
          validation={[{}]}
          apiSubmit={async (data) => {
            const certData = mapStudentToCertificateData(studentData);
            return {
              data: {
                ...certData,
                issue: data.issue,
                studyType: parseInt(data.studyType),
                coursehour: data.coursehour,
                customBranch: data.customBranch || undefined,
                customBranchNo: data.customBranchNo || undefined,
              },
            };
          }}
          onSubmitSuccess={(res) => {
            setDocumentData(res.data);
            if (onCreated) {
              onCreated();
            }
            onClose();
          }}
          triggerNotification={triggerNotification}
        >
          <StudentCertificateForm onClose={onClose} studentData={studentData} />
        </FormHandler>
      )}
    </Modal>
  );
}
