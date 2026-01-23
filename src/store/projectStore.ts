import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ProjectStore,
  ProjectState,
  Project,
  Category,
  Subcategory,
  Requirement,
  ImplementationNode,
  ExportData,
  RequirementStatus,
} from '../types';

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

const initialUIState = {
  selectedProjectId: null,
  selectedRequirementId: null,
  expandedCategoryIds: new Set<string>(),
  expandedSubcategoryIds: new Set<string>(),
  expandedNodeIds: new Set<string>(),
  isAddingCategory: false,
  isAddingSubcategory: null,
  isAddingRequirement: null,
  editingRequirementId: null,
  isAddNodeModalOpen: false,
  addNodeParentId: null,
  statusFilter: null as RequirementStatus | null,
};

const initialState: ProjectState = {
  projects: [],
  categories: [],
  subcategories: [],
  requirements: [],
  implementationNodes: [],
  ui: initialUIState,
};

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Project operations
      addProject: (name, description) => {
        const now = new Date().toISOString();
        const project: Project = {
          id: generateId(),
          name,
          description,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          projects: [...state.projects, project],
          ui: { ...state.ui, selectedProjectId: project.id },
        }));
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      deleteProject: (id) => {
        set((state) => {
          const categoryIds = state.categories.filter((c) => c.projectId === id).map((c) => c.id);
          const subcategoryIds = state.subcategories.filter((s) => categoryIds.includes(s.categoryId)).map((s) => s.id);
          const requirementIds = state.requirements.filter((r) => subcategoryIds.includes(r.subcategoryId)).map((r) => r.id);

          return {
            projects: state.projects.filter((p) => p.id !== id),
            categories: state.categories.filter((c) => c.projectId !== id),
            subcategories: state.subcategories.filter((s) => !categoryIds.includes(s.categoryId)),
            requirements: state.requirements.filter((r) => !subcategoryIds.includes(r.subcategoryId)),
            implementationNodes: state.implementationNodes.filter((n) => !requirementIds.includes(n.requirementId)),
            ui: {
              ...state.ui,
              selectedProjectId: state.ui.selectedProjectId === id ? null : state.ui.selectedProjectId,
              selectedRequirementId:
                state.ui.selectedRequirementId && requirementIds.includes(state.ui.selectedRequirementId)
                  ? null
                  : state.ui.selectedRequirementId,
            },
          };
        });
      },

      selectProject: (id) => {
        set((state) => ({
          ui: { ...state.ui, selectedProjectId: id, selectedRequirementId: null },
        }));
      },

      // Category operations
      addCategory: (projectId, name) => {
        const state = get();
        const maxOrder = Math.max(0, ...state.categories.filter((c) => c.projectId === projectId).map((c) => c.order));
        const category: Category = {
          id: generateId(),
          name,
          order: maxOrder + 1,
          projectId,
        };
        set((state) => ({
          categories: [...state.categories, category],
          ui: { ...state.ui, isAddingCategory: false },
        }));
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
      },

      deleteCategory: (id) => {
        set((state) => {
          const subcategoryIds = state.subcategories.filter((s) => s.categoryId === id).map((s) => s.id);
          const requirementIds = state.requirements.filter((r) => subcategoryIds.includes(r.subcategoryId)).map((r) => r.id);

          return {
            categories: state.categories.filter((c) => c.id !== id),
            subcategories: state.subcategories.filter((s) => s.categoryId !== id),
            requirements: state.requirements.filter((r) => !subcategoryIds.includes(r.subcategoryId)),
            implementationNodes: state.implementationNodes.filter((n) => !requirementIds.includes(n.requirementId)),
            ui: {
              ...state.ui,
              selectedRequirementId:
                state.ui.selectedRequirementId && requirementIds.includes(state.ui.selectedRequirementId)
                  ? null
                  : state.ui.selectedRequirementId,
            },
          };
        });
      },

      reorderCategory: (id, newOrder) => {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, order: newOrder } : c)),
        }));
      },

      // Subcategory operations
      addSubcategory: (categoryId, name) => {
        const state = get();
        const maxOrder = Math.max(0, ...state.subcategories.filter((s) => s.categoryId === categoryId).map((s) => s.order));
        const subcategory: Subcategory = {
          id: generateId(),
          name,
          order: maxOrder + 1,
          categoryId,
        };
        set((state) => ({
          subcategories: [...state.subcategories, subcategory],
          ui: { ...state.ui, isAddingSubcategory: null },
        }));
      },

      updateSubcategory: (id, updates) => {
        set((state) => ({
          subcategories: state.subcategories.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        }));
      },

      deleteSubcategory: (id) => {
        set((state) => {
          const requirementIds = state.requirements.filter((r) => r.subcategoryId === id).map((r) => r.id);

          return {
            subcategories: state.subcategories.filter((s) => s.id !== id),
            requirements: state.requirements.filter((r) => r.subcategoryId !== id),
            implementationNodes: state.implementationNodes.filter((n) => !requirementIds.includes(n.requirementId)),
            ui: {
              ...state.ui,
              selectedRequirementId:
                state.ui.selectedRequirementId && requirementIds.includes(state.ui.selectedRequirementId)
                  ? null
                  : state.ui.selectedRequirementId,
            },
          };
        });
      },

      reorderSubcategory: (id, newOrder) => {
        set((state) => ({
          subcategories: state.subcategories.map((s) => (s.id === id ? { ...s, order: newOrder } : s)),
        }));
      },

      // Requirement operations
      addRequirement: (subcategoryId, data) => {
        const requirement: Requirement = {
          id: generateId(),
          subcategoryId,
          ...data,
        };
        set((state) => ({
          requirements: [...state.requirements, requirement],
          ui: { ...state.ui, isAddingRequirement: null },
        }));
      },

      updateRequirement: (id, updates) => {
        set((state) => ({
          requirements: state.requirements.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        }));
      },

      deleteRequirement: (id) => {
        set((state) => ({
          requirements: state.requirements.filter((r) => r.id !== id),
          implementationNodes: state.implementationNodes.filter((n) => n.requirementId !== id),
          ui: {
            ...state.ui,
            selectedRequirementId: state.ui.selectedRequirementId === id ? null : state.ui.selectedRequirementId,
          },
        }));
      },

      selectRequirement: (id) => {
        set((state) => ({
          ui: { ...state.ui, selectedRequirementId: id, editingRequirementId: null },
        }));
      },

      // Implementation node operations
      addImplementationNode: (requirementId, parentId, data) => {
        const state = get();
        const siblings = state.implementationNodes.filter(
          (n) => n.requirementId === requirementId && n.parentId === parentId
        );
        const maxOrder = Math.max(0, ...siblings.map((n) => n.order));
        const node: ImplementationNode = {
          id: generateId(),
          requirementId,
          parentId,
          order: maxOrder + 1,
          ...data,
        };
        set((state) => ({
          implementationNodes: [...state.implementationNodes, node],
          ui: { ...state.ui, isAddNodeModalOpen: false, addNodeParentId: null },
        }));
      },

      updateImplementationNode: (id, updates) => {
        set((state) => ({
          implementationNodes: state.implementationNodes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
        }));
      },

      deleteImplementationNode: (id) => {
        const deleteRecursive = (nodeId: string, nodes: ImplementationNode[]): ImplementationNode[] => {
          const childIds = nodes.filter((n) => n.parentId === nodeId).map((n) => n.id);
          let result = nodes.filter((n) => n.id !== nodeId);
          for (const childId of childIds) {
            result = deleteRecursive(childId, result);
          }
          return result;
        };

        set((state) => ({
          implementationNodes: deleteRecursive(id, state.implementationNodes),
        }));
      },

      moveImplementationNode: (id, newParentId, newOrder) => {
        set((state) => ({
          implementationNodes: state.implementationNodes.map((n) =>
            n.id === id ? { ...n, parentId: newParentId, order: newOrder } : n
          ),
        }));
      },

      // UI operations
      toggleCategoryExpanded: (id) => {
        set((state) => {
          const newExpanded = new Set(state.ui.expandedCategoryIds);
          if (newExpanded.has(id)) {
            newExpanded.delete(id);
          } else {
            newExpanded.add(id);
          }
          return { ui: { ...state.ui, expandedCategoryIds: newExpanded } };
        });
      },

      toggleSubcategoryExpanded: (id) => {
        set((state) => {
          const newExpanded = new Set(state.ui.expandedSubcategoryIds);
          if (newExpanded.has(id)) {
            newExpanded.delete(id);
          } else {
            newExpanded.add(id);
          }
          return { ui: { ...state.ui, expandedSubcategoryIds: newExpanded } };
        });
      },

      toggleNodeExpanded: (id) => {
        set((state) => {
          const newExpanded = new Set(state.ui.expandedNodeIds);
          if (newExpanded.has(id)) {
            newExpanded.delete(id);
          } else {
            newExpanded.add(id);
          }
          return { ui: { ...state.ui, expandedNodeIds: newExpanded } };
        });
      },

      setIsAddingCategory: (value) => {
        set((state) => ({ ui: { ...state.ui, isAddingCategory: value } }));
      },

      setIsAddingSubcategory: (categoryId) => {
        set((state) => ({ ui: { ...state.ui, isAddingSubcategory: categoryId } }));
      },

      setIsAddingRequirement: (subcategoryId) => {
        set((state) => ({ ui: { ...state.ui, isAddingRequirement: subcategoryId } }));
      },

      setEditingRequirementId: (id) => {
        set((state) => ({ ui: { ...state.ui, editingRequirementId: id } }));
      },

      openAddNodeModal: (parentId) => {
        set((state) => ({ ui: { ...state.ui, isAddNodeModalOpen: true, addNodeParentId: parentId } }));
      },

      closeAddNodeModal: () => {
        set((state) => ({ ui: { ...state.ui, isAddNodeModalOpen: false, addNodeParentId: null } }));
      },

      setStatusFilter: (status: RequirementStatus | null) => {
        set((state) => ({ ui: { ...state.ui, statusFilter: status } }));
      },

      // Persistence
      loadFromStorage: () => {
        // Handled by zustand persist middleware
      },

      saveToStorage: () => {
        // Handled by zustand persist middleware
      },

      exportToJson: () => {
        const state = get();
        const projectId = state.ui.selectedProjectId;
        if (!projectId) return '';

        const project = state.projects.find((p) => p.id === projectId);
        if (!project) return '';

        const categoryIds = state.categories.filter((c) => c.projectId === projectId).map((c) => c.id);
        const subcategoryIds = state.subcategories.filter((s) => categoryIds.includes(s.categoryId)).map((s) => s.id);
        const requirementIds = state.requirements.filter((r) => subcategoryIds.includes(r.subcategoryId)).map((r) => r.id);

        const exportData: ExportData = {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          project,
          categories: state.categories.filter((c) => c.projectId === projectId),
          subcategories: state.subcategories.filter((s) => categoryIds.includes(s.categoryId)),
          requirements: state.requirements.filter((r) => subcategoryIds.includes(r.subcategoryId)),
          implementationNodes: state.implementationNodes.filter((n) => requirementIds.includes(n.requirementId)),
        };

        return JSON.stringify(exportData, null, 2);
      },

      importFromJson: (json) => {
        try {
          const data: ExportData = JSON.parse(json);
          if (!data.version || !data.project) {
            return false;
          }

          // Generate new IDs to avoid conflicts
          const idMap = new Map<string, string>();

          const newProject: Project = {
            ...data.project,
            id: generateId(),
            name: `${data.project.name} (Imported)`,
          };
          idMap.set(data.project.id, newProject.id);

          const newCategories = data.categories.map((c) => {
            const newId = generateId();
            idMap.set(c.id, newId);
            return { ...c, id: newId, projectId: newProject.id };
          });

          const newSubcategories = data.subcategories.map((s) => {
            const newId = generateId();
            idMap.set(s.id, newId);
            return { ...s, id: newId, categoryId: idMap.get(s.categoryId) || s.categoryId };
          });

          const newRequirements = data.requirements.map((r) => {
            const newId = generateId();
            idMap.set(r.id, newId);
            return { ...r, id: newId, subcategoryId: idMap.get(r.subcategoryId) || r.subcategoryId };
          });

          const newNodes = data.implementationNodes.map((n) => {
            const newId = generateId();
            idMap.set(n.id, newId);
            return {
              ...n,
              id: newId,
              requirementId: idMap.get(n.requirementId) || n.requirementId,
              parentId: n.parentId ? idMap.get(n.parentId) || n.parentId : null,
            };
          });

          set((state) => ({
            projects: [...state.projects, newProject],
            categories: [...state.categories, ...newCategories],
            subcategories: [...state.subcategories, ...newSubcategories],
            requirements: [...state.requirements, ...newRequirements],
            implementationNodes: [...state.implementationNodes, ...newNodes],
            ui: { ...state.ui, selectedProjectId: newProject.id },
          }));

          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'destrack-storage',
      partialize: (state) => ({
        projects: state.projects,
        categories: state.categories,
        subcategories: state.subcategories,
        requirements: state.requirements,
        implementationNodes: state.implementationNodes,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as Partial<ProjectState>),
        ui: currentState.ui, // Always use fresh UI state with proper Set objects
      }),
    }
  )
);
