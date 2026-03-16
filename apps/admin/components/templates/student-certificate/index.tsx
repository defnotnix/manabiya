"use client";

import {
  ActionIcon,
  Box,
  Divider,
  Grid,
  Group,
  Image,
  Paper,
  Space,
  Stack,
  Table,
  Text,
  Center,
} from "@mantine/core";
import dayjs from "dayjs";
import { useDocContext, StudentCertificateData, CertificateMarkEntry } from "@/context/DocumentContext";
import { StudentCertMissingBanner } from "./MissingBanner";
import leafImage from "../../../assets/leaf.png";

const EMPTY_CERT: StudentCertificateData = {
  firstname: "",
  middlename: "",
  lastname: "",
  date_of_birth: "",
  gender: "Male",
  address: "",
  date_of_admission: "",
  date_of_completion: "",
  issue: "",
  coursehour: 0,
  grammar: "A",
  listening: "A",
  conversation: "A",
  reading: "A",
  composition: "A",
  studyType: 0,
  batch: {
    course: { name: "", level: "", total_days: 0, books: [] },
    instructor: [],
  },
  marking: [],
};

function GradeBox({ grade, value }: { grade: string; value: string }) {
  return (
    <ActionIcon
      size="xs"
      color="dark"
      variant={value === grade ? "outline" : "transparent"}
    >
      <Text fz={10}>{grade}</Text>
    </ActionIcon>
  );
}

const TableHeader = () => (
  <Table.Tr>
    <Table.Th style={{ textAlign: "center", width: 73 }}>
      Month
      <br />
      <span style={{ fontSize: 8 }}>(月)</span>
    </Table.Th>
    <Table.Th style={{ textAlign: "center" }}>
      Total Days
      <br />
      <span style={{ fontSize: 8 }}>(日数)</span>
    </Table.Th>
    <Table.Th style={{ textAlign: "center" }}>
      Class Hr.
      <br />
      <span style={{ fontSize: 6 }}>(授業時間)</span>
    </Table.Th>
    <Table.Th style={{ textAlign: "center" }}>
      Present Hr.
      <br />
      <span style={{ fontSize: 6 }}>(出席時間)</span>
    </Table.Th>
    <Table.Th style={{ textAlign: "center" }}>
      Absent Hr.
      <br />
      <span style={{ fontSize: 6 }}>(欠席時間)</span>
    </Table.Th>
    <Table.Th style={{ textAlign: "center" }}>
      Atted%
      <br />
      <span style={{ fontSize: 8 }}>(出席率)</span>
    </Table.Th>
  </Table.Tr>
);

interface CertificateProps {
  selectedInstructor: string | null;
  selectedDirector: string | null;
  signatures: Array<{ id: string; name: string }>;
}

export function TemplateStudentCertificate({
  selectedInstructor,
  selectedDirector,
  signatures,
}: CertificateProps) {
  const { documentData } = useDocContext();

  const d = documentData ?? EMPTY_CERT;

  const getInstructorName = () => {
    if (selectedInstructor) {
      const sig = signatures.find((s) => String(s.id) === selectedInstructor);
      return sig?.name ?? "";
    }
    return "";
  };

  const getDirectorName = () => {
    if (selectedDirector) {
      const sig = signatures.find((s) => String(s.id) === selectedDirector);
      return sig?.name ?? "";
    }
    return "";
  };

  const marking = d.marking ?? [];

  const totalDays = marking.reduce((s, m) => s + (m.total_days || 0), 0);
  const totalPresent = marking.reduce((s, m) => s + (m.present || 0), 0);

  const totalClassHours = totalDays * d.coursehour;
  const totalPresentHours = totalPresent * d.coursehour;
  const overallAttendancePct =
    totalDays > 0
      ? ((totalPresent / totalDays) * 100).toFixed(2)
      : "0.00";

  function formatDate(date: string) {
    if (!date) return "——";
    return dayjs(date).format("YYYY年MM月DD日");
  }

  function attendancePct(mark: (typeof marking)[0]) {
    if (!mark || mark.total_days === 0) return 0;
    if (mark.attendance_percentage === 100 || mark.attendance_percentage === 0) {
      return mark.attendance_percentage;
    }
    return ((mark.present / mark.total_days) * 100).toFixed(2);
  }

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Find the first month from the marking data
  let startMonth = 1;
  if (marking.length > 0) {
    const firstMarkingMonth = marking[0].month as string | number;
    if (typeof firstMarkingMonth === "string") {
      const parts = firstMarkingMonth.split("-");
      startMonth = parseInt(parts[parts.length - 1]);
    } else {
      startMonth = firstMarkingMonth;
    }
  }

  const allMonthsData = Array.from({ length: 12 }, (_, i) => {
    const monthNum = ((startMonth - 1 + i) % 12) + 1;
    const monthIndex = (startMonth - 1 + i) % 12;
    const markingData = marking.find((m) => {
      let mMonth: number;
      const monthValue = m.month as string | number;
      if (typeof monthValue === "string") {
        // Handle formats like "2026-11" or just "11"
        const parts = monthValue.split("-");
        mMonth = parseInt(parts[parts.length - 1]);
      } else {
        mMonth = monthValue;
      }
      return mMonth === monthNum;
    });
    return {
      month: monthNames[monthIndex],
      total_days: markingData?.total_days || 0,
      class_hr: markingData?.class_hr || 0,
      present: markingData?.present || 0,
      absent: markingData?.absent || 0,
      attendance_percentage: typeof markingData?.attendance_percentage === "string"
        ? parseFloat(markingData.attendance_percentage)
        : markingData?.attendance_percentage || 0,
    } as CertificateMarkEntry;
  });

  const firstHalf = allMonthsData.slice(0, 6);
  const secondHalf = allMonthsData.slice(6, 12);

  const grades = ["A", "B", "C", "D"];

  return (
    <>
      <Paper
        radius={0}
        style={{
          position: "relative",
          width: "8.3in",
          minHeight: "11.7in",
          padding: "12mm",
          background: "white",
          color: "black",
          overflow:"hidden"
        }}
      >
        {/* Header */}
        <Group justify="space-between">
          <Group>
            <Box
              w={100}
              h={100}
              style={{
                background: "var(--mantine-color-gray-2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text size="xs" c="dimmed" ta="center">Logo</Text>
            </Box>
            <Stack gap={2}>
              <Text fw={600} size="sm" style={{ lineHeight: 1.2 }}>
                MANABIYA NEPAL
                <br />
                INSTITUTIONS CONSULTANCY PVT. LTD.
              </Text>
              <Text fz={10} c="dimmed">
                Head Office : New Plaza, Putalisadak, Kathmandu, Nepal
              </Text>
              {d.customBranch && (
                <Text fz={10} c="dimmed">{d.customBranch}</Text>
              )}
            </Stack>
          </Group>

          <Stack gap={2} align="flex-end">
            <Text fz={10} c="dimmed" ta="right">
              PAN : 610292682 | Reg. No : 291521/78/079
            </Text>
            <Text fz={10} ta="right">
              manabiyanepal.com.np
              <br />
              info@manabiyanepal.com.np
              <br />
              +977 9851338205 , +977 15917178
              {d.customBranchNo && (
                <>
                  <br />
                  Branch : {d.customBranchNo}
                </>
              )}
            </Text>
          </Stack>
        </Group>

        <Divider my={16} />

        {/* Student info + photo */}
        <Grid>
          <Grid.Col span={9}>
            <Text size="sm" fw={600} mb="xs">
              日本語学習証明書 (Japanese Language Certificate)
            </Text>

            <Space h={16} />

            <Grid gutter={4}>
              <Grid.Col span={12}>
                <Text fz={10}>
                  <b>発行日 (Issued date) :</b> {formatDate(d.issue)}
                </Text>
              </Grid.Col>
              <Grid.Col span={12}>
                <Text fz={10}>
                  <b>
                    氏名 (Name) : {d.firstname} {d.middlename ?? ""}{" "}
                    {d.lastname}
                  </b>
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text fz={10}>
                  <b>生年月日 (Date of birth) :</b>{" "}
                  {formatDate(d.date_of_birth)}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text fz={10}>
                  <b>性別 (Gender)：{d.gender === "Male" ? "男" : "女"}</b>{" "}
                  ({d.gender})
                </Text>
              </Grid.Col>
              <Grid.Col span={12}>
                <Text fz={10}>
                  <b>現住所 (Current Address) : </b> {d.address}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text fz={10}>
                  <b>入学(Admission) : </b> {formatDate(d.date_of_admission)}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text fz={10}>
                  <b>修了(Completion) :</b>{" "}
                  {formatDate(d.date_of_completion)}
                </Text>
              </Grid.Col>
              <Grid.Col span={12}>
                <Text fz={10}>
                  <b>コース名(Course name) :</b>{" "}
                  {d.batch.course?.name ?? ""}
                </Text>
              </Grid.Col>
              <Grid.Col span={12}>
                <Text fz={10}>
                  <b>使用教材(Textbook) : </b>{" "}
                  {d.batch.course?.books?.map((b) => b.name).join(", ") ?? ""}
                </Text>
              </Grid.Col>
              <Grid.Col span={12}>
                <Text fz={10} fw={600}>
                  履修内容：文法(Grammar)、会話(Conversation)、聴解(Listening)、読解(Reading)、作文(Composition)
                  <br />
                  コース時間(Total Course Hour) :{" "}
                  {(d.batch.course?.total_days ?? 0) * d.coursehour} Hours
                  ({d.coursehour} Hours per Day)
                  <br />
                  目標レベル(Target level) : {d.batch.course?.level ?? ""}
                </Text>
              </Grid.Col>
            </Grid>
          </Grid.Col>

          <Grid.Col span={3}>
            <Group justify="flex-end">
              {d.image ? (
                <Image h="45mm" w="35mm" src={d.image} alt="Student photo" />
              ) : (
                <Box
                  w="35mm"
                  h="45mm"
                  style={{
                    background: "#e8e8e8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text size="xs" c="dimmed" ta="center">Photo</Text>
                </Box>
              )}
            </Group>
          </Grid.Col>
        </Grid>

        {/* Attendance Summary */}
        <Grid mt="sm">
          <Grid.Col span={12}>
            <Text fz={10} fw={600} mt="xs">
              出席概要 (Attendance Summary)
            </Text>
          </Grid.Col>

          <Grid.Col span={6}>
            <Table verticalSpacing={4} fz={9} withTableBorder withColumnBorders>
              <Table.Thead style={{ background: "#f0f0f0", color: "black" }}>
                <TableHeader />
              </Table.Thead>
              <Table.Tbody>
                {firstHalf.map((mark, i) => (
                  <Table.Tr key={i}>
                    <Table.Td>{mark.month}</Table.Td>
                    <Table.Td>{mark.total_days}</Table.Td>
                    <Table.Td>{mark.class_hr * mark.total_days}</Table.Td>
                    <Table.Td>{mark.present * d.coursehour}</Table.Td>
                    <Table.Td>{mark.absent * d.coursehour}</Table.Td>
                    <Table.Td>{attendancePct(mark)}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Grid.Col>

          <Grid.Col span={6}>
            <Table verticalSpacing={4} fz={9} withTableBorder withColumnBorders>
              <Table.Thead style={{ background: "#f0f0f0", color: "black" }}>
                <TableHeader />
              </Table.Thead>
              <Table.Tbody>
                {secondHalf.map((mark, i) => (
                  <Table.Tr key={i}>
                    <Table.Td>{mark.month}</Table.Td>
                    <Table.Td>{mark.total_days}</Table.Td>
                    <Table.Td>{mark.class_hr * mark.total_days}</Table.Td>
                    <Table.Td>{mark.present * d.coursehour}</Table.Td>
                    <Table.Td>{mark.absent * d.coursehour}</Table.Td>
                    <Table.Td>{attendancePct(mark)}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Grid.Col>

          <Grid.Col span={12}>
            <Table verticalSpacing={4} fz={9} withTableBorder withColumnBorders>
              <Table.Thead style={{ background: "#f0f0f0", color: "black" }}>
                <Table.Tr>
                  <Table.Th style={{ textAlign: "center" }}>
                    Total Class Hours Until Certificate Issued Date
                    <br />
                    本証書発行時点までの総授業時間
                  </Table.Th>
                  <Table.Th style={{ textAlign: "center" }}>
                    Total Attendance Hours Until Certificate Issued Date
                    <br />
                    本証書発行時点までの実学時間
                  </Table.Th>
                  <Table.Th style={{ textAlign: "center" }}>
                    Attendance %<br />
                    出席率
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td style={{ textAlign: "center" }}>{totalClassHours}</Table.Td>
                  <Table.Td style={{ textAlign: "center" }}>{totalPresentHours}</Table.Td>
                  <Table.Td style={{ textAlign: "center" }}>{overallAttendancePct} %</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Grid.Col>
        </Grid>

        {/* Grading Evaluation */}
        <Text fz={10} fw={600} mt="xl">
          成歓評価(Grading Evaluation)
        </Text>

        <Table verticalSpacing={4} mt="xs" fz={10} withTableBorder withColumnBorders>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td><Text fz={10} fw={600}>文法(Grammar)</Text></Table.Td>
              <Table.Td>
                <Group gap={4}>
                  {grades.map((g) => <GradeBox key={g} grade={g} value={d.grammar} />)}
                </Group>
              </Table.Td>
              <Table.Td><Text fz={10} fw={600}>聴解(Listening)</Text></Table.Td>
              <Table.Td>
                <Group gap={4}>
                  {grades.map((g) => <GradeBox key={g} grade={g} value={d.listening} />)}
                </Group>
              </Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td><Text fz={10} fw={600}>会話(Conversation)</Text></Table.Td>
              <Table.Td>
                <Group gap={4}>
                  {grades.map((g) => <GradeBox key={g} grade={g} value={d.conversation} />)}
                </Group>
              </Table.Td>
              <Table.Td><Text fz={10} fw={600}>読解(Reading)</Text></Table.Td>
              <Table.Td>
                <Group gap={4}>
                  {grades.map((g) => <GradeBox key={g} grade={g} value={d.reading} />)}
                </Group>
              </Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td><Text fz={10} fw={600}>作文(Composition)</Text></Table.Td>
              <Table.Td>
                <Group gap={4}>
                  {grades.map((g) => <GradeBox key={g} grade={g} value={d.composition} />)}
                </Group>
              </Table.Td>
              <Table.Td />
              <Table.Td />
            </Table.Tr>
          </Table.Tbody>
        </Table>

        {/* Legend + Study status */}
        <Text component="div" fz={10} my="md" style={{ lineHeight: 1.2 }}>
          <Group justify="space-between">
            <Group gap="xs">
              <div><b>A</b> - 優(Excellent)</div>
              <div><b>B</b> - 良(Good)</div>
              <div><b>C</b> - 可(Fair)</div>
              <div><b>D</b> - 不可(Poor)</div>
            </Group>
            <div>
              上記の通り、当校で
              <span
                style={
                  d.studyType === 0
                    ? { padding: 5, borderRadius: 999, display: "inline-block", border: "1px solid black" }
                    : {}
                }
              >
                履修している
              </span>
              ・
              <span
                style={
                  d.studyType === 1
                    ? { padding: 5, borderRadius: 999, display: "inline-block", border: "1px solid black" }
                    : {}
                }
              >
                履修した
              </span>
              事を証明致します。
            </div>
          </Group>
        </Text>

        {/* Notice */}
        <Box pl={14} mt="sm">
          <ul style={{ color: "red" }}>
            <li>
              <Text fz={10} fw={600} c="red">
                本校が定める休校日に授業はおこなわれない (Class will not be held
                on public holidays and school holidays designated by our school.)
              </Text>
            </li>
          </ul>
        </Box>

        {/* Signatures */}
        <Grid style={{ position: "relative" }}>
          <Grid.Col span={3}>
            <Box style={{ position: "relative" }}>
              <Space h={64} />
              {getInstructorName() && (
                <Text
                  fz={10}
                  fw={600}
                  ta="center"
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    left: 0,
                    right: 0,
                    marginBottom: "4px",
                  }}
                >
                  {getInstructorName()}
                </Text>
              )}
              <Divider mb="xs" />
              <Text fz={10} ta="center">教師</Text>
              <Text fz={10} ta="center">Instructor</Text>
            </Box>
          </Grid.Col>

          <Grid.Col span={3}>
            <Box style={{ position: "relative" }}>
              <Space h={64} />
              {getDirectorName() && (
                <Text
                  fz={10}
                  fw={600}
                  ta="center"
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    left: 0,
                    right: 0,
                    marginBottom: "4px",
                  }}
                >
                  {getDirectorName()}
                </Text>
              )}
              <Divider mb="xs" />
              <Text fz={10} ta="center">社長</Text>
              <Text fz={10} ta="center">Managing Director</Text>
            </Box>
          </Grid.Col>

          <Grid.Col span={3} />

          <Grid.Col span={3}>
            <Space h={64} />
            <Divider mb="xs" />
            <Text fz={10} ta="center">学校印</Text>
            <Text fz={10} fw={600} ta="center">School Stamp</Text>
          </Grid.Col>

          <Grid.Col span={12}>
            <Text mt={4} fz={10} ta="center" c="dimmed">
              Branch Office: Chitwan / Butwal / Simara / Surkhet / Jhapa
            </Text>
          </Grid.Col>

          <Box
            style={{
              position: "absolute",
              bottom: -150,
              right: -150,
              height: 500,
              width: 500,
              opacity: 0.05,
              backgroundImage: `url(${leafImage.src})`,
              backgroundSize: "cover",
              borderRadius: "50%",
              zIndex: 0,
            }}
          />
        </Grid>
      </Paper>

    </>
  );
}
