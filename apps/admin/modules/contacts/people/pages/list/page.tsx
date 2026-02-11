"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import { PERSON_MODULE_CONFIG, PERSON_API } from "../../module.config";
import { PersonForm } from "../../form/PersonForm";
import { columns } from "./list.column";

export function ListPage() {
    return (
        <DataTableWrapper
            queryKey="person.list"
            queryGetFn={PERSON_API.getPeople}
            dataKey="results"
        >
            <DataTableModalShell
                moduleInfo={PERSON_MODULE_CONFIG}
                columns={columns}
                idAccessor="id"
                filterList={[]}

                // API Handlers
                onCreateApi={async (data) => {
                    const response = await PERSON_API.createPerson(data);
                    return response.data;
                }}
                onEditApi={async (id, data) => {
                    const response = await PERSON_API.updatePerson(String(id), data);
                    return response.data;
                }}
                onDeleteApi={async (id) => {
                    await PERSON_API.deletePerson(String(id));
                }}

                // Forms
                createFormComponent={<PersonForm />}
                editFormComponent={<PersonForm />}

                modalWidth="lg"
            />
        </DataTableWrapper>
    );
}
