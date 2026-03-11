"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Container,
  Stack,
  Tabs,
  Loader,
  Center,
  Alert,
} from "@mantine/core";
import { STUDENT_API } from "../../module.config";
import { ProfileHeader } from "./sections/ProfileHeader";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { ContactSection } from "./sections/ContactSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { EducationSection } from "./sections/EducationSection";
import { FamilySection } from "./sections/FamilySection";
import { GradingSection } from "./sections/GradingSection";
import { MarkingSection } from "./sections/MarkingSection";
import { AuditLogSection } from "./sections/AuditLogSection";
import { LockedStudentBanner } from "../../components/LockedStudentBanner";

export function ViewPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: student, isLoading } = useQuery({
    queryKey: ["student", id],
    queryFn: async () => {
      const response = await STUDENT_API.getStudent(id);
      return response?.data;
    },
  });

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  if (!student) {
    return (
      <Center h="100vh">
        <Alert color="red" title="Error">
          Student not found.
        </Alert>
      </Center>
    );
  }

  const isLocked = student.locked;

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        {isLocked && (
          <LockedStudentBanner
            studentId={id}
            lockedBy={student.locked_by}
            lockedAt={student.locked_at}
          />
        )}

        <ProfileHeader student={student} />

        <Tabs defaultValue="overview">
          <Tabs.List>
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
            <Tabs.Tab value="experience">Experience</Tabs.Tab>
            <Tabs.Tab value="education">Education</Tabs.Tab>
            <Tabs.Tab value="family">Family</Tabs.Tab>
            <Tabs.Tab value="grades">Grades</Tabs.Tab>
            <Tabs.Tab value="attendance">Attendance</Tabs.Tab>
            <Tabs.Tab value="audit">Audit Log</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="overview" pt="md">
            <Stack gap="lg">
              <BasicInfoSection student={student} />
              <ContactSection student={student} />
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="experience" pt="md">
            <ExperienceSection studentId={id} isLocked={isLocked} />
          </Tabs.Panel>

          <Tabs.Panel value="education" pt="md">
            <EducationSection studentId={id} isLocked={isLocked} />
          </Tabs.Panel>

          <Tabs.Panel value="family" pt="md">
            <FamilySection studentId={id} isLocked={isLocked} />
          </Tabs.Panel>

          <Tabs.Panel value="grades" pt="md">
            <GradingSection studentId={id} isLocked={isLocked} />
          </Tabs.Panel>

          <Tabs.Panel value="attendance" pt="md">
            <MarkingSection studentId={id} isLocked={isLocked} />
          </Tabs.Panel>

          <Tabs.Panel value="audit" pt="md">
            <AuditLogSection studentId={id} />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
