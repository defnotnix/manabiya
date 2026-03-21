"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import { SIGNATURES_MODULE_CONFIG, SIGNATURE_API } from "../../module.config";
import { SignaturesForm } from "../../form/SignaturesForm";
import { signaturesFormConfig } from "../../form/form.config";
import { signaturesListColumns } from "./list.columns";
import { useIsAdmin } from "@/context/UserContext";

export function ListPage() {
  const isAdmin = useIsAdmin();

  // Transform for edit: only send file if it's a new File object, not the existing URL
  const transformOnEdit = (data: any) => {
    if (data instanceof FormData) {
      const signatureImage = data.get("signature_image");
      // If signature_image is a string (URL), remove it - keep existing image
      // Only keep it if it's a File object (newly selected)
      if (typeof signatureImage === "string") {
        data.delete("signature_image");
      }
    }
    return data;
  };

  return (
    <DataTableWrapper
        queryKey="signatures.list"
        queryGetFn={async () => {
          const response = await SIGNATURE_API.getSignatures();
          const filtered = response.data.filter((sig: any) => sig.is_active === true);
          return { data: filtered };
        }}
        dataKey="data"
      >
        <DataTableModalShell
          moduleInfo={SIGNATURES_MODULE_CONFIG}
          columns={signaturesListColumns}
          idAccessor="id"
          filterList={[]}
          onCreateApi={isAdmin ? async (data) => SIGNATURE_API.createSignature(data) : undefined}
          onEditApi={isAdmin ? async (id, data) => SIGNATURE_API.updateSignature(String(id), data) : undefined}
          onDeleteApi={isAdmin ? async (id) => SIGNATURE_API.inactivateSignature(String(id)) : undefined}
          createFormComponent={<SignaturesForm />}
          editFormComponent={<SignaturesForm />}
          createFormConfig={signaturesFormConfig}
          editFormConfig={signaturesFormConfig}
          transformOnEdit={isAdmin ? transformOnEdit : undefined}
          onEditTrigger={isAdmin ? async (row) => {
            const response = await SIGNATURE_API.getSignature(String(row.id));
            return response.data;
          } : undefined}
          modalWidth="lg"
          disableReviewButton={true}
        />
      </DataTableWrapper>
  );
}
