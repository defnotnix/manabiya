"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import { PARTY_MODULE_CONFIG, PARTY_API } from "../../module.config";
import { PartyForm } from "../../form/PartyForm";
import { columns } from "./list.column";

export function ListPage() {
    return (
        <DataTableWrapper
            queryKey="party.list"
            queryGetFn={PARTY_API.getParties}
            dataKey="results"
        >
            <DataTableModalShell
                moduleInfo={PARTY_MODULE_CONFIG}
                columns={columns}
                idAccessor="id"
                filterList={[
                    { label: "Abbreviation", value: "abbrev" },
                    { label: "Leader", value: "leader_name" },
                    { label: "Founded Year", value: "founded_year" },
                ]}

                // API Handlers
                onCreateApi={async (data) => {
                    const response = await PARTY_API.createParty(data);
                    return response.data;
                }}
                onEditApi={async (id, data) => {
                    const response = await PARTY_API.updateParty(String(id), data);
                    return response.data;
                }}
                onDeleteApi={async (id) => {
                    await PARTY_API.deleteParty(String(id));
                }}

                // Forms
                createFormComponent={<PartyForm />}
                editFormComponent={<PartyForm />}

                modalWidth="lg"
            />
        </DataTableWrapper>
    );
}
