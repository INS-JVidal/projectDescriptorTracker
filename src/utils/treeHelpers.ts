import type {
  Category,
  Subcategory,
  Requirement,
  ImplementationNode,
  CategoryWithChildren,
  SubcategoryWithChildren,
  ImplementationNodeWithChildren,
  CoverageStats,
  RequirementStatus,
  Priority,
} from '../types';

/**
 * Build a hierarchical tree of categories with nested subcategories and requirements
 */
export function buildRequirementsTree(
  categories: Category[],
  subcategories: Subcategory[],
  requirements: Requirement[],
  projectId: string
): CategoryWithChildren[] {
  const projectCategories = categories
    .filter((c) => c.projectId === projectId)
    .sort((a, b) => a.order - b.order);

  return projectCategories.map((category) => {
    const categorySubcategories = subcategories
      .filter((s) => s.categoryId === category.id)
      .sort((a, b) => a.order - b.order);

    const subcategoriesWithReqs: SubcategoryWithChildren[] = categorySubcategories.map((subcategory) => {
      const subcategoryRequirements = requirements.filter((r) => r.subcategoryId === subcategory.id);

      return {
        ...subcategory,
        requirements: subcategoryRequirements,
      };
    });

    return {
      ...category,
      subcategories: subcategoriesWithReqs,
    };
  });
}

/**
 * Build a hierarchical tree of implementation nodes for a specific requirement
 */
export function buildImplementationTree(
  nodes: ImplementationNode[],
  requirementId: string
): ImplementationNodeWithChildren[] {
  const requirementNodes = nodes.filter((n) => n.requirementId === requirementId);

  function buildSubtree(parentId: string | null): ImplementationNodeWithChildren[] {
    return requirementNodes
      .filter((n) => n.parentId === parentId)
      .sort((a, b) => a.order - b.order)
      .map((node) => ({
        ...node,
        children: buildSubtree(node.id),
      }));
  }

  return buildSubtree(null);
}

/**
 * Find a node by ID in a flat array
 */
export function findNodeById(nodes: ImplementationNode[], id: string): ImplementationNode | undefined {
  return nodes.find((n) => n.id === id);
}

/**
 * Get all ancestor node IDs for a given node
 */
export function getAncestorIds(nodes: ImplementationNode[], nodeId: string): string[] {
  const ancestors: string[] = [];
  let currentNode = nodes.find((n) => n.id === nodeId);

  while (currentNode && currentNode.parentId) {
    ancestors.push(currentNode.parentId);
    currentNode = nodes.find((n) => n.id === currentNode!.parentId);
  }

  return ancestors;
}

/**
 * Get all descendant node IDs for a given node
 */
export function getDescendantIds(nodes: ImplementationNode[], nodeId: string): string[] {
  const descendants: string[] = [];
  const directChildren = nodes.filter((n) => n.parentId === nodeId);

  for (const child of directChildren) {
    descendants.push(child.id);
    descendants.push(...getDescendantIds(nodes, child.id));
  }

  return descendants;
}

/**
 * Calculate the depth of a node in the tree
 */
export function getNodeDepth(nodes: ImplementationNode[], nodeId: string): number {
  let depth = 0;
  let currentNode = nodes.find((n) => n.id === nodeId);

  while (currentNode && currentNode.parentId) {
    depth++;
    currentNode = nodes.find((n) => n.id === currentNode!.parentId);
  }

  return depth;
}

/**
 * Get the path from root to a node (array of node names)
 */
export function getNodePath(nodes: ImplementationNode[], nodeId: string): string[] {
  const path: string[] = [];
  let currentNode = nodes.find((n) => n.id === nodeId);

  while (currentNode) {
    path.unshift(currentNode.name);
    currentNode = currentNode.parentId ? nodes.find((n) => n.id === currentNode!.parentId) : undefined;
  }

  return path;
}

/**
 * Check if moving a node to a new parent would create a cycle
 */
export function wouldCreateCycle(
  nodes: ImplementationNode[],
  nodeId: string,
  newParentId: string | null
): boolean {
  if (!newParentId) return false;
  if (nodeId === newParentId) return true;

  const descendantIds = getDescendantIds(nodes, nodeId);
  return descendantIds.includes(newParentId);
}

/**
 * Reorder siblings after removing or adding a node
 */
export function reorderSiblings(
  nodes: ImplementationNode[],
  parentId: string | null,
  requirementId: string
): ImplementationNode[] {
  const siblings = nodes
    .filter((n) => n.parentId === parentId && n.requirementId === requirementId)
    .sort((a, b) => a.order - b.order);

  const reorderedIds = new Set(siblings.map((s) => s.id));

  return nodes.map((node) => {
    if (reorderedIds.has(node.id)) {
      const index = siblings.findIndex((s) => s.id === node.id);
      return { ...node, order: index + 1 };
    }
    return node;
  });
}

/**
 * Calculate coverage statistics for a set of requirements
 */
export function calculateCoverageStats(
  requirements: Requirement[],
  implementationNodes: ImplementationNode[]
): CoverageStats {
  const requirementsWithImpl = new Set(implementationNodes.map((n) => n.requirementId));

  const byStatus: Record<RequirementStatus, number> = {
    'not-started': 0,
    'in-progress': 0,
    complete: 0,
    blocked: 0,
  };

  const byPriority: Record<Priority, number> = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  };

  for (const req of requirements) {
    byStatus[req.status]++;
    byPriority[req.priority]++;
  }

  return {
    totalRequirements: requirements.length,
    requirementsWithImplementation: requirements.filter((r) => requirementsWithImpl.has(r.id)).length,
    coveragePercentage:
      requirements.length > 0
        ? Math.round((requirements.filter((r) => requirementsWithImpl.has(r.id)).length / requirements.length) * 100)
        : 0,
    byStatus,
    byPriority,
  };
}

/**
 * Get the icon for a node type
 */
export function getNodeTypeIcon(type: ImplementationNode['type']): string {
  const icons: Record<ImplementationNode['type'], string> = {
    directory: '\uD83D\uDCC1', // folder
    file: '\uD83D\uDCC4', // file
    class: '\uD83D\uDD37', // blue diamond
    method: '\u2699\uFE0F', // gear
  };
  return icons[type];
}

/**
 * Get the display name for a node type
 */
export function getNodeTypeName(type: ImplementationNode['type']): string {
  const names: Record<ImplementationNode['type'], string> = {
    directory: 'Directory',
    file: 'File',
    class: 'Class',
    method: 'Method',
  };
  return names[type];
}

/**
 * Get status icon for requirement
 */
export function getStatusIcon(status: RequirementStatus): string {
  const icons: Record<RequirementStatus, string> = {
    'not-started': '\u2610', // empty checkbox
    'in-progress': '\u25D0', // half-filled circle
    complete: '\u2611', // checked checkbox
    blocked: '\u26D4', // no entry
  };
  return icons[status];
}

/**
 * Get display name for status
 */
export function getStatusName(status: RequirementStatus): string {
  const names: Record<RequirementStatus, string> = {
    'not-started': 'Not Started',
    'in-progress': 'In Progress',
    complete: 'Complete',
    blocked: 'Blocked',
  };
  return names[status];
}

/**
 * Get display name for priority
 */
export function getPriorityName(priority: Priority): string {
  const names: Record<Priority, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
  };
  return names[priority];
}
