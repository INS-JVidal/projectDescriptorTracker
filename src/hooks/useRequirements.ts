import { useMemo } from 'react';
import { useProjectStore } from '../store/projectStore';
import type { Requirement, CategoryWithChildren, Priority, RequirementStatus } from '../types';
import { buildRequirementsTree, calculateCoverageStats } from '../utils/treeHelpers';

export function useRequirements() {
  const {
    categories,
    subcategories,
    requirements,
    implementationNodes,
    ui,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
    reorderSubcategory,
    addRequirement,
    updateRequirement,
    deleteRequirement,
    selectRequirement,
    toggleCategoryExpanded,
    toggleSubcategoryExpanded,
    setIsAddingCategory,
    setIsAddingSubcategory,
    setIsAddingRequirement,
    setEditingRequirementId,
    setStatusFilter,
  } = useProjectStore();

  // Build the hierarchical tree for the current project
  const requirementsTree = useMemo((): CategoryWithChildren[] => {
    if (!ui.selectedProjectId) return [];

    // Filter requirements by status if a filter is set
    const filteredRequirements = ui.statusFilter
      ? requirements.filter((r) => r.status === ui.statusFilter)
      : requirements;

    return buildRequirementsTree(categories, subcategories, filteredRequirements, ui.selectedProjectId);
  }, [categories, subcategories, requirements, ui.selectedProjectId, ui.statusFilter]);

  // Get the currently selected requirement
  const selectedRequirement = useMemo((): Requirement | null => {
    if (!ui.selectedRequirementId) return null;
    return requirements.find((r) => r.id === ui.selectedRequirementId) || null;
  }, [requirements, ui.selectedRequirementId]);

  // Calculate coverage stats for the current project
  const coverageStats = useMemo(() => {
    if (!ui.selectedProjectId) {
      return {
        totalRequirements: 0,
        requirementsWithImplementation: 0,
        coveragePercentage: 0,
        byStatus: { 'not-started': 0, 'in-progress': 0, complete: 0, blocked: 0 },
        byPriority: { low: 0, medium: 0, high: 0, critical: 0 },
      };
    }

    const projectCategoryIds = categories
      .filter((c) => c.projectId === ui.selectedProjectId)
      .map((c) => c.id);
    const projectSubcategoryIds = subcategories
      .filter((s) => projectCategoryIds.includes(s.categoryId))
      .map((s) => s.id);
    const projectRequirements = requirements.filter((r) =>
      projectSubcategoryIds.includes(r.subcategoryId)
    );

    return calculateCoverageStats(projectRequirements, implementationNodes);
  }, [categories, subcategories, requirements, implementationNodes, ui.selectedProjectId]);

  // Category operations
  const createCategory = (name: string) => {
    if (!ui.selectedProjectId) return;
    addCategory(ui.selectedProjectId, name);
  };

  const renameCategory = (id: string, name: string) => {
    updateCategory(id, { name });
  };

  const removeCategory = (id: string) => {
    if (window.confirm('Delete this category and all its subcategories and requirements?')) {
      deleteCategory(id);
    }
  };

  // Subcategory operations
  const createSubcategory = (categoryId: string, name: string) => {
    addSubcategory(categoryId, name);
  };

  const renameSubcategory = (id: string, name: string) => {
    updateSubcategory(id, { name });
  };

  const removeSubcategory = (id: string) => {
    if (window.confirm('Delete this subcategory and all its requirements?')) {
      deleteSubcategory(id);
    }
  };

  // Requirement operations
  const createRequirement = (
    subcategoryId: string,
    data: { code: string; title: string; description: string; priority: Priority; status: RequirementStatus }
  ) => {
    addRequirement(subcategoryId, data);
  };

  const editRequirement = (
    id: string,
    updates: Partial<{ code: string; title: string; description: string; priority: Priority; status: RequirementStatus }>
  ) => {
    updateRequirement(id, updates);
  };

  const removeRequirement = (id: string) => {
    if (window.confirm('Delete this requirement and all its implementation mappings?')) {
      deleteRequirement(id);
    }
  };

  return {
    // Data
    requirementsTree,
    selectedRequirement,
    coverageStats,

    // UI state
    expandedCategoryIds: ui.expandedCategoryIds,
    expandedSubcategoryIds: ui.expandedSubcategoryIds,
    isAddingCategory: ui.isAddingCategory,
    isAddingSubcategory: ui.isAddingSubcategory,
    isAddingRequirement: ui.isAddingRequirement,
    editingRequirementId: ui.editingRequirementId,
    selectedRequirementId: ui.selectedRequirementId,
    statusFilter: ui.statusFilter,

    // Category actions
    createCategory,
    renameCategory,
    removeCategory,
    reorderCategory,
    toggleCategoryExpanded,
    setIsAddingCategory,

    // Subcategory actions
    createSubcategory,
    renameSubcategory,
    removeSubcategory,
    reorderSubcategory,
    toggleSubcategoryExpanded,
    setIsAddingSubcategory,

    // Requirement actions
    createRequirement,
    editRequirement,
    removeRequirement,
    selectRequirement,
    setIsAddingRequirement,
    setEditingRequirementId,

    // Filter actions
    setStatusFilter,
  };
}

export type UseRequirementsReturn = ReturnType<typeof useRequirements>;
