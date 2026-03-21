"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Divider } from "@mantine/core";
import { DataTableWrapper } from "@settle/core";
import { DataTableShell } from "@settle/admin";
import { AUDIT_LOGS_MODULE_CONFIG, AUDIT_LOG_API } from "../../module.config";
import { auditLogColumns, filterList } from "./list.columns";
import { StudentFilterBanner } from "./components/StudentFilterBanner";
import { STUDENT_API } from "../../../module.api";

export function ListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get student ID and name from URL params
  const studentId = searchParams.get("student");
  const studentCode = searchParams.get("student_code");

  // Fetch student info if studentId is provided
  const { data: studentInfo } = useQuery({
    queryKey: ["student", studentId],
    queryFn: async () => {
      if (!studentId) return null;
      const res = await STUDENT_API.getStudent(studentId);
      return res?.data;
    },
    enabled: !!studentId,
  });

  return (
    <>
      <StudentFilterBanner
        studentId={studentId}
        studentCode={studentCode || studentInfo?.student_code || ""}
        studentName={studentInfo?.full_name || ""}
      />
      {studentId && <Divider />}
      <DataTableWrapper
        queryKey={`audit-logs.list.${studentId ?? "all"}`}
        enableServerQuery={true}
        queryGetFn={async (params) => {
          if (studentId) {
            return AUDIT_LOG_API.getAuditLogs({
              ...params,
              student: studentId,
            });
          }
          return AUDIT_LOG_API.getAuditLogs(params);
        }}
        dataKey="data"
        paginationDataKey="pagination"
      >
        <DataTableShell
          moduleInfo={AUDIT_LOGS_MODULE_CONFIG}
          customHeading={studentId ? `Audit Logs - ${studentInfo?.full_name || ""}` : "Audit Logs"}
          columns={auditLogColumns}
          idAccessor="id"
          filterList={studentId ? [] : filterList}
          disableActions={true}
          hasServerSearch={true}
        />
      </DataTableWrapper>
    </>
  );
}
