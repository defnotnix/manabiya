"use client";

import { useRouter } from "next/navigation";
import { DataTableWrapper } from "@settle/core";
import { DataTableShell } from "@settle/admin";
import { STUDENT_MODULE_CONFIG, STUDENT_API } from "../../module.config";
import { columns, filterList, tabs } from "./columns";

export function ListPage() {
  const router = useRouter();

  return (
    <DataTableWrapper
      queryKey="students.list"
      enableServerQuery={true}
      queryGetFn={async (params) => {
        const response = await STUDENT_API.getStudents(params);
        return response?.data || [];
      }}
      dataKey="results"
      paginationDataKey="pagination"
    >
      <DataTableShell
        moduleInfo={STUDENT_MODULE_CONFIG}
        columns={columns}
        idAccessor="id"
        tabs={tabs}
        filterList={filterList}
        hasServerSearch={true}
        newButtonHref="/admin/students/new"
        onEditClick={(record: any) => {
          router.push(`/admin/students/${record.id}/edit`);
        }}
        onReviewClick={(record: any) => {
          router.push(`/admin/students/${record.id}`);
        }}
        onDeleteClick={async (ids: any) => {
          const idArray = Array.isArray(ids) ? ids : [ids];
          for (const id of idArray) {
            await STUDENT_API.deleteStudent(String(id));
          }
        }}
        rowStyle={(record: any) => ({
          backgroundColor: record.locked
            ? "var(--mantine-color-orange-0)"
            : undefined,
        })}
      />
    </DataTableWrapper>
  );
}
