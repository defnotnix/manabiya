"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button, Group, ActionIcon, Tooltip, Divider } from "@mantine/core";
import { BookOpenIcon, LockIcon, LockOpenIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { DataTableWrapper } from "@settle/core";
import { DataTableShell } from "@settle/admin";
import { STUDENT_MODULE_CONFIG, STUDENT_API } from "../../module.config";
import { columns, filterList, tabs } from "./columns";
import { BatchFilterBanner } from "./components/BatchFilterBanner";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useIsAdmin } from "@/context/UserContext";

export function ListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const isAdmin = useIsAdmin();

  // Get batch ID and name from URL params
  const batchId = searchParams.get("batch");
  const batchName = searchParams.get("batch_name");

  const handleToggleLock = async (row: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setLoadingIds((prev) => new Set(prev).add(String(row.id)));
    try {
      await STUDENT_API.updateStudent(String(row.id), {
        locked: !row.locked,
      });
      // Refetch with both possible key formats
      await queryClient.refetchQueries({ queryKey: ["students.list"] });
      await queryClient.refetchQueries({ queryKey: ["students", "list"] });
    } catch (error) {
      console.error("Failed to toggle lock status:", error);
    } finally {
      setLoadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(String(row.id));
        return newSet;
      });
    }
  };

  // Add cell renderer to full_name and actions columns
  const columnsWithActions = columns.map((col: any) => {
    if (col.accessorKey === "student_code") {
      return {
        ...col,
        render: (row: any) => (
          <Button
            variant="subtle"
            size="xs"
            rightSection={<ArrowUpRightIcon size={14} />}
            onClick={() => router.push(`/admin/students/audit-logs?student=${row.id}`)}
          >
            {row.student_code}
          </Button>
        ),
      };
    }
    if (col.accessorKey === "full_name") {
      return {
        ...col,
        render: (row: any) => (
          <Group gap="xs" wrap="nowrap">

            <Tooltip label={row.locked ? "Click to unlock" : "Click to lock"}>
              <ActionIcon
                size="sm"
                variant={row.locked ? undefined : "subtle"}
                color={row.locked ? undefined : "gray"}
                onClick={(e) => handleToggleLock(row, e)}
                loading={loadingIds.has(String(row.id))}
              >
                {row.locked ? (
                  <LockIcon size={16} />
                ) : (
                  <LockOpenIcon size={16} />
                )}
              </ActionIcon>
            </Tooltip>

            <span>{row.full_name}</span>

          </Group>
        ),
      };
    }
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
              Review
            </Button>
          </Group>
        ),
      };
    }
    return col;
  });

  return (
    <>
      <BatchFilterBanner batchName={batchName} />
      <Divider />
      <DataTableWrapper
        queryKey={`students.list.${batchId ?? "all"}`}
        enableServerQuery={true}
        queryGetFn={async (params) => {
          if (batchId) {
            return await STUDENT_API.getBatchStudents(batchId, params);
          }
          return await STUDENT_API.getStudents(params);
        }}
        dataKey="results"
        paginationDataKey="pagination"

      >
      <DataTableShell
        moduleInfo={STUDENT_MODULE_CONFIG}
        customHeading={batchName ? `Batch ${batchName}` : undefined}
        columns={columnsWithActions}
        idAccessor="id"
        tabs={tabs}
        filterList={filterList}
        hasServerSearch={true}
        newButtonHref={isAdmin ? `/admin/students/new${batchId ? `?batch=${batchId}&batch_name=${encodeURIComponent(batchName || "")}` : ""}` : undefined}
        disableEditButton={!isAdmin}
        disableDeleteButton={!isAdmin}
        onReviewClick={(record: any) => {
          router.push(`/admin/students/${record.id}`);
        }}
        onDeleteClick={isAdmin ? async (ids: any) => {
          const idArray = Array.isArray(ids) ? ids : [ids];
          for (const id of idArray) {
            await STUDENT_API.deleteStudent(String(id));
          }
          // Refetch data after deletion
          await queryClient.refetchQueries({ queryKey: ["students.list"] });
          await queryClient.refetchQueries({ queryKey: ["students", "list"] });
        } : undefined}
        rowStyle={(record: any) => ({
          backgroundColor: record.locked
            ? "rgba(18, 148, 255, 0.04)"
            : undefined,
        })}
      />
      </DataTableWrapper>
    </>
  );
}
