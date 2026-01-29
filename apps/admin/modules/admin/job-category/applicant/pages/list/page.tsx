"use client";

import { useRouter } from "next/navigation";
import { DataTableWrapper } from "@settle/core";
import { DataTableShell } from "@settle/admin";
import { APPLICANT_MODULE_CONFIG, APPLICANT_API } from "../../module.config";
import { applicantListColumns } from "./list.columns";

export function ListPage() {
  const router = useRouter();

  return (
    <DataTableWrapper
      queryKey="applicant.list"
      queryGetFn={async () => {
        const response = await APPLICANT_API.getApplicants();
        return {
          data: response?.data || [],
        };
      }}
      dataKey="data"
    >
      <DataTableShell
        moduleInfo={APPLICANT_MODULE_CONFIG}
        columns={applicantListColumns}
        idAccessor="id"
        newButtonHref="/admin/applicant/new"
        filterList={[]}
        onEditClick={(id) => {
          router.push(`/admin/applicant/${id}/edit`);
        }}
        onReviewClick={(id) => {
          router.push(`/admin/applicant/${id}`);
        }}
        onDeleteClick={async (ids) => {
          // Handle single or multiple deletions
          const idArray = Array.isArray(ids) ? ids : [ids];
          for (const id of idArray) {
            await APPLICANT_API.deleteApplicant(String(id));
          }
        }}
      />
    </DataTableWrapper>
  );
}
