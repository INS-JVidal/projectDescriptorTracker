import { useState } from 'react';
import { useImplementationTree } from '../../hooks/useImplementationTree';
import type { ImplementationNodeWithChildren, NodeType } from '../../types';
import { getNodeTypeIcon, getNodeTypeName } from '../../utils/treeHelpers';
import styles from './TreeNode.module.css';

interface Props {
  node: ImplementationNodeWithChildren;
  depth: number;
}

export function TreeNode({ node, depth }: Props) {
  const {
    isNodeExpanded,
    toggleNodeExpanded,
    openAddNodeModal,
    editNode,
    removeNode,
  } = useImplementationTree();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(node.name);
  const [editType, setEditType] = useState<NodeType>(node.type);
  const [editNotes, setEditNotes] = useState(node.notes || '');

  const hasChildren = node.children.length > 0;
  const isExpanded = isNodeExpanded(node.id);

  const handleToggle = () => {
    if (hasChildren) {
      toggleNodeExpanded(node.id);
    }
  };

  const handleAddChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    openAddNodeModal(node.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeNode(node.id);
  };

  const handleEditSubmit = () => {
    if (editName.trim()) {
      editNode(node.id, {
        name: editName.trim(),
        type: editType,
        notes: editNotes.trim() || null,
      });
    }
    setIsEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditName(node.name);
      setEditType(node.type);
      setEditNotes(node.notes || '');
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditName(node.name);
    setEditType(node.type);
    setEditNotes(node.notes || '');
  };

  if (isEditing) {
    return (
      <div className={styles.container} style={{ paddingLeft: `${depth * 1.25}rem` }}>
        <div className={styles.editForm}>
          <div className={styles.editRow}>
            <select
              value={editType}
              onChange={(e) => setEditType(e.target.value as NodeType)}
              className={styles.editSelect}
            >
              <option value="directory">Directory</option>
              <option value="file">File</option>
              <option value="class">Class</option>
              <option value="method">Method</option>
            </select>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleEditKeyDown}
              className={styles.editInput}
              autoFocus
            />
          </div>
          <textarea
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
            onKeyDown={handleEditKeyDown}
            placeholder="Notes (optional)"
            className={styles.editTextarea}
            rows={2}
          />
          <div className={styles.editActions}>
            <button onClick={handleEditSubmit} className={styles.btnConfirm}>
              Save
            </button>
            <button onClick={handleEditCancel} className={styles.btnCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.nodeRow}
        style={{ paddingLeft: `${depth * 1.25}rem` }}
        onClick={handleToggle}
      >
        <button className={styles.expandBtn}>
          {hasChildren ? (isExpanded ? '\u25BC' : '\u25B6') : '\u00A0'}
        </button>

        <span className={styles.icon}>{getNodeTypeIcon(node.type)}</span>

        <span className={styles.name}>{node.name}</span>

        <span className={styles.type}>{getNodeTypeName(node.type)}</span>

        <div className={styles.actions}>
          {node.type !== 'method' && (
            <button
              onClick={handleAddChild}
              className={styles.actionBtn}
              title="Add child node"
            >
              +
            </button>
          )}
          <button onClick={handleEdit} className={styles.actionBtn} title="Edit node">
            e
          </button>
          <button onClick={handleDelete} className={styles.actionBtn} title="Delete node">
            x
          </button>
        </div>
      </div>

      {node.notes && (
        <div
          className={styles.notes}
          style={{ paddingLeft: `${(depth + 1) * 1.25 + 1.5}rem` }}
        >
          {node.notes}
        </div>
      )}

      {isExpanded && hasChildren && (
        <div className={styles.children}>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
