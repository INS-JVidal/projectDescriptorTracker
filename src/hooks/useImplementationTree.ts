import { useMemo } from 'react';
import { useProjectStore } from '../store/projectStore';
import type { ImplementationNodeWithChildren, NodeType } from '../types';
import { buildImplementationTree, getNodePath, wouldCreateCycle } from '../utils/treeHelpers';

export function useImplementationTree() {
  const {
    implementationNodes,
    ui,
    addImplementationNode,
    updateImplementationNode,
    deleteImplementationNode,
    moveImplementationNode,
    toggleNodeExpanded,
    openAddNodeModal,
    closeAddNodeModal,
  } = useProjectStore();

  // Build the tree for the selected requirement
  const implementationTree = useMemo((): ImplementationNodeWithChildren[] => {
    if (!ui.selectedRequirementId) return [];
    return buildImplementationTree(implementationNodes, ui.selectedRequirementId);
  }, [implementationNodes, ui.selectedRequirementId]);

  // Get flat list of nodes for the selected requirement
  const requirementNodes = useMemo(() => {
    if (!ui.selectedRequirementId) return [];
    return implementationNodes.filter((n) => n.requirementId === ui.selectedRequirementId);
  }, [implementationNodes, ui.selectedRequirementId]);

  // Add a new node
  const addNode = (
    parentId: string | null,
    data: { type: NodeType; name: string; notes: string | null }
  ) => {
    if (!ui.selectedRequirementId) return;
    addImplementationNode(ui.selectedRequirementId, parentId, data);
  };

  // Update a node
  const editNode = (
    id: string,
    updates: Partial<{ type: NodeType; name: string; notes: string | null; order: number }>
  ) => {
    updateImplementationNode(id, updates);
  };

  // Delete a node and its children
  const removeNode = (id: string) => {
    const hasChildren = implementationNodes.some((n) => n.parentId === id);

    const message = hasChildren
      ? 'Delete this node and all its children?'
      : 'Delete this node?';

    if (window.confirm(message)) {
      deleteImplementationNode(id);
    }
  };

  // Move a node to a new parent
  const moveNode = (id: string, newParentId: string | null, newOrder: number) => {
    // Prevent cycles
    if (wouldCreateCycle(implementationNodes, id, newParentId)) {
      alert('Cannot move a node to one of its descendants.');
      return false;
    }

    moveImplementationNode(id, newParentId, newOrder);
    return true;
  };

  // Get the path for a node (for display)
  const getPath = (nodeId: string): string[] => {
    return getNodePath(implementationNodes, nodeId);
  };

  // Check if a node is expanded
  const isNodeExpanded = (nodeId: string): boolean => {
    return ui.expandedNodeIds.has(nodeId);
  };

  // Expand all nodes for the current requirement
  const expandAll = () => {
    requirementNodes.forEach((node) => {
      if (!ui.expandedNodeIds.has(node.id)) {
        toggleNodeExpanded(node.id);
      }
    });
  };

  // Collapse all nodes for the current requirement
  const collapseAll = () => {
    requirementNodes.forEach((node) => {
      if (ui.expandedNodeIds.has(node.id)) {
        toggleNodeExpanded(node.id);
      }
    });
  };

  return {
    // Data
    implementationTree,
    requirementNodes,
    hasNodes: requirementNodes.length > 0,

    // UI state
    expandedNodeIds: ui.expandedNodeIds,
    isAddNodeModalOpen: ui.isAddNodeModalOpen,
    addNodeParentId: ui.addNodeParentId,

    // Node actions
    addNode,
    editNode,
    removeNode,
    moveNode,
    getPath,

    // UI actions
    isNodeExpanded,
    toggleNodeExpanded,
    expandAll,
    collapseAll,
    openAddNodeModal,
    closeAddNodeModal,
  };
}

export type UseImplementationTreeReturn = ReturnType<typeof useImplementationTree>;
