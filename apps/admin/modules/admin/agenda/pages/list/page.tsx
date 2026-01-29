"use client";

import { DataTableWrapper } from "@settle/core";
import { AutoBreadcrumb, DataTableModalShell } from "@settle/admin";
import { AGENDA_MODULE_CONFIG, AGENDA_API } from "../../module.config";
import { AgendaForm } from "../../form/AgendaForm";
import { agendaListColumns } from "./list.columns";
import { agendaFormConfig } from "../../form/form.props";

export function ListPage() {
  return (
    <DataTableWrapper
      queryKey="agenda.list"
      queryGetFn={async () => {
        return AGENDA_API.getAgendas();
      }}
      dataKey="results"
    >
      <AutoBreadcrumb />
      <DataTableModalShell
        tabs={[
          {
            label: "All Agendas",
          },
          {
            label: "My Agendas",
          },
          {
            label: "Active",
          },
          {
            label: "Completed",
          },
          {
            label: "Paused",
          },
          {
            label: "Drafts",
          },
        ]}
        moduleInfo={AGENDA_MODULE_CONFIG}
        columns={agendaListColumns}
        idAccessor="id"
        filterList={[]}
        // Modal API handlers
        onCreateApi={async (data) => {
          return AGENDA_API.createAgenda(data);
        }}
        onEditApi={async (id, data) => {
          return AGENDA_API.updateAgenda(String(id), data);
        }}
        onDeleteApi={async (id) => {
          await AGENDA_API.deleteAgenda(String(id));
        }}
        // Form components - now using function to receive currentStep
        createFormComponent={({ currentStep }) => (
          <AgendaForm currentStep={currentStep} isCreate />
        )}
        editFormComponent={({ currentStep }) => (
          <AgendaForm currentStep={currentStep} isCreate={false} />
        )}
        // Modal configuration
        modalWidth="lg"
        createModalTitle="Create New Agenda"
        editModalTitle="Edit Agenda"
        // Multi-step form configuration
        createFormConfig={agendaFormConfig}
        editFormConfig={agendaFormConfig}
      />
    </DataTableWrapper>
  );
}
