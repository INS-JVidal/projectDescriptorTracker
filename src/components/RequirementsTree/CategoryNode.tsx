import { useState } from 'react';
import { useRequirements } from '../../hooks/useRequirements';
import { SubcategoryNode } from './SubcategoryNode';
import type { CategoryWithChildren } from '../../types';
import styles from './CategoryNode.module.css';

interface Props {
  category: CategoryWithChildren;
}

export function CategoryNode({ category }: Props) {
  const {
    expandedCategoryIds,
    isAddingSubcategory,
    toggleCategoryExpanded,
    removeCategory,
    renameCategory,
    createSubcategory,
    setIsAddingSubcategory,
  } = useRequirements();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(category.name);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');

  const isExpanded = expandedCategoryIds.has(category.id);
  const isAddingSubcategoryHere = isAddingSubcategory === category.id;

  const handleToggle = () => {
    toggleCategoryExpanded(category.id);
  };

  const handleEditSubmit = () => {
    if (editName.trim() && editName !== category.name) {
      renameCategory(category.id, editName.trim());
    }
    setIsEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditName(category.name);
    }
  };

  const handleAddSubcategory = () => {
    if (newSubcategoryName.trim()) {
      createSubcategory(category.id, newSubcategoryName.trim());
      setNewSubcategoryName('');
    }
  };

  const handleAddSubcategoryKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddSubcategory();
    } else if (e.key === 'Escape') {
      setIsAddingSubcategory(null);
      setNewSubcategoryName('');
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
            {category.name}
          </span>
        )}

        <div className={styles.actions}>
          <button
            onClick={() => setIsAddingSubcategory(category.id)}
            className={styles.actionBtn}
            title="Add subcategory"
          >
            +
          </button>
          <button
            onClick={() => removeCategory(category.id)}
            className={styles.actionBtn}
            title="Delete category"
          >
            x
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className={styles.children}>
          {category.subcategories.map((subcategory) => (
            <SubcategoryNode key={subcategory.id} subcategory={subcategory} />
          ))}

          {isAddingSubcategoryHere && (
            <div className={styles.addForm}>
              <input
                type="text"
                value={newSubcategoryName}
                onChange={(e) => setNewSubcategoryName(e.target.value)}
                onKeyDown={handleAddSubcategoryKeyDown}
                placeholder="Subcategory name..."
                className={styles.input}
                autoFocus
              />
              <div className={styles.addFormActions}>
                <button onClick={handleAddSubcategory} className={styles.btnConfirm}>
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsAddingSubcategory(null);
                    setNewSubcategoryName('');
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
