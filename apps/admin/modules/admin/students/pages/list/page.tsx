"use client";

import { useRouter } from "next/navigation";
import { Button, Group } from "@mantine/core";
import { BookOpenIcon } from "@phosphor-icons/react";
import { DataTableWrapper } from "@settle/core";
import { DataTableShell } from "@settle/admin";
import { STUDENT_MODULE_CONFIG, STUDENT_API } from "../../module.config";
import { columns, filterList, tabs } from "./columns";

export function ListPage() {
  const router = useRouter();

  // Add cell renderer to actions column
  const columnsWithActions = columns.map((col: any) => {
    if (col.accessorKey === "actions") {
      return {
        ...col,
        render: (row: any) => (
          <Group gap="xs">
            <Button
              variant="subtle"
              size="xs"
              leftSection={<BookOpenIcon size={16} />}
              onClick={() => router.push(`/admin/docs?student_id=${row.id}`)}
            >
              View Docs
            </Button>
          </Group>
        ),
      };
    }
    return col;
  });

  return (
    <DataTableWrapper
      queryKey="students.list"
      enableServerQuery={true}
      queryGetFn={async (params) => {
        return await STUDENT_API.getStudents(params);
      }}
      dataKey="results"
      paginationDataKey="pagination"

    >
      <DataTableShell

        moduleInfo={STUDENT_MODULE_CONFIG}
        columns={columnsWithActions}
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
