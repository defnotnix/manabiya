# Agenda Module - Complete Setup Guide

## Overview

The Agenda Module is a **Sustained Module** implementation for managing agendas in the admin-test app. All CRUD operations happen on a single page using modal forms.

## What's Been Set Up

### ✅ Module Structure
```
apps/admin-test/
├── modules/admin/agenda/
│   ├── module.config.ts          # Configuration & API re-export
│   ├── module.api.ts             # API calls (CRUD + districts)
│   ├── form/
│   │   └── AgendaForm.tsx        # Form component
│   ├── pages/
│   │   └── list/
│   │       └── page.tsx          # List page with DataTableModalShell
│   ├── index.ts                  # Module exports
│   └── README.md                 # Module docs
└── app/admin/
    └── agenda/
        └── page.tsx              # Routing page
```

### ✅ Navigation Integration
- Added "Agendas" to `config/nav/navs/main-nav.tsx`
- Uses ClipboardIcon from Phosphor Icons
- Appears in main navigation sidebar

### ✅ URL Access
- Route: `/admin/agenda`
- Navigation: Click "Agendas" in sidebar

## Features

### List Page
- **DataTableShell with Modal Integration** - Uses DataTableModalShell
- **Columns:**
  - Title - Agenda title
  - District - District name
  - Status - Color-coded badge (pending/approved/rejected)
  - Submitted By - Submitter name
  - View Count - Number of views
  - Solution Count - Number of solutions
  - Created - Creation date

### Modal Forms
- **Create Modal:**
  - Opens when user clicks "New"
  - Title: "NEW AGENDA"
  - Fields: Title, Description, District, Status

- **Edit Modal:**
  - Opens when user clicks on a row
  - Title: "EDIT AGENDA"
  - Pre-populated with current values

- **Delete Confirmation:**
  - Shows confirmation dialog
  - Confirms before deletion

### Form Fields
```
Title          TextInput    Required
Description    Textarea     Required
District       Select       Required (fetched from /api/districts)
Status         Select       Required (pending, approved, rejected)
```

## API Endpoints

The module communicates with:

```
GET     /agendas              List all agendas
GET     /agendas/{id}         Get single agenda
POST    /agendas              Create new agenda
PATCH   /agendas/{id}         Update agenda
DELETE  /agendas/{id}         Delete agenda
GET     /districts            Get districts for dropdown
```

## Data Structure

### Agenda Object
```json
{
  "id": "uuid",
  "title": "Road Infrastructure Issue",
  "description": "...",
  "district": {
    "id": "uuid",
    "name": "Kathmandu"
  },
  "scope": "district",
  "scope_display": "जिल्ला (District)",
  "status": "approved",
  "submitted_by": {
    "id": "uuid",
    "full_name": "Ram Sharma"
  },
  "view_count": 1250,
  "solution_count": 5,
  "created_at": "2026-01-01T00:00:00Z"
}
```

## Usage Examples

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
  description: "Road infrastructure issues",
  district: { id: "uuid", name: "Kathmandu" },
  status: "pending"
});

// Update agenda
await AGENDA_API.updateAgenda(id, {
  title: "Updated Title",
  status: "approved"
});

// Delete agenda
await AGENDA_API.deleteAgenda(id);

// Get districts for dropdown
const districts = await AGENDA_API.getDistricts();
```

### Import Form
```typescript
import { AgendaForm } from "@/modules/admin/agenda";
```

## How It Works

### User Flow

1. **View Agendas**
   - User navigates to /admin/agenda
   - Table displays all agendas
   - Each row shows agenda info with status badge

2. **Create Agenda**
   - Click "New" button
   - Modal opens with empty form
   - Fill title, description, select district and status
   - Click "Submit"
   - Modal closes, table auto-refetches

3. **Edit Agenda**
   - Click on agenda row or edit button
   - Modal opens with pre-filled form
   - Update any field
   - Click "Submit"
   - Modal closes, table auto-refetches

4. **Delete Agenda**
   - Click delete button
   - Confirmation modal shows
   - Click "Delete" to confirm
   - Item deleted, table auto-refetches

### Technical Flow

```
ListPage
  ↓
DataTableWrapper (manages data, pagination, filters)
  ↓
DataTableModalShell
  ├─ DataTableShell (renders table)
  └─ ModalHandler (manages create/edit modals)
      └─ AgendaForm (form fields)
          └─ FormWrapper (form state, validation, submission)
```

## Component Hierarchy

```
ListPage (pages/list/page.tsx)
  └─ DataTableWrapper
      └─ DataTableModalShell
          ├─ DataTableShell (table display)
          │   └─ Columns with custom renders
          └─ Modal Handler
              ├─ Create Modal
              │   └─ FormWrapper + AgendaForm
              └─ Edit Modal
                  └─ FormWrapper + AgendaForm
```

## Customization Guide

### Add New Column
Edit `pages/list/page.tsx` - add to columns array:
```typescript
{
  accessor: "field_name",
  header: "Column Header",
  size: 150,
  render: (row: any) => row.field_name || "-",
}
```

### Add Filter
Edit `pages/list/page.tsx` - update filterList:
```typescript
filterList={[
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "pending", label: "Pending" },
      { value: "approved", label: "Approved" },
    ],
  },
]}
```

### Change Modal Width
Edit `pages/list/page.tsx`:
```typescript
<DataTableModalShell
  modalWidth="xl"  // sm, md, lg, xl
  // ... other props
/>
```

### Add Form Validation
Edit `form/AgendaForm.tsx` - update field props:
```typescript
<TextInput
  label="Title"
  {...form.getInputProps("title")}
  required
  minLength={3}
  error={form.errors.title}
/>
```

## Documentation References

### Sustained Module Architecture
📖 `usage_docs/SUSTAINED-MODULE-ARCHITECTURE.md`
- Complete pattern guide
- Best practices
- Quick setup guide for future modules
- Navigation setup instructions

### DataTableModalShell API
📖 `usage_docs/settle-admin/DataTableModalShell.md`
- Complete component API reference
- Props documentation
- Usage patterns
- Column definition guide
- Form integration examples

### Module README
📖 `modules/admin/agenda/README.md`
- Module-specific documentation
- API endpoints
- Usage examples

## Testing the Module

1. **Start Development Server**
   ```bash
   cd apps/admin-test
   npm run dev
   ```

2. **Navigate to Module**
   - Go to `http://localhost:3000/admin/agenda`
   - Or click "Agendas" in sidebar

3. **Test Create**
   - Click "New"
   - Fill form
   - Click "Submit"
   - Verify table updates

4. **Test Edit**
   - Click on agenda row
   - Update fields
   - Click "Submit"
   - Verify changes reflected

5. **Test Delete**
   - Click delete button
   - Confirm deletion
   - Verify removed from table

## Architecture Pattern

This is a **Sustained Module** - characterized by:

✅ Single page (list page)
✅ Modal-based CRUD forms
✅ No separate routes for new/edit
✅ Auto-refresh after operations
✅ All operations on one page
✅ Simpler than structured modules
✅ Perfect for simple CRUD operations

## File Locations Summary

| File | Location |
|------|----------|
| Module Config | `modules/admin/agenda/module.config.ts` |
| API Layer | `modules/admin/agenda/module.api.ts` |
| Form Component | `modules/admin/agenda/form/AgendaForm.tsx` |
| List Page | `modules/admin/agenda/pages/list/page.tsx` |
| Module Exports | `modules/admin/agenda/index.ts` |
| Routing Page | `app/admin/agenda/page.tsx` |
| Navigation | `config/nav/navs/main-nav.tsx` |
| Module README | `modules/admin/agenda/README.md` |

## Next Steps

### If You Want to:

**Add More Fields to Form**
→ Edit `form/AgendaForm.tsx` and add form fields

**Change Table Display**
→ Edit `pages/list/page.tsx` and modify columns

**Add Filters**
→ Edit `pages/list/page.tsx` and configure filterList

**Change Modal Appearance**
→ Edit `pages/list/page.tsx` and update DataTableModalShell props

**Create Similar Module**
→ Follow the Sustained Module Architecture guide in usage_docs

## Support

For questions about:
- **Sustained Modules**: See `usage_docs/SUSTAINED-MODULE-ARCHITECTURE.md`
- **DataTableModalShell**: See `usage_docs/settle-admin/DataTableModalShell.md`
- **This Module**: See `modules/admin/agenda/README.md`

---

**Module Status:** ✅ Complete and Ready to Use

**Last Updated:** January 2026
