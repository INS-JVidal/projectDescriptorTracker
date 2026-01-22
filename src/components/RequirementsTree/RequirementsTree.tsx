import { useState } from 'react';
import { useRequirements } from '../../hooks/useRequirements';
import { CategoryNode } from './CategoryNode';
import styles from './RequirementsTree.module.css';

export function RequirementsTree() {
  const {
    requirementsTree,
    isAddingCategory,
    setIsAddingCategory,
    createCategory,
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

  return (
    <div className={styles.container}>
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
