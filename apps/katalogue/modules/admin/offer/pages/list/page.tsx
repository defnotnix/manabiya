"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import { OFFER_MODULE_CONFIG, OFFER_API } from "../../module.config";
import { OfferForm } from "../../form/OfferForm";
import { offerFormConfig } from "../../form/form.config";
import { offerListColumns } from "./list.columns";

export function ListPage() {
  return (
    <DataTableWrapper
      queryKey="catalogue.offers.list"
      queryGetFn={OFFER_API.getOffers}
      enableServerQuery={true}
      dataKey="results"
      paginationDataKey="pagination"
    >
      <DataTableModalShell
        moduleInfo={OFFER_MODULE_CONFIG}
        columns={offerListColumns}
        idAccessor="id"
        filterList={[]}
        onCreateApi={async (data) => {
          const res = await OFFER_API.createOffer(data);
          if (res.err) throw new Error(res.error || "Failed to create");
          return res.data;
        }}
        onEditApi={async (id, data) => {
          const res = await OFFER_API.updateOffer(id, data);
          if (res.err) throw new Error(res.error || "Failed to edit");
          return res.data;
        }}
        onDeleteApi={async (id) => {
          const res = await OFFER_API.deleteOffer(id);
          if (res.err) throw new Error(res.error || "Failed to delete");
          return res.data;
        }}
        createFormComponent={<OfferForm />}
        editFormComponent={<OfferForm />}
        createFormConfig={offerFormConfig}
        editFormConfig={offerFormConfig}
        modalWidth="lg"
      />
    </DataTableWrapper>
  );
}
