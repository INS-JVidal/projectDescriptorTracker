import { useState } from 'react';
import { useRequirements } from '../../hooks/useRequirements';
import { CategoryNode } from './CategoryNode';
import type { RequirementStatus } from '../../types';
import styles from './RequirementsTree.module.css';

export function RequirementsTree() {
  const {
    requirementsTree,
    isAddingCategory,
    setIsAddingCategory,
    createCategory,
    statusFilter,
    setStatusFilter,
  } = useRequirements();

  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      createCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    } else if (e.key === 'Escape') {
      setIsAddingCategory(false);
      setNewCategoryName('');
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatusFilter(value ? (value as RequirementStatus) : null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterBar}>
        <select
          value={statusFilter || ''}
          onChange={handleFilterChange}
          className={styles.filterSelect}
        >
          <option value="">All Statuses</option>
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="complete">Complete</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div className={styles.tree}>
        {requirementsTree.map((category) => (
          <CategoryNode key={category.id} category={category} />
        ))}
      </div>

      {isAddingCategory ? (
        <div className={styles.addForm}>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Category name..."
            className={styles.input}
            autoFocus
          />
          <div className={styles.addFormActions}>
            <button onClick={handleAddCategory} className={styles.btnConfirm}>
              Add
            </button>
            <button
              onClick={() => {
                setIsAddingCategory(false);
                setNewCategoryName('');
              }}
              className={styles.btnCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingCategory(true)}
          className={styles.addButton}
        >
          + Add Category
        </button>
      )}
    </div>
  );
}
