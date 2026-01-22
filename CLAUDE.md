Project Overview

  DesTrack is a web-based tool designed to help users (particularly students) connect requirements to their
  code implementation. It addresses the challenge of understanding what is being built and where it lives in
   code.

  Key Concepts

  Data Hierarchy:
  - Project → Category → Subcategory → Requirement → Implementation Nodes
  - Implementation nodes form a tree structure (directory → file → class → method)

  UI Design:
  - Three-panel layout with requirements tree on the left, and requirement detail + implementation mapping
  on the right

  Technical Choices
  ┌───────────────────┬────────────────────────────┐
  │      Aspect       │           Choice           │
  ├───────────────────┼────────────────────────────┤
  │ Framework         │ React + TypeScript + Vite  │
  ├───────────────────┼────────────────────────────┤
  │ State Management  │ Zustand                    │
  ├───────────────────┼────────────────────────────┤
  │ Persistence (MVP) │ LocalStorage / IndexedDB   │
  ├───────────────────┼────────────────────────────┤
  │ Drag-drop         │ react-dnd or @dnd-kit/core │
  └───────────────────┴────────────────────────────┘
  Development Phases

  1. Phase 1 (MVP): Project/requirements CRUD, implementation trees, local persistence, JSON export/import
  2. Phase 2: Status tracking, coverage dashboard, search/filtering
  3. Phase 3: Backend API, user accounts, code parsing integration

  Open Questions from the Document

  The spec lists several decisions to be made:
  - Single-user vs multi-user for MVP?
  - Custom node types beyond Directory/File/Class/Method?
  - Markdown support for descriptions?
  - Auto-import from IDE/file structure?
