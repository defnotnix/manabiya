# Agenda Module

A sustained module for managing agendas with modal-based CRUD operations.

## Overview

This is a sustained module where all CRUD operations happen on a single page using modals and inline forms. The agenda module handles:
- Creating new agendas
- Editing existing agendas
- Deleting agendas
- Filtering and searching

## Module Structure

```
agenda/
├── module.config.ts          # Configuration & API re-export
├── module.api.ts             # API endpoints
├── form/
│   └── AgendaForm.tsx        # Reusable form component
├── pages/
│   └── list/
│       └── page.tsx          # Single list page with modals
├── index.ts                  # Module exports
└── README.md                 # This file
```

## Fields

- **Title** (required) - Agenda title
- **Description** (required) - Detailed description
- **District** (required) - Selected from districts dropdown
- **Status** (required) - pending, approved, or rejected

## API Endpoints

- `GET /agendas` - List all agendas
- `GET /agendas/{id}` - Get single agenda
- `POST /agendas` - Create new agenda
- `PATCH /agendas/{id}` - Update agenda
- `DELETE /agendas/{id}` - Delete agenda
- `GET /districts` - Get districts for dropdown

## Usage

### Import ListPage
```typescript
import { ListPage } from "@/modules/admin/agenda";
```

### Import API
```typescript
import { AGENDA_API } from "@/modules/admin/agenda";

// Create agenda
const response = await AGENDA_API.createAgenda({
  title: "Infrastructure",
  description: "...",
  district: { id: "...", name: "..." },
  status: "pending"
});
```

### Import Form
```typescript
import { AgendaForm } from "@/modules/admin/agenda";
```

## Features

✅ Modal-based create/edit forms  
✅ Delete confirmation dialogs  
✅ Auto-refresh after operations  
✅ Status badges with colors  
✅ District dropdown  
✅ Table with filtering  
✅ Responsive design  

## Navigation

The module is accessible at `/admin/agenda` and appears in the main navigation as "Agendas".

## Related Documentation

- [Sustained Module Architecture](../../../usage_docs/SUSTAINED-MODULE-ARCHITECTURE.md)
- [DataTableModalShell Usage](../../../usage_docs/settle-admin/DataTableModalShell.md)
