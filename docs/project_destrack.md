# Project DesTrack — Requirements Traceability System

*Planning Document v1.0*

---

## 1. Vision & Purpose

A web-based tool that allows you to:

1. **Define project requirements** in a hierarchical structure (Category → Subcategory → Requirement)
2. **Map each requirement** to its implementation artifacts (directories, files, classes, methods)
3. **Visualize traceability** — see at a glance which code implements which requirement

This addresses a real pedagogical need: students often struggle to connect *what* they're building (requirements) with *where* it lives in code (implementation).

---

## 2. Core Data Model

```
Project
  └── Category (e.g., "User Management")
        └── Subcategory (e.g., "Authentication")
              └── Requirement (e.g., "Users can reset password via email")
                    └── Implementation Tree
                          ├── 📁 Directory: /src/auth
                          │     └── 📄 File: PasswordResetService.cs
                          │           └── 🔷 Class: PasswordResetService
                          │                 ├── ⚙️ Method: GenerateResetToken()
                          │                 └── ⚙️ Method: ValidateToken()
                          └── 📁 Directory: /src/email
                                └── 📄 File: EmailSender.cs
                                      └── 🔷 Class: EmailSender
                                            └── ⚙️ Method: SendResetEmail()
```

### 2.1 Entity Relationships

| Entity | Fields | Relationships |
|--------|--------|---------------|
| **Project** | id, name, description, createdAt | has many Categories |
| **Category** | id, name, order, projectId | belongs to Project, has many Subcategories |
| **Subcategory** | id, name, order, categoryId | belongs to Category, has many Requirements |
| **Requirement** | id, code, title, description, priority, status, subcategoryId | belongs to Subcategory, has many ImplementationNodes |
| **ImplementationNode** | id, type (dir/file/class/method), name, parentId, requirementId, notes | self-referential tree, belongs to Requirement |

---

## 3. User Interface Structure

### 3.1 Main Layout (Three-Panel Design)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Project: Coffee Shop System ▼]                        [+ New Project] │
├──────────────────────┬──────────────────────────────────────────────────┤
│                      │                                                  │
│  REQUIREMENTS TREE   │  REQUIREMENT DETAIL + IMPLEMENTATION TREE        │
│                      │                                                  │
│  ▼ 📂 Orders         │  ┌─────────────────────────────────────────────┐ │
│    ▼ 📁 Processing   │  │ REQ-2.1.3: Calculate order total with      │ │
│      ☑ REQ-2.1.1     │  │ discounts                                   │ │
│      ☑ REQ-2.1.2     │  │ Priority: High | Status: In Progress        │ │
│      ◐ REQ-2.1.3 ◀── │  └─────────────────────────────────────────────┘ │
│      ☐ REQ-2.1.4     │                                                  │
│    ▶ 📁 History      │  IMPLEMENTATION MAPPING                          │
│  ▶ 📂 Inventory      │  ─────────────────────────────────────────────── │
│  ▶ 📂 Reporting      │  ▼ 📁 /src/Orders           [+ Add Node]         │
│                      │    ▼ 📄 OrderCalculator.cs                       │
│                      │      ▼ 🔷 OrderCalculator                        │
│                      │        ⚙️ CalculateTotal()      [Edit] [Delete]  │
│                      │        ⚙️ ApplyDiscounts()      [Edit] [Delete]  │
│                      │    ▼ 📄 DiscountService.cs                       │
│                      │      ▼ 🔷 DiscountService                        │
│                      │        ⚙️ GetApplicableDiscounts()               │
│                      │                                                  │
│  [+ Category]        │  Notes: "Uses strategy pattern for discount     │
│                      │  calculation. See DiscountStrategy interface."   │
└──────────────────────┴──────────────────────────────────────────────────┘
```

### 3.2 Key Interactions

| Action | Behavior |
|--------|----------|
| Click requirement in left tree | Load detail + implementation tree in right panel |
| Drag node in implementation tree | Reorder or reparent within the tree |
| Right-click any node | Context menu: Edit, Delete, Add child |
| Double-click node name | Inline editing |
| Click [+ Add Node] | Modal to add directory/file/class/method |

---

## 4. Feature Breakdown

### 4.1 Phase 1: Core Functionality (MVP)

| Feature | Description |
|---------|-------------|
| **Project CRUD** | Create, rename, delete projects |
| **Requirements hierarchy** | Add/edit/delete/reorder categories, subcategories, requirements |
| **Implementation tree** | Add/edit/delete nodes; drag-drop reordering; tree expand/collapse |
| **Persistence** | LocalStorage initially, then IndexedDB for larger datasets |
| **Export/Import** | JSON export for backup and sharing |

### 4.2 Phase 2: Enhanced Traceability

| Feature | Description |
|---------|-------------|
| **Requirement status** | Not started, In progress, Complete, Blocked |
| **Coverage dashboard** | Visual indicator of how many requirements have implementation mappings |
| **Search** | Find requirements or implementation nodes by name |
| **Filtering** | Filter by status, priority, or coverage |

### 4.3 Phase 3: Collaboration & Integration

| Feature | Description |
|---------|-------------|
| **Backend API** | Node.js/Express or similar for multi-user support |
| **User accounts** | Authentication, project sharing |
| **Import from code** | Parse a project directory to auto-suggest file/class/method structure |
| **Link to source** | Optional URLs to GitHub files/lines |

---

## 5. Technical Architecture

### 5.1 Frontend Stack (React SPA)

```
/src
  /components
    /Layout
      ThreePanelLayout.jsx
      Header.jsx
    /RequirementsTree
      RequirementsTree.jsx        # Left panel
      CategoryNode.jsx
      SubcategoryNode.jsx
      RequirementNode.jsx
    /RequirementDetail
      RequirementDetail.jsx       # Right panel header
      RequirementForm.jsx
    /ImplementationTree
      ImplementationTree.jsx      # Right panel body
      TreeNode.jsx                # Recursive component
      AddNodeModal.jsx
    /Dashboard
      CoverageSummary.jsx
  /hooks
    useProjects.js
    useRequirements.js
    useImplementationTree.js
  /store
    projectStore.js               # Zustand or similar
  /utils
    treeHelpers.js                # Tree manipulation functions
    exportImport.js
  /types
    index.ts                      # TypeScript interfaces
```

### 5.2 State Management Approach

```javascript
// Simplified store structure
{
  projects: [...],
  currentProjectId: "proj-1",
  categories: [...],
  subcategories: [...],
  requirements: [...],
  implementationNodes: [...],
  ui: {
    selectedRequirementId: "req-2.1.3",
    expandedNodes: Set([...])
  }
}
```

### 5.3 Tree Component Strategy

The implementation tree is the most complex UI element. Approach:

1. **Recursive rendering** — each `TreeNode` renders its children
2. **Controlled expansion** — store expanded node IDs in state
3. **Drag-drop** — use `react-dnd` or `@dnd-kit/core`
4. **Inline editing** — toggle between display and input mode

---

## 6. Data Persistence Strategy

### 6.1 MVP: Browser Storage

```javascript
// On every state change
localStorage.setItem('reqTracer_data', JSON.stringify(state));

// On app load
const saved = localStorage.getItem('reqTracer_data');
if (saved) initializeStore(JSON.parse(saved));
```

### 6.2 Future: Backend API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/projects` | GET, POST | List/create projects |
| `/api/projects/:id` | GET, PUT, DELETE | Single project operations |
| `/api/projects/:id/export` | GET | Full JSON export |
| `/api/projects/:id/import` | POST | Restore from JSON |

---

## 7. Key UI Components Specification

### 7.1 Requirements Tree (Left Panel)

- Collapsible hierarchy: Project → Category → Subcategory → Requirement
- Visual indicators for requirement status (checkbox icons: ☐ ◐ ☑)
- Drag-drop reordering within same level
- Context menu for CRUD operations
- "Add" buttons at each level

### 7.2 Implementation Tree (Right Panel)

- Node types with distinct icons:
  - 📁 Directory (yellow folder)
  - 📄 File (document icon)
  - 🔷 Class (blue diamond)
  - ⚙️ Method (gear)
- Each node can have children (except methods, typically)
- Optional "notes" field per node
- Expand/collapse all button
- Visual hierarchy through indentation

### 7.3 Modals

| Modal | Fields |
|-------|--------|
| **Add/Edit Requirement** | Code, Title, Description (rich text), Priority (dropdown), Status (dropdown) |
| **Add/Edit Implementation Node** | Type (dropdown), Name, Notes, Parent (auto-set or selectable) |
| **Export/Import** | File picker, preview, confirmation |

---

## 8. Development Phases & Timeline

### 8.1 Phase 1: Foundation (Week 1-2)

| Task | Deliverable |
|------|-------------|
| Project setup | React + TypeScript + Vite scaffolding |
| Data model | TypeScript interfaces, Zustand store |
| Basic layout | Three-panel responsive layout |
| Requirements CRUD | Left panel with categories/subcategories/requirements |

### 8.2 Phase 2: Implementation Trees (Week 3-4)

| Task | Deliverable |
|------|-------------|
| Tree component | Recursive TreeNode with expand/collapse |
| Node CRUD | Add, edit, delete nodes with modal forms |
| Drag-drop | Reorder and reparent nodes |
| Persistence | LocalStorage save/load |

### 8.3 Phase 3: Polish & Features (Week 5-6)

| Task | Deliverable |
|------|-------------|
| Export/Import | JSON file handling |
| Search & filter | Quick find across requirements and nodes |
| Coverage indicators | Dashboard showing traceability completeness |
| UI refinement | Keyboard shortcuts, accessibility, responsive design |

---

## 9. Pedagogical Applications

This tool directly supports teaching methodology:

| Use Case | How It Helps |
|----------|--------------|
| **Project specification** | Students document requirements before coding |
| **Traceability exercise** | Map existing code to requirements (PRIMM: Investigate) |
| **Code review** | Verify all requirements have implementation |
| **Portfolio documentation** | Export as evidence of planning process |
| **Pair programming** | Navigator tracks which requirement is being implemented |

---

## 10. Open Questions

Before starting implementation, decisions to make:

1. **Single-user vs multi-user?** MVP can be browser-only; collaboration features needed for students working in teams?

2. **Predefined node types?** Should users be able to define custom types beyond Directory/File/Class/Method (e.g., Interface, Test, Config)?

3. **Rich text for descriptions?** Markdown support for requirement descriptions, or plain text is sufficient?

4. **Import from IDE?** Would parsing a project's file structure to auto-generate the implementation tree be valuable?

---

## 11. Appendix: Sample JSON Data Structure

```json
{
  "project": {
    "id": "proj-001",
    "name": "Coffee Shop System",
    "description": "Sustainable coffee shop management application",
    "createdAt": "2026-01-22T10:00:00Z"
  },
  "categories": [
    {
      "id": "cat-001",
      "name": "Orders",
      "order": 1,
      "projectId": "proj-001"
    }
  ],
  "subcategories": [
    {
      "id": "sub-001",
      "name": "Processing",
      "order": 1,
      "categoryId": "cat-001"
    }
  ],
  "requirements": [
    {
      "id": "req-001",
      "code": "REQ-2.1.3",
      "title": "Calculate order total with discounts",
      "description": "System must calculate the total order amount applying all applicable discounts",
      "priority": "high",
      "status": "in-progress",
      "subcategoryId": "sub-001"
    }
  ],
  "implementationNodes": [
    {
      "id": "node-001",
      "type": "directory",
      "name": "/src/Orders",
      "parentId": null,
      "requirementId": "req-001",
      "notes": null
    },
    {
      "id": "node-002",
      "type": "file",
      "name": "OrderCalculator.cs",
      "parentId": "node-001",
      "requirementId": "req-001",
      "notes": null
    },
    {
      "id": "node-003",
      "type": "class",
      "name": "OrderCalculator",
      "parentId": "node-002",
      "requirementId": "req-001",
      "notes": null
    },
    {
      "id": "node-004",
      "type": "method",
      "name": "CalculateTotal()",
      "parentId": "node-003",
      "requirementId": "req-001",
      "notes": "Main entry point for order calculation"
    }
  ]
}
```

---

*Document created: January 2026*
*Project: DesTrack — Requirements Traceability System*
