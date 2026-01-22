import { useRequirements } from '../../hooks/useRequirements';
import { RequirementForm } from './RequirementForm';
import { getStatusName, getPriorityName } from '../../utils/treeHelpers';
import styles from './RequirementDetail.module.css';

export function RequirementDetail() {
  const {
    selectedRequirement,
    editingRequirementId,
    setEditingRequirementId,
    editRequirement,
    removeRequirement,
  } = useRequirements();

  if (!selectedRequirement) {
    return null;
  }

  const isEditing = editingRequirementId === selectedRequirement.id;

  const handleEdit = () => {
    setEditingRequirementId(selectedRequirement.id);
  };

  const handleCancel = () => {
    setEditingRequirementId(null);
  };

  const handleSave = (updates: Parameters<typeof editRequirement>[1]) => {
    editRequirement(selectedRequirement.id, updates);
    setEditingRequirementId(null);
  };

  const handleDelete = () => {
    removeRequirement(selectedRequirement.id);
  };

  if (isEditing) {
    return (
      <div className={styles.container}>
        <RequirementForm
          requirement={selectedRequirement}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.code}>{selectedRequirement.code}</span>
          <h2 className={styles.title}>{selectedRequirement.title}</h2>
        </div>
        <div className={styles.actions}>
          <button onClick={handleEdit} className={styles.btnEdit}>
            Edit
          </button>
          <button onClick={handleDelete} className={styles.btnDelete}>
            Delete
          </button>
        </div>
      </div>

      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Priority:</span>
          <span className={`${styles.metaValue} ${styles[`priority${selectedRequirement.priority}`]}`}>
            {getPriorityName(selectedRequirement.priority)}
          </span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Status:</span>
          <span className={`${styles.metaValue} ${styles[`status${selectedRequirement.status.replace('-', '')}`]}`}>
            {getStatusName(selectedRequirement.status)}
          </span>
        </div>
      </div>

      {selectedRequirement.description && (
        <div className={styles.description}>
          <h3 className={styles.sectionTitle}>Description</h3>
          <p className={styles.descriptionText}>{selectedRequirement.description}</p>
        </div>
      )}
    </div>
  );
}
