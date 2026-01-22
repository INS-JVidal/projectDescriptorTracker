import { useState } from 'react';
import { useRequirements } from '../../hooks/useRequirements';
import { RequirementNode } from './RequirementNode';
import type { SubcategoryWithChildren, Priority, RequirementStatus } from '../../types';
import styles from './SubcategoryNode.module.css';

interface Props {
  subcategory: SubcategoryWithChildren;
}

export function SubcategoryNode({ subcategory }: Props) {
  const {
    expandedSubcategoryIds,
    isAddingRequirement,
    toggleSubcategoryExpanded,
    removeSubcategory,
    renameSubcategory,
    createRequirement,
    setIsAddingRequirement,
  } = useRequirements();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(subcategory.name);
  const [newReqCode, setNewReqCode] = useState('');
  const [newReqTitle, setNewReqTitle] = useState('');

  const isExpanded = expandedSubcategoryIds.has(subcategory.id);
  const isAddingRequirementHere = isAddingRequirement === subcategory.id;

  const handleToggle = () => {
    toggleSubcategoryExpanded(subcategory.id);
  };

  const handleEditSubmit = () => {
    if (editName.trim() && editName !== subcategory.name) {
      renameSubcategory(subcategory.id, editName.trim());
    }
    setIsEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditName(subcategory.name);
    }
  };

  const handleAddRequirement = () => {
    if (newReqCode.trim() && newReqTitle.trim()) {
      createRequirement(subcategory.id, {
        code: newReqCode.trim(),
        title: newReqTitle.trim(),
        description: '',
        priority: 'medium' as Priority,
        status: 'not-started' as RequirementStatus,
      });
      setNewReqCode('');
      setNewReqTitle('');
    }
  };

  const handleAddRequirementKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddRequirement();
    } else if (e.key === 'Escape') {
      setIsAddingRequirement(null);
      setNewReqCode('');
      setNewReqTitle('');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={handleToggle} className={styles.expandBtn}>
          {isExpanded ? '\u25BC' : '\u25B6'}
        </button>

        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={handleEditKeyDown}
            className={styles.editInput}
            autoFocus
          />
        ) : (
          <span
            className={styles.name}
            onDoubleClick={() => setIsEditing(true)}
          >
            {subcategory.name}
          </span>
        )}

        <div className={styles.actions}>
          <button
            onClick={() => setIsAddingRequirement(subcategory.id)}
            className={styles.actionBtn}
            title="Add requirement"
          >
            +
          </button>
          <button
            onClick={() => removeSubcategory(subcategory.id)}
            className={styles.actionBtn}
            title="Delete subcategory"
          >
            x
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className={styles.children}>
          {subcategory.requirements.map((requirement) => (
            <RequirementNode key={requirement.id} requirement={requirement} />
          ))}

          {isAddingRequirementHere && (
            <div className={styles.addForm}>
              <input
                type="text"
                value={newReqCode}
                onChange={(e) => setNewReqCode(e.target.value)}
                onKeyDown={handleAddRequirementKeyDown}
                placeholder="Code (e.g., REQ-001)..."
                className={styles.input}
                autoFocus
              />
              <input
                type="text"
                value={newReqTitle}
                onChange={(e) => setNewReqTitle(e.target.value)}
                onKeyDown={handleAddRequirementKeyDown}
                placeholder="Title..."
                className={styles.input}
              />
              <div className={styles.addFormActions}>
                <button onClick={handleAddRequirement} className={styles.btnConfirm}>
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsAddingRequirement(null);
                    setNewReqCode('');
                    setNewReqTitle('');
                  }}
                  className={styles.btnCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
