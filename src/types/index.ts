// ============================================
// DesTrack - TypeScript Type Definitions
// ============================================

// Priority levels for requirements
export type Priority = 'low' | 'medium' | 'high' | 'critical';

// Status for requirements tracking
export type RequirementStatus = 'not-started' | 'in-progress' | 'complete' | 'blocked';

// Implementation node types
export type NodeType = 'directory' | 'file' | 'class' | 'method';

// ============================================
// Core Entities
// ============================================

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  order: number;
  projectId: string;
}

export interface Subcategory {
  id: string;
  name: string;
  order: number;
  categoryId: string;
}

export interface Requirement {
  id: string;
  code: string;
  title: string;
  description: string;
  priority: Priority;
  status: RequirementStatus;
  subcategoryId: string;
}

export interface ImplementationNode {
  id: string;
  type: NodeType;
  name: string;
  parentId: string | null;
  requirementId: string;
  notes: string | null;
  order: number;
}

// ============================================
// UI State
// ============================================

export interface UIState {
  selectedProjectId: string | null;
  selectedRequirementId: string | null;
  expandedCategoryIds: Set<string>;
  expandedSubcategoryIds: Set<string>;
  expandedNodeIds: Set<string>;
  isAddingCategory: boolean;
  isAddingSubcategory: string | null; // categoryId or null
  isAddingRequirement: string | null; // subcategoryId or null
  editingRequirementId: string | null;
  isAddNodeModalOpen: boolean;
  addNodeParentId: string | null;
  statusFilter: RequirementStatus | null;
}

// ============================================
// Store State
// ============================================

export interface ProjectState {
  projects: Project[];
  categories: Category[];
  subcategories: Subcategory[];
  requirements: Requirement[];
  implementationNodes: ImplementationNode[];
  ui: UIState;
}

// ============================================
// Store Actions
// ============================================

export interface ProjectActions {
  // Project operations
  addProject: (name: string, description: string) => void;
  updateProject: (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => void;
  deleteProject: (id: string) => void;
  selectProject: (id: string | null) => void;

  // Category operations
  addCategory: (projectId: string, name: string) => void;
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id' | 'projectId'>>) => void;
  deleteCategory: (id: string) => void;
  reorderCategory: (id: string, newOrder: number) => void;

  // Subcategory operations
  addSubcategory: (categoryId: string, name: string) => void;
  updateSubcategory: (id: string, updates: Partial<Omit<Subcategory, 'id' | 'categoryId'>>) => void;
  deleteSubcategory: (id: string) => void;
  reorderSubcategory: (id: string, newOrder: number) => void;

  // Requirement operations
  addRequirement: (subcategoryId: string, data: Omit<Requirement, 'id' | 'subcategoryId'>) => void;
  updateRequirement: (id: string, updates: Partial<Omit<Requirement, 'id' | 'subcategoryId'>>) => void;
  deleteRequirement: (id: string) => void;
  selectRequirement: (id: string | null) => void;

  // Implementation node operations
  addImplementationNode: (
    requirementId: string,
    parentId: string | null,
    data: Omit<ImplementationNode, 'id' | 'requirementId' | 'parentId' | 'order'>
  ) => void;
  updateImplementationNode: (id: string, updates: Partial<Omit<ImplementationNode, 'id' | 'requirementId'>>) => void;
  deleteImplementationNode: (id: string) => void;
  moveImplementationNode: (id: string, newParentId: string | null, newOrder: number) => void;

  // UI operations
  toggleCategoryExpanded: (id: string) => void;
  toggleSubcategoryExpanded: (id: string) => void;
  toggleNodeExpanded: (id: string) => void;
  setIsAddingCategory: (value: boolean) => void;
  setIsAddingSubcategory: (categoryId: string | null) => void;
  setIsAddingRequirement: (subcategoryId: string | null) => void;
  setEditingRequirementId: (id: string | null) => void;
  openAddNodeModal: (parentId: string | null) => void;
  closeAddNodeModal: () => void;
  setStatusFilter: (status: RequirementStatus | null) => void;

  // Persistence
  loadFromStorage: () => void;
  saveToStorage: () => void;
  exportToJson: () => string;
  importFromJson: (json: string) => boolean;
}

export type ProjectStore = ProjectState & ProjectActions;

// ============================================
// Export/Import Data Structure
// ============================================

export interface ExportData {
  version: string;
  exportedAt: string;
  project: Project;
  categories: Category[];
  subcategories: Subcategory[];
  requirements: Requirement[];
  implementationNodes: ImplementationNode[];
}

// ============================================
// Helper Types
// ============================================

// For tree rendering - category with nested children
export interface CategoryWithChildren extends Category {
  subcategories: SubcategoryWithChildren[];
}

export interface SubcategoryWithChildren extends Subcategory {
  requirements: Requirement[];
}

// For implementation tree rendering
export interface ImplementationNodeWithChildren extends ImplementationNode {
  children: ImplementationNodeWithChildren[];
}

// Coverage statistics
export interface CoverageStats {
  totalRequirements: number;
  requirementsWithImplementation: number;
  coveragePercentage: number;
  byStatus: Record<RequirementStatus, number>;
  byPriority: Record<Priority, number>;
}
