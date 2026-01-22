import { useImplementationTree } from '../../hooks/useImplementationTree';
import { TreeNode } from './TreeNode';
import { AddNodeModal } from './AddNodeModal';
import styles from './ImplementationTree.module.css';

export function ImplementationTree() {
  const {
    implementationTree,
    hasNodes,
    isAddNodeModalOpen,
    addNodeParentId,
    openAddNodeModal,
    closeAddNodeModal,
    addNode,
    expandAll,
    collapseAll,
  } = useImplementationTree();

  const handleAddRootNode = () => {
    openAddNodeModal(null);
  };

  const handleAddNode = (data: Parameters<typeof addNode>[1]) => {
    addNode(addNodeParentId, data);
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <button onClick={handleAddRootNode} className={styles.btnAdd}>
          + Add Node
        </button>
        {hasNodes && (
          <>
            <button onClick={expandAll} className={styles.btnTool}>
              Expand All
            </button>
            <button onClick={collapseAll} className={styles.btnTool}>
              Collapse All
            </button>
          </>
        )}
      </div>

      {hasNodes ? (
        <div className={styles.tree}>
          {implementationTree.map((node) => (
            <TreeNode key={node.id} node={node} depth={0} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>No implementation nodes yet.</p>
          <p>Click "Add Node" to start mapping code to this requirement.</p>
        </div>
      )}

      {isAddNodeModalOpen && (
        <AddNodeModal
          parentId={addNodeParentId}
          onAdd={handleAddNode}
          onClose={closeAddNodeModal}
        />
      )}
    </div>
  );
}
